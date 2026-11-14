from sqlmodel import ForeignKey, SQLModel, Field, Relationship
from typing import List, Optional
from app.modules.categorias.model import CategoriaPublic   # Ajusta la ruta según tu estructura
from app.modules.ingredientes.model import IngredientePublic # Ajusta la ruta según tu estructura
from sqlalchemy import Column, Integer, ForeignKey
class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"
    
    producto_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(
            Integer, 
            ForeignKey("producto.id", ondelete="CASCADE"), 
            primary_key=True
        )
    )
    categoria_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(
            Integer, 
            ForeignKey("categoria.id", ondelete="CASCADE"), 
            primary_key=True
        )
    )


class ProductoIngrediente(SQLModel, table=True):
    __tablename__ = "producto_ingrediente"
    
    producto_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(
            Integer, 
            ForeignKey("producto.id", ondelete="CASCADE"), 
            primary_key=True
        )
    )
    ingrediente_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(
            Integer, 
            ForeignKey("ingrediente.id", ondelete="CASCADE"), 
            primary_key=True
        )
    )
class Producto(SQLModel, table=True):
    __tablename__ = "producto"
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default="")
    precio_base: float = Field(default=0.0)
    disponible: bool = Field(default=True)
    categorias: List["Categoria"] = Relationship(link_model=ProductoCategoria)
    ingredientes: List["Ingrediente"] = Relationship(link_model=ProductoIngrediente)

class ProductoUpdate(SQLModel):
    """Esquema para actualización parcial (PATCH/PUT) de un producto."""
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=100, description="Nuevo nombre del producto.")
    descripcion: Optional[str] = Field(default=None, max_length=255, description="Nueva descripción del producto.")
    precio_base: Optional[float] = Field(default=None, ge=0, description="Nuevo precio base del producto.")
    disponible: Optional[bool] = Field(default=None, description="Estado de disponibilidad del producto.")
    
    # Listas de IDs para actualizar las relaciones many-to-many de forma sencilla
    categoria_ids: Optional[List[int]] = Field(default=None, description="Lista de IDs de las categorías asociadas.")
    ingrediente_ids: Optional[List[int]] = Field(default=None, description="Lista de IDs de los ingredientes asociados.")

class ProductoCreate(SQLModel):
    """Esquema utilizado para validar los datos al crear un nuevo producto."""
    nombre: str = Field(min_length=1, max_length=100, description="Nombre único del producto.")
    descripcion: Optional[str] = Field(default="", max_length=255, description="Descripción opcional del producto.")
    precio_base: float = Field(default=0.0, ge=0, description="Precio base del producto.")
    disponible: bool = Field(default=True, description="Indica si el producto está disponible de entrada.")
    
    # Listas de IDs para asociar categorías e ingredientes al crearlo
    categoria_ids: Optional[List[int]] = Field(default=[], description="Lista de IDs de las categorías asociadas.")
    ingrediente_ids: Optional[List[int]] = Field(default=[], description="Lista de IDs de los ingredientes asociados.")

class ProductoPublic(SQLModel):
    """Esquema para la respuesta pública de un producto (lectura/GET)."""
    id: int
    nombre: str
    descripcion: Optional[str] = ""
    precio_base: float
    disponible: bool
    
    # Relaciones anidadas para que el frontend reciba los objetos completos y no solo IDs
    categorias: List[CategoriaPublic] = []
    ingredientes: List[IngredientePublic] = []