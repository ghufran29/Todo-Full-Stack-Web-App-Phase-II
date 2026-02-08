from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.models.task import TaskPublic
from src.models.user import User
from src.services.task_service import TaskService
from src.api.middleware.auth_middleware import get_current_user
from src.database.connection import get_session
from typing import Dict, Any
import uuid


router = APIRouter(prefix="/tasks", tags=["Task Completion"])


@router.patch("/{task_id}/complete", response_model=TaskPublic)
def complete_task(
    task_id: str,
    completed: bool,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Mark a specific task as completed or pending.

    Args:
        task_id: UUID string of the task to update
        completed: Boolean indicating if the task should be marked as completed
        current_user: The currently authenticated user (from middleware)
        session: Database session dependency

    Returns:
        Updated TaskPublic object with new completion status
    """
    try:
        # Validate UUID format
        uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    updated_task = TaskService.complete_task(
        task_id=task_id,
        user_id=str(current_user.id),
        completed=completed,
        session=session
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access denied"
        )

    return updated_task