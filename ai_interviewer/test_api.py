#!/usr/bin/env python3
"""
Simple test script to verify the AI interviewer API endpoints work correctly.
Run this after starting the server with: python main.py
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/agent/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_start_interview():
    """Test starting an interview"""
    print("\n🚀 Testing start interview...")
    
    data = {
        "session_id": "test-session-123",
        "template_id": "coffee-habits",
        "starter_questions": [
            "How often do you drink coffee?",
            "What time do you prefer coffee?",
            "How do you prepare it?"
        ]
    }
    
    response = requests.post(f"{BASE_URL}/agent/start", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200, response.json()

def test_chat(session_id):
    """Test chat functionality"""
    print("\n💬 Testing chat...")
    
    data = {
        "session_id": session_id,
        "message": "I drink coffee every morning with breakfast"
    }
    
    response = requests.post(f"{BASE_URL}/agent/chat", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200, response.json()

def test_end_interview(session_id):
    """Test ending interview"""
    print("\n🏁 Testing end interview...")
    
    data = {
        "session_id": session_id
    }
    
    response = requests.post(f"{BASE_URL}/agent/end", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def main():
    print("🧪 Testing AI Interviewer API")
    print("=" * 50)
    
    # Test health
    if not test_health():
        print("❌ Health check failed!")
        return
    
    # Test start interview
    success, start_data = test_start_interview()
    if not success:
        print("❌ Start interview failed!")
        return
    
    session_id = start_data.get("session_id") or "test-session-123"
    
    # Test chat
    success, chat_data = test_chat(session_id)
    if not success:
        print("❌ Chat failed!")
        return
    
    # Test end interview
    success = test_end_interview(session_id)
    if not success:
        print("❌ End interview failed!")
        return
    
    print("\n✅ All tests passed!")

if __name__ == "__main__":
    main()
