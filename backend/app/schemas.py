from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict


class CarBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=100, description="Vehicle manufacturer")
    model: str = Field(..., min_length=1, max_length=100, description="Vehicle model")
    year: int = Field(..., ge=1900, le=2100, description="Model release year")
    daily_rate: float = Field(..., gt=0, description="Daily rental price in USD")
    available: Optional[bool] = Field(default=True, description="Operational rental eligibility")
    category: Optional[str] = Field(default="Luxury", description="Vehicle segment/category")
    image_url: Optional[str] = Field(default=None, description="URL or path to vehicle photo")
    description: Optional[str] = Field(default=None, description="Detailed vehicle description")

    @field_validator("make", "model")
    @classmethod
    def check_non_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be blank or whitespace only")
        return stripped


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    daily_rate: Optional[float] = Field(None, gt=0)
    available: Optional[bool] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None


class CarResponse(CarBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class RentalCreate(BaseModel):
    user_name: str = Field(..., min_length=1, max_length=150, description="Full name of customer")
    start_date: date = Field(..., description="Rental start date (inclusive, YYYY-MM-DD)")
    end_date: date = Field(..., description="Rental end date (exclusive, YYYY-MM-DD)")

    @field_validator("user_name")
    @classmethod
    def check_non_empty_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Customer name cannot be blank or whitespace only")
        return stripped

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.start_date >= self.end_date:
            raise ValueError("Rental start_date must be strictly before end_date (half-open interval: start <= date < end)")
        return self


class RentalResponse(BaseModel):
    id: int
    car_id: int
    user_name: str
    start_date: date
    end_date: date
    rental_date: datetime
    status: str
    total_cost: Optional[float] = None
    car: Optional[CarResponse] = None

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str
    database: str
