from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict, Any
from src.database.connection import get_session
from src.models.user import UserPublic, UserUpdate
from src.api.middleware.auth_middleware import get_current_user
from src.services.user_service import UserService
import uuid


router = APIRouter(prefix="/users", tags=["User Management"])


@router.get("/{user_id}", response_model=UserPublic)
def get_user(
    user_id: str,
    current_user = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a user's profile information by their ID.

    Args:
        user_id: UUID string of the user to retrieve
        current_user: The currently authenticated user (from middleware)
        session: Database session dependency

    Returns:
        UserPublic object with user information
    """
    try:
        # Validate UUID format
        uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    # Verify the current user is requesting their own data
    # For this implementation, we'll allow access to any user data
    # but this could be restricted to only the current user
    if str(current_user.id) != user_id:
        # Or we can implement a check to see if user has admin privileges
        # For basic implementation, we'll restrict access to own data only
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Cannot access other user's data"
        )

    user_public = UserService.get_user_by_id(user_id, session)

    if not user_public:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user_public


@router.put("/{user_id}", response_model=UserPublic)
def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a user's profile information.

    Args:
        user_id: UUID string of the user to update
        user_update: User update details
        current_user: The currently authenticated user (from middleware)
        session: Database session dependency

    Returns:
        Updated UserPublic object
    """
    try:
        # Validate UUID format
        uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    # Only allow users to update their own data
    if str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Cannot update other user's data"
        )

    updated_user = UserService.update_user(user_id, user_update, session, current_user)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return updated_user


@router.get("/me", response_model=UserPublic)
def get_current_user_profile(
    current_user = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's profile information.

    Args:
        current_user: The currently authenticated user (from middleware)

    Returns:
        UserPublic object with current user's information
    """
    # Create a UserPublic object from the current user
    user_public = UserPublic(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at
    )

    return user_public