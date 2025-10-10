# Agent Service (Python FastAPI)

## Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

## Run
uvicorn main:app --reload --port 8001

## Environment
Create `.env` file with:
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379