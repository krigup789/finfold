from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, ChatHistory
from resume_context import RESUME_TEXT
from openrouter import call_openrouter

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000/dashboard",  # local development
        "https://finfold.vercel.app/dashboard",  # production frontend
        "http://localhost:3001/dashboard"  # another local port if needed,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/chat")
def chat(message: str, db: Session = Depends(get_db)):

    full_prompt = f"""

    User Question:
    {message}
    """

    ai_response = call_openrouter(full_prompt)

    # Save to DB
    chat_entry = ChatHistory(
        question=message,
        response=ai_response
    )
    db.add(chat_entry)
    db.commit()

    return {"reply": ai_response}