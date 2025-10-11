from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional, List, Dict
from models.schemas import InterviewState, AnalyzedResponse, ResponseQuality
from agents.analyzer import analyzer, DeepAnalysis
from agents.probe import probe_agent
from agents.interviewer import interviewer_agent
from agents.summary import summary_agent
from storage.db_client import db_client
from utils.early_termination import early_termination_detector

# ========================================================================
# LANGGRAPH STATE DEFINITION - WITH EARLY TERMINATION
# ========================================================================
class InterviewGraphState(TypedDict):
    """
    The state object passed between nodes in the LangGraph workflow.
    This represents all the data needed to conduct an interview.
    """
    # Core identifiers
    session_id: str
    respondent_id: str
    template_id: str
    research_topic: str
    
    # Conversation state
    conversation_history: List[Dict[str, str]]
    user_response: str
    current_question: Optional[str]
    
    # Analysis results
    analyzed_response: Optional[AnalyzedResponse]
    deep_analysis: Optional[DeepAnalysis]
    
    # Control flags
    is_probe: bool
    is_complete: bool
    should_terminate_early: bool
    termination_reason: Optional[str]
    probe_count: int
    question_count: int
    max_questions: int
    
    # Final output
    summary: Optional[Dict]

# ========================================================================
# NODE IMPLEMENTATIONS - WITH IMPROVED EARLY TERMINATION
# ========================================================================

async def analyze_response_node(state: InterviewGraphState) -> Dict:
    """
    Step 1: Analyzes the user's response to determine quality and sentiment.
    NOW WITH COMPREHENSIVE EARLY TERMINATION DETECTION.
    """
    user_response = state['user_response']
    print(f"🔍 Analyzing response: {user_response[:80]}...")
    
    # Add user response to conversation history
    state["conversation_history"].append({
        "role": "user",
        "content": user_response
    })
    
    # Perform basic analysis first (we need sentiment for termination check)
    analyzed = await analyzer.analyze(user_response)
    
    print(f"  📊 Analysis Result:")
    print(f"     - Sentiment: {analyzed.sentiment.value}")
    print(f"     - Quality: {analyzed.quality.value.upper()}")
    print(f"     - Word Count: {analyzed.word_count}")
    
    # CRITICAL: Comprehensive termination check using ALL signals
    should_exit, exit_reason = early_termination_detector.should_terminate(
        user_response,
        analyzed.sentiment.value,
        state["conversation_history"],
        state["probe_count"]
    )
    
    if should_exit:
        print(f"🛑 EARLY TERMINATION DETECTED: {exit_reason}")
        print(f"  📊 Analysis Result (for terminated interview):")
        print(f"     - Termination Reason: {exit_reason}")
        
        return {
            "analyzed_response": analyzed,
            "conversation_history": state["conversation_history"],
            "should_terminate_early": True,
            "termination_reason": exit_reason,
            "is_complete": True
        }
    
    # No termination detected - continue normally
    print(f"  ✅ No exit intent detected - continuing interview")
    
    return {
        "analyzed_response": analyzed,
        "conversation_history": state["conversation_history"],
        "should_terminate_early": False,
        "termination_reason": None
    }

async def deep_analysis_node(state: InterviewGraphState) -> Dict:
    """
    Step 2: Performs deeper analysis to extract insights.
    SKIPPED if early termination is flagged.
    """
    if state.get("should_terminate_early"):
        print(f"  ⏭️  Skipping deep analysis - early termination flagged")
        return {
            "deep_analysis": None
        }
    
    print(f"🧠 Performing deep analysis...")
    
    # Get conversation context (last 3 exchanges)
    recent_context = state["conversation_history"][-6:]
    context_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_context])
    
    deep_analysis_result = await analyzer.deep_analyze(
        state["user_response"],
        context_str
    )
    
    print(f"  💡 Deep Analysis:")
    print(f"     - Emotional Tone: {deep_analysis_result.emotional_tone}")
    print(f"     - Needs Follow-up: {deep_analysis_result.needs_follow_up}")
    print(f"     - Key Insights: {len(deep_analysis_result.key_insights)}")
    if deep_analysis_result.suggested_follow_up_topic != "None":
        print(f"     - Follow-up Topic: {deep_analysis_result.suggested_follow_up_topic}")
    
    # Add extracted insights to the analyzed response
    analyzed = state["analyzed_response"]
    analyzed.key_insights.extend(deep_analysis_result.key_insights)
    
    # Save to database
    await db_client.save_analyzed_response(
        analyzed,
        state["session_id"],
        state["respondent_id"]
    )
    
    return {
        "deep_analysis": deep_analysis_result,
        "analyzed_response": analyzed
    }

async def probe_node(state: InterviewGraphState) -> Dict:
    """
    Step 3a: Generates a probing question if response was shallow/vague.
    """
    print(f"⚡ PROBE TRIGGERED - Generating follow-up question...")
    print(f"   Current probe count: {state['probe_count']}")
    
    # Get the original question that was asked
    original_question = None
    for msg in reversed(state["conversation_history"]):
        if msg["role"] == "assistant":
            original_question = msg["content"]
            break
    
    probe_question = await probe_agent.generate_probe_question(
        original_question=original_question or "",
        user_response=state["user_response"],
        topic=state["deep_analysis"].suggested_follow_up_topic if state.get("deep_analysis") else "details",
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"]
    )
    
    print(f"   ✅ Probe question generated: {probe_question[:100]}...")
    
    # Update conversation history
    new_history = state["conversation_history"].copy()
    new_history.append({"role": "assistant", "content": probe_question})
    
    return {
        "current_question": probe_question,
        "conversation_history": new_history,
        "probe_count": state["probe_count"] + 1,
        "is_probe": True
    }

async def generate_question_node(state: InterviewGraphState) -> Dict:
    """
    Step 3b: Generates the next main interview question.
    """
    print(f"📝 Generating next question (Q{state['question_count'] + 1})...")
    
    # Get all insights so far
    all_insights = await db_client.get_all_insights_for_session(state["session_id"])
    
    # Create a temporary InterviewState for the interviewer agent
    temp_state = InterviewState(
        session_id=state["session_id"],
        respondent_id=state["respondent_id"],
        template_id=state["template_id"],
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"],
        current_question_count=state["question_count"],
        max_questions=state["max_questions"]
    )
    
    next_question = await interviewer_agent.generate_next_question(temp_state, all_insights)
    
    print(f"   ✅ Next question: {next_question[:100]}...")
    
    # Update conversation history
    new_history = state["conversation_history"].copy()
    new_history.append({"role": "assistant", "content": next_question})
    
    return {
        "current_question": next_question,
        "conversation_history": new_history,
        "question_count": state["question_count"] + 1,
        "probe_count": 0,  # Reset probe count for new question
        "is_probe": False
    }

async def generate_summary_node(state: InterviewGraphState) -> Dict:
    """
    Step 4: Generates the final summary when interview is complete.
    UPDATED to handle both normal completion and early termination.
    """
    is_early = state.get("should_terminate_early", False)
    
    if is_early:
        print(f"📊 Generating EARLY TERMINATION summary...")
        print(f"   Reason: {state.get('termination_reason', 'unknown')}")
        print(f"   Questions completed: {state['question_count']}/{state['max_questions']}")
    else:
        print(f"📊 Generating final summary...")
        print(f"   Total questions: {state['question_count']}")
    
    # Get all analyzed responses
    all_analyzed_responses = await db_client.get_analyzed_responses(state["session_id"])
    
    # Create InterviewState for summary generation
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
    
    # Generate summary with early termination context
    summary = await summary_agent.generate_summary(
        final_state, 
        all_analyzed_responses,
        early_termination=is_early,
        termination_reason=state.get('termination_reason')
    )
    
    # Save to database
    await db_client.save_summary(summary)
    
    # Update interview status
    status = "terminated_early" if is_early else "completed"
    await db_client.update_interview_status(state["session_id"], status)
    
    return {
        "is_complete": True,
        "summary": summary.model_dump()
    }

# ========================================================================
# CONDITIONAL EDGES (ROUTING LOGIC) - WITH IMPROVED TERMINATION
# ========================================================================

def should_probe(state: InterviewGraphState) -> str:
    """
    Decides whether to probe deeper or move to next question.
    
    CRITICAL: Checks for early termination FIRST before any probing logic.
    """
    # HIGHEST PRIORITY: Check for early termination
    if state.get("should_terminate_early"):
        print(f"\n  🛑 EARLY TERMINATION DETECTED")
        print(f"     Reason: {state.get('termination_reason')}")
        print(f"  ➡️ ROUTING TO: TERMINATE → SUMMARY")
        return "terminate"
    
    analyzed = state["analyzed_response"]
    deep = state.get("deep_analysis")
    probe_count = state["probe_count"]
    
    # Check multiple conditions for probing
    quality_says_probe = analyzed.quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]
    deep_says_probe = deep and deep.needs_follow_up
    can_probe = probe_count < 2  # Max 2 consecutive probes
    
    print(f"\n  🎯 PROBE DECISION:")
    print(f"     - Quality: {analyzed.quality.value} → Probe? {quality_says_probe}")
    print(f"     - Deep Analysis: needs_follow_up={deep_says_probe if deep else 'N/A'}")
    print(f"     - Probe Count: {probe_count}/2")
    print(f"     - Can Probe: {can_probe}")
    
    # Probe if EITHER quality OR deep analysis says we should AND we can still probe
    should_probe_decision = (quality_says_probe or deep_says_probe) and can_probe
    
    if should_probe_decision:
        print(f"  ➡️ ROUTING TO: PROBE ⚡")
        return "probe"
    else:
        reason = "max probes reached" if not can_probe else "response is good quality"
        print(f"  ➡️ ROUTING TO: NEXT_QUESTION ({reason})")
        return "next_question"

def should_continue(state: InterviewGraphState) -> str:
    """
    Decides whether to continue the interview or generate summary.
    
    CRITICAL: Checks for early termination before checking question count.
    """
    # HIGHEST PRIORITY: Check for early termination
    if state.get("should_terminate_early"):
        print(f"\n  🛑 EARLY TERMINATION - Going directly to summary")
        return "summary"
    
    current_count = state["question_count"]
    max_count = state["max_questions"]
    
    print(f"\n  📈 CONTINUATION CHECK:")
    print(f"     - Questions: {current_count}/{max_count}")
    
    if current_count >= max_count:
        print(f"  ➡️ ROUTING TO: SUMMARY 📊 (Max questions reached)")
        return "summary"
    
    print(f"  ➡️ ROUTING TO: CONTINUE (END - waiting for user)")
    return "continue"

# ========================================================================
# GRAPH CONSTRUCTION
# ========================================================================

def build_interview_workflow():
    """
    Builds and compiles the LangGraph workflow for interview management.
    
    Flow with Improved Early Termination:
    1. User responds → analyze_response (comprehensive termination check!)
    2. → deep_analysis (skipped if terminating early)
    3. → [Decision] terminate OR probe OR generate_question
    4. → [If terminate] generate_summary (with early termination context)
    5. → [If probe] END (wait for next user input)
    6. → [If question] check if complete → summary OR END
    """
    
    workflow = StateGraph(InterviewGraphState)
    
    # Add all nodes
    workflow.add_node("analyze_response", analyze_response_node)
    workflow.add_node("deep_analysis", deep_analysis_node)
    workflow.add_node("probe", probe_node)
    workflow.add_node("generate_question", generate_question_node)
    workflow.add_node("generate_summary", generate_summary_node)
    
    # Set entry point
    workflow.set_entry_point("analyze_response")
    
    # Define the flow
    workflow.add_edge("analyze_response", "deep_analysis")
    
    # After deep analysis, decide to terminate, probe, or continue
    workflow.add_conditional_edges(
        "deep_analysis",
        should_probe,
        {
            "terminate": "generate_summary",
            "probe": "probe",
            "next_question": "generate_question"
        }
    )
    
    # After probe, END and wait for user's next response
    workflow.add_edge("probe", END)
    
    # After generating question, check if interview is complete
    workflow.add_conditional_edges(
        "generate_question",
        should_continue,
        {
            "summary": "generate_summary",
            "continue": END
        }
    )
    
    # After summary, END
    workflow.add_edge("generate_summary", END)
    
    return workflow.compile()

# ========================================================================
# SINGLETON INSTANCE
# ========================================================================
interview_workflow = build_interview_workflow()

print("✅ LangGraph workflow compiled successfully!")
print("   Flow: analyze → deep_analysis → [terminate OR probe OR next_question] → [summary OR continue]")
print("   ⚡ Early termination support: ENHANCED")
print("      - Detects explicit exit phrases: 'end this', 'stop', 'conclude'")
print("      - Detects negative emotions: 'uncomfortable', 'frustrated'")
print("      - Detects repeated dismissive responses: 'yeah', 'ok', 'whatever'")
print("      - Detects probe fatigue: too many probes with short responses")