import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CreateCandidateRequest(BaseModel):
    name: str
    role: str


class Candidate(BaseModel):
    id: str
    name: str
    role: str
    match_score: int
    status: str
    created_at: str


class InterviewQuestion(BaseModel):
    id: str
    question_text: str
    category: str
    difficulty: str


@router.post("/candidates", response_model=Candidate)
async def create_candidate(req: CreateCandidateRequest) -> Candidate:
    return Candidate(
        id=str(uuid.uuid4()),
        name=req.name,
        role=req.role,
        match_score=random.randint(1, 100),
        status="screening",
        created_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/candidates/{id}/interview-questions", response_model=list[InterviewQuestion])
async def get_interview_questions(id: str) -> list[InterviewQuestion]:
    questions = [
        InterviewQuestion(
            id=str(uuid.uuid4()),
            question_text="Tell me about a time you led a project.",
            category="Leadership",
            difficulty="Medium",
        ),
        InterviewQuestion(
            id=str(uuid.uuid4()),
            question_text="How do you handle conflict in a team?",
            category="Behavioral",
            difficulty="Medium",
        ),
        InterviewQuestion(
            id=str(uuid.uuid4()),
            question_text="What is your experience with cloud platforms?",
            category="Technical",
            difficulty="Hard",
        ),
        InterviewQuestion(
            id=str(uuid.uuid4()),
            question_text="Describe a challenging bug you fixed.",
            category="Technical",
            difficulty="Medium",
        ),
        InterviewQuestion(
            id=str(uuid.uuid4()),
            question_text="Where do you see yourself in 5 years?",
            category="Career",
            difficulty="Easy",
        ),
    ]
    return questions
