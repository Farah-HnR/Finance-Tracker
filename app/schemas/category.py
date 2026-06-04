import uuid
from pydantic import BaseModel, field_validator
from app.models.enums import CategoryType


class CategoryCreate(BaseModel):
    name: str
    type: CategoryType
    colour: str = "#ffffff"
    icon: str | None = None

    @field_validator("colour")
    @classmethod
    def validate_colour(cls, v: str) -> str:
        if not v.startswith("#") or len(v) != 7:
            raise ValueError("colour must be a valid hex code e.g. #ff5733")
        return v


class CategoryUpdate(BaseModel):
    name: str | None = None
    colour: str | None = None
    icon: str | None = None

    @field_validator("colour")
    @classmethod
    def validate_colour(cls, v: str | None) -> str | None:
        if v is not None and (not v.startswith("#") or len(v) != 7):
            raise ValueError("colour must be a valid hex code e.g. #ff5733")
        return v


class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    type: CategoryType
    colour: str
    icon: str | None

    model_config = {"from_attributes": True}
