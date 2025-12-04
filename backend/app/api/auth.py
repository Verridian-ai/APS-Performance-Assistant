from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User, Profile, Preferences
from app.schemas import UserCreate, UserResponse, Token, UserLogin
from app.auth.utils import get_password_hash, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: register endpoint called with {user_in.email}")
    try:
        # Check existing
        result = await db.execute(select(User).where(User.email == user_in.email))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create User with explicit ID
        user_id = uuid.uuid4()
        hashed_pw = get_password_hash(user_in.password)
        
        new_user = User(
            id=user_id,
            email=user_in.email,
            hashed_password=hashed_pw,
            full_name=user_in.full_name
        )
        db.add(new_user)
        
        # Create Profile and Preferences with explicit FK
        # Note: We can also just pass user=new_user, but passing ID is safer with asyncpg if object isn't flushed
        new_profile = Profile(user_id=user_id)
        new_preferences = Preferences(user_id=user_id)
        
        db.add(new_profile)
        db.add(new_preferences)
        
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        import traceback
        with open("error_log.txt", "a") as f:
            f.write(f"Error in register: {e}\n")
            traceback.print_exc(file=f)
        print(f"Error in register: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
