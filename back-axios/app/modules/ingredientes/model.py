from typing import List, Optional
from sqlmodel import SQLModel, Field

class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingrediente"
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default="")
    activo: bool = Field(default=True)
   
class IngredienteCreate(SQLModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: str = Field(default="", max_length=500)


class IngredienteUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    descripcion: str | None = Field(default=None, max_length=500)


class IngredientePublic(SQLModel):
    id: int
    nombre: str
    descripcion: str