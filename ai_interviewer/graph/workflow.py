from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional, List, Dict
from models.schemas import AnalyzedResponse, ResponseQuality
from agents.analyzer import analyzer, DeepAnalysis
from agents.probe import probe_agent
from agents.interviewer import interviewer_agent
from agents.summary import summary_agent
from storage.db_client import db_client
from utils.early_termination import early_termination_detector

# ========================================================================
# LANGGRAPH STATE DEFINITION
# ========================================================================
class InterviewGraphState(TypedDict):
    """The state object passed between nodes in the LangGraph workflow."""
    session_id: str
    respondent_id: str
    template_id: str
    research_topic: str
    
    conversation_history: List[Dict[str, str]]
    user_response: str
    current_question: Optional[str]
    
    analyzed_response: Optional[AnalyzedResponse]
    deep_analysis: Optional[DeepAnalysis]
    
    is_probe: bool
    is_complete: bool
    should_terminate_early: bool
    termination_reason: Optional[str]
    probe_count: int
    question_count: int
    total_exchanges: int
    max_questions: int
    
    waiting_for_clarification: bool
    accumulated_insights: List[str]
    
    summary: Optional[Dict]

# ========================================================================
# NODE IMPLEMENTATIONS
# ========================================================================

async def analyze_response_node(state: InterviewGraphState) -> Dict:
    """Step 1: Fast analysis with early termination check."""
    user_response = state['user_response']
    print(f"🔍 Analyzing response: {user_response[:80]}...")
    
    # Add user response to conversation history
    new_history = state["conversation_history"].copy()
    new_history.append({
        "role": "user",
        "content": user_response
    })
    
    # Fast analysis
    analyzed = await analyzer.analyze(user_response)
    analyzed.session_id = state["session_id"]
    analyzed.respondent_id = state["respondent_id"]
    
    print(f"  📊 Quality: {analyzed.quality.value} | Sentiment: {analyzed.sentiment.value} | Words: {analyzed.word_count}")
    
    # Check for early termination
    should_exit, exit_reason = early_termination_detector.should_terminate(
        user_response,
        analyzed.sentiment.value,
        new_history,
        state["probe_count"]
    )
    
    current_exchanges = state.get("total_exchanges", 0)
    
    if should_exit:
        print(f"🛑 EARLY TERMINATION: {exit_reason}")
        
        return {
            "analyzed_response": analyzed,
            "conversation_history": new_history,
            "should_terminate_early": True,
            "termination_reason": exit_reason,
            "is_complete": True,
            "total_exchanges": current_exchanges + 1,
            "waiting_for_clarification": False
        }
    
    print(f"  ✅ Continuing interview")
    
    return {
        "analyzed_response": analyzed,
        "conversation_history": new_history,
        "should_terminate_early": False,
        "termination_reason": None,
        "total_exchanges": current_exchanges + 1,
        "waiting_for_clarification": False
    }

async def deep_analysis_node(state: InterviewGraphState) -> Dict:
    """Step 2: Deep analysis - ONLY for good quality responses."""
    if state.get("should_terminate_early"):
        print(f"  ⏭️ Skipping deep analysis - terminating")
        return {"deep_analysis": None}
    
    analyzed = state["analyzed_response"]
    
    # Skip deep analysis for shallow/vague - we'll probe them
    if analyzed.quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]:
        print(f"  ⚡ Skipping deep analysis - {analyzed.quality.value} response will be probed")
        
        minimal_deep = DeepAnalysis(
            key_insights=[],
            emotional_tone="neutral",
            needs_follow_up=True,
            suggested_follow_up_topic="more details"
        )
        
        return {"deep_analysis": minimal_deep}
    
    # Deep analysis for GOOD responses
    print(f"🧠 Deep analysis for good response...")
    
    recent_context = state["conversation_history"][-6:]
    context_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_context])
    
    deep_analysis_result = await analyzer.deep_analyze(
        state["user_response"],
        context_str
    )
    
    print(f"  💡 Insights: {len(deep_analysis_result.key_insights)}")
    
    # Add insights
    analyzed.key_insights.extend(deep_analysis_result.key_insights)
    
    # Get accumulated insights from probing
    accumulated = state.get("accumulated_insights", [])
    analyzed.key_insights.extend(accumulated)
    
    # Save to database
    await db_client.save_analyzed_response(
        analyzed,
        state["session_id"],
        state["respondent_id"]
    )
    
    return {
        "deep_analysis": deep_analysis_result,
        "analyzed_response": analyzed,
        "accumulated_insights": []
    }

async def internal_probe_node(state: InterviewGraphState) -> Dict:
    """Step 3a: INTERNAL PROBE with deviation detection and redirection."""
    print(f"⚡ INTERNAL PROBE (Count: {state['probe_count']})")
    
    # Find the original question
    original_question = None
    for i in range(len(state["conversation_history"]) - 1, -1, -1):
        msg = state["conversation_history"][i]
        if msg["role"] == "assistant":
            original_question = msg["content"]
            break
    
    if not original_question:
        original_question = f"the topic of {state['research_topic']}"
    
    print(f"   🎯 Original question: {original_question[:50]}...")
    
    # Generate probe with deviation detection
    probe_question = await probe_agent.generate_probe_question(
        original_question=original_question,
        user_response=state["user_response"],
        topic=state["deep_analysis"].suggested_follow_up_topic if state.get("deep_analysis") else "details",
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"]
    )
    
    print(f"   ✅ Probe: {probe_question[:80]}...")
    
    # Add probe to conversation history
    new_history = state["conversation_history"].copy()
    new_history.append({"role": "assistant", "content": probe_question})
    
    # Extract insights from shallow response
    accumulated = state.get("accumulated_insights", []).copy()
    if state["analyzed_response"].key_insights:
        accumulated.extend(state["analyzed_response"].key_insights)
    
    return {
        "current_question": probe_question,
        "conversation_history": new_history,
        "probe_count": state["probe_count"] + 1,
        "is_probe": True,
        "total_exchanges": state["total_exchanges"] + 1,
        "waiting_for_clarification": True,
        "accumulated_insights": accumulated
    }

async def generate_question_node(state: InterviewGraphState) -> Dict:
    """Step 3b: Generate next main question."""
    next_q_number = state["question_count"] + 1
    print(f"📝 Generating Question {next_q_number}/{state['max_questions']}...")
    
    # Get insights for context
    all_insights = await db_client.get_all_insights_for_session(state["session_id"])
    
    # Create temporary state for interviewer
    from models.schemas import InterviewState
    temp_state = InterviewState(
        session_id=state["session_id"],
        respondent_id=state["respondent_id"],
        template_id=state["template_id"],
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"],
        current_question_count=next_q_number,
        max_questions=state["max_questions"]
    )
    
    next_question = await interviewer_agent.generate_next_question(temp_state, all_insights)
    
    print(f"   ✅ Q{next_q_number}: {next_question[:80]}...")
    
    new_history = state["conversation_history"].copy()
    new_history.append({"role": "assistant", "content": next_question})
    
    return {
        "current_question": next_question,
        "conversation_history": new_history,
        "question_count": next_q_number,
        "probe_count": 0,
        "is_probe": False,
        "total_exchanges": state["total_exchanges"] + 1,
        "waiting_for_clarification": False,
        "accumulated_insights": []
    }

async def generate_summary_node(state: InterviewGraphState) -> Dict:
    """Step 4: Generate final summary."""
    is_early = state.get("should_terminate_early", False)
    
    print(f"📊 Generating {'EARLY TERMINATION' if is_early else 'FINAL'} summary...")
    print(f"   Questions: {state['question_count']}/{state['max_questions']}")
    
    all_analyzed_responses = await db_client.get_analyzed_responses(state["session_id"])
    
    from models.schemas import InterviewState
    final_state = InterviewState(
        session_id=state["session_id"],
        respondent_id=state["respondent_id"],
        template_id=state["template_id"],
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"],
        current_question_count=state["question_count"],
        max_questions=state["max_questions"],
        is_complete=True,
        should_terminate_early=is_early,
        termination_reason=state.get('termination_reason')
    )
    
    summary = await summary_agent.generate_summary(
        final_state, 
        all_analyzed_responses,
        early_termination=is_early,
        termination_reason=state.get('termination_reason')
    )
    
    await db_client.save_summary(summary)
    
    status = "terminated_early" if is_early else "completed"
    await db_client.update_interview_status(state["session_id"], status)
    
    return {
        "is_complete": True,
        "summary": summary.model_dump()
    }

# ========================================================================
# CONDITIONAL EDGES
# ========================================================================

def should_probe(state: InterviewGraphState) -> str:
    """Decides whether to probe internally or move to next question."""
    if state.get("should_terminate_early"):
        print(f"\n  🛑 TERMINATE → SUMMARY")
        return "terminate"
    
    analyzed = state["analyzed_response"]
    deep = state.get("deep_analysis")
    probe_count = state["probe_count"]
    
    # Max 1 probe reached
    if probe_count >= 1:
        print(f"\n  ⏭️ MAX PROBE (1) REACHED → FORCE NEXT QUESTION")
        return "next_question"
    
    # Check if response needs probing
    quality_needs_probe = analyzed.quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]
    deep_needs_probe = deep and deep.needs_follow_up
    
    should_probe_decision = quality_needs_probe or deep_needs_probe
    
    print(f"\n  🎯 Quality: {analyzed.quality.value} | Needs probe: {should_probe_decision} | Probes: {probe_count}/1")
    
    if should_probe_decision and probe_count == 0:
        print(f"  ➡️ INTERNAL PROBE ⚡")
        return "probe"
    else:
        print(f"  ➡️ GOOD RESPONSE or MAX PROBES → NEXT QUESTION 📝")
        return "next_question"

def should_continue(state: InterviewGraphState) -> str:
    """Decides whether to continue or generate summary."""
    if state.get("should_terminate_early"):
        print(f"\n  🛑 EARLY TERMINATION → SUMMARY")
        return "summary"
    
    current_count = state["question_count"]
    max_count = state["max_questions"]
    
    print(f"\n  📊 Progress: {current_count}/{max_count} questions")
    
    if current_count >= max_count:
        print(f"  ➡️ COMPLETE → SUMMARY 📊")
        return "summary"
    
    print(f"  ➡️ CONTINUE → WAIT FOR USER")
    return "continue"

# ========================================================================
# GRAPH CONSTRUCTION
# ========================================================================

def build_interview_workflow():
    """Builds the interview workflow with MAX 1 PROBE and deviation detection."""
    
    workflow = StateGraph(InterviewGraphState)
    
    # Add nodes
    workflow.add_node("analyze_response", analyze_response_node)
    workflow.add_node("deep_analysis", deep_analysis_node)
    workflow.add_node("internal_probe", internal_probe_node)
    workflow.add_node("generate_question", generate_question_node)
    workflow.add_node("generate_summary", generate_summary_node)
    
    # Set entry point
    workflow.set_entry_point("analyze_response")
    
    # Flow
    workflow.add_edge("analyze_response", "deep_analysis")
    
    workflow.add_conditional_edges(
        "deep_analysis",
        should_probe,
        {
            "terminate": "generate_summary",
            "probe": "internal_probe",
            "next_question": "generate_question"
        }
    )
    
    workflow.add_edge("internal_probe", END)
    
    workflow.add_conditional_edges(
        "generate_question",
        should_continue,
        {
            "summary": "generate_summary",
            "continue": END
        }
    )
    
    workflow.add_edge("generate_summary", END)
    
    return workflow.compile()

# ========================================================================
# SINGLETON INSTANCE
# ========================================================================
interview_workflow = build_interview_workflow()

print("✅ LangGraph workflow compiled!")
print("   📊 MAX PROBES: 1 per question")
print("   🔄 DEVIATION DETECTION: Enabled")
print("   ➡️ Deviation behavior: 'That's great! Now back to [original question]'")
print("   Flow: analyze → deep_analysis → [terminate OR probe OR next_question]")