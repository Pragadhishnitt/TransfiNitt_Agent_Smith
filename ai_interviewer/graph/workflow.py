from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional, List, Dict
from models.schemas import InterviewState, AnalyzedResponse, ResponseQuality
from agents.analyzer import analyzer, DeepAnalysis
from agents.probe import probe_agent
from agents.interviewer import interviewer_agent
from agents.summary import summary_agent
from storage.db_client import db_client

# ========================================================================
# LANGGRAPH STATE DEFINITION
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
    probe_count: int
    question_count: int
    max_questions: int
    
    # Final output
    summary: Optional[Dict]

# ========================================================================
# NODE IMPLEMENTATIONS
# ========================================================================

async def analyze_response_node(state: InterviewGraphState) -> Dict:
    """
    Step 1: Analyzes the user's response to determine quality and sentiment.
    This is the entry point after receiving user input.
    """
    print(f"🔍 Analyzing response: {state['user_response'][:50]}...")
    
    # Add user response to conversation history
    state["conversation_history"].append({
        "role": "user",
        "content": state["user_response"]
    })
    
    # Perform quick initial analysis
    analyzed = await analyzer.analyze(state["user_response"])
    
    return {
        "analyzed_response": analyzed,
        "conversation_history": state["conversation_history"]
    }

async def deep_analysis_node(state: InterviewGraphState) -> Dict:
    """
    Step 2: Performs deeper analysis to extract insights.
    This happens for all responses, even those that might need probing.
    """
    print(f"🧠 Performing deep analysis...")
    
    deep_analysis_result = await analyzer.deep_analyze(
        state["user_response"],
        state["research_topic"]
    )
    
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
    print(f"❓ Generating probe question...")
    
    probe_question = await probe_agent.generate_probe_question(
        topic=state["deep_analysis"].suggested_follow_up_topic,
        research_topic=state["research_topic"],
        conversation_history=state["conversation_history"]
    )
    
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
    
    # Generate next question
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
    """
    print(f"📊 Generating final summary...")
    
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
        is_complete=True
    )
    
    # Generate summary
    summary = await summary_agent.generate_summary(final_state, all_analyzed_responses)
    
    # Save to database
    await db_client.save_summary(summary)
    await db_client.update_interview_status(state["session_id"], "completed")
    
    return {
        "is_complete": True,
        "summary": summary.model_dump()
    }

# ========================================================================
# CONDITIONAL EDGES (ROUTING LOGIC)
# ========================================================================

def should_probe(state: InterviewGraphState) -> str:
    """
    Decides whether to probe deeper or move to next question.
    """
    quality = state["analyzed_response"].quality
    probe_count = state["probe_count"]
    
    # Probe if response is shallow/vague AND we haven't probed too much
    if quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE] and probe_count < 2:
        print(f"  → Routing to PROBE (quality={quality.value}, probe_count={probe_count})")
        return "probe"
    
    print(f"  → Routing to NEXT_QUESTION")
    return "next_question"

def should_continue(state: InterviewGraphState) -> str:
    """
    Decides whether to continue the interview or generate summary.
    """
    if state["question_count"] >= state["max_questions"]:
        print(f"  → Interview complete! Routing to SUMMARY")
        return "summary"
    
    print(f"  → Continuing interview...")
    return "continue"

# ========================================================================
# GRAPH CONSTRUCTION
# ========================================================================

def build_interview_workflow():
    """
    Builds and compiles the LangGraph workflow for interview management.
    
    Flow:
    1. User responds → analyze_response
    2. → deep_analysis
    3. → [Decision] probe OR generate_question
    4. → [If probe] END (wait for next user input)
    5. → [If question] check if complete → summary OR END
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
    
    workflow.add_conditional_edges(
        "deep_analysis",
        should_probe,
        {
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
    
    # Compile and return
    return workflow.compile()

# ========================================================================
# SINGLETON INSTANCE
# ========================================================================
interview_workflow = build_interview_workflow()

print("✅ LangGraph workflow compiled successfully!")