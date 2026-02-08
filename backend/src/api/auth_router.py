from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict, Any
from src.models.user import UserCreate, UserLogin, UserPublic
from src.models.task import TaskPublic
from src.services.user_service import UserService
from src.services.task_service import TaskService
from src.database.connection import get_session
from src.api.middleware.auth_middleware import get_current_user
from src.utils.jwt_utils import create_access_token, create_refresh_token
from datetime import timedelta
import uuid


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=Dict[str, Any])
def register_user(
    user_create: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    Args:
        user_create: User creation details (email, password, confirm_password)
        session: Database session dependency

    Returns:
        Dictionary containing user info and authentication tokens
    """
    try:
        # Create user through service
        user_public = UserService.create_user(user_create, session)

        # Authenticate the user to generate tokens (auto-login after registration)
        auth_result = UserService.authenticate_user(
            email=user_create.email,
            password=user_create.password,
            session=session
        )

        if not auth_result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to authenticate user after registration"
            )

        return {
            "success": True,
            "user": user_public,
            "access_token": auth_result["access_token"],
            "refresh_token": auth_result["refresh_token"],
            "token_type": "bearer"
        }

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during registration: {str(e)}"
        )


@router.post("/signin", response_model=Dict[str, Any])
def login_user(
    user_login: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate an existing user and return tokens.

    Args:
        user_login: User login details (email, password)
        session: Database session dependency

    Returns:
        Dictionary containing user info and authentication tokens
    """
    try:
        auth_result = UserService.authenticate_user(
            email=user_login.email,
            password=user_login.password,
            session=session
        )

        if not auth_result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {
            "success": True,
            "user": auth_result["user"],
            "access_token": auth_result["access_token"],
            "refresh_token": auth_result["refresh_token"],
            "token_type": auth_result["token_type"]
        }

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during authentication: {str(e)}"
        )


@router.post("/signout")
def logout_user():
    """
    End the current user session.

    Returns:
        Success message
    """
    # In a stateless JWT system, logout is typically handled on the client-side
    # by removing the token from storage. Here we just return a success response.
    return {
        "success": True,
        "message": "Successfully signed out"
    }


@router.get("/me", response_model=UserPublic)
def get_current_user_profile(
    current_user: UserPublic = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's profile information.

    Args:
        current_user: The currently authenticated user (from middleware)

    Returns:
        UserPublic object with current user's information
    """
    # Return the current user from the authentication middleware
    return current_user


@router.get("/tasks", response_model=list[TaskPublic])
def get_authenticated_user_tasks(
    current_user: UserPublic = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve all tasks for the currently authenticated user.

    Args:
        current_user: The currently authenticated user (from middleware)
        session: Database session dependency

    Returns:
        List of TaskPublic objects belonging to the current user
    """
    try:
        tasks = TaskService.get_tasks_by_user(
            user_id=str(current_user.id),
            session=session
        )
        return tasks
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while retrieving tasks: {str(e)}"
        )