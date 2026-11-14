from typing import Annotated, List
from fastapi import APIRouter, Depends, status

from app.core.uow import UnitOfWork, get_uow
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.model import Usuario
from app.modules.productos.model import ProductoPublic,ProductoCreate, ProductoUpdate  # Asegúrate de tener tu esquema Public de productos
from app.modules.productos.service import ProductoService

router = APIRouter(prefix="/api/v1/productos", tags=["productos"])

@router.get("/", response_model=List[ProductoPublic])
def list_productos(
    # Inyección de usuario autenticado
    _user: Annotated[Usuario, Depends(get_current_active_user)],
    # Inyección del Unit of Work
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """Lista todos los productos disponibles."""
    with uow:
        service = ProductoService(uow)
        return service.list_all()


@router.get("/{producto_id}", response_model=ProductoPublic)
def get_producto(
    producto_id: int,
    _user: Annotated[Usuario, Depends(get_current_active_user)],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """Obtiene un producto específico por su ID."""
    with uow:
        service = ProductoService(uow)
        return service.get_by_id(producto_id)


@router.post(
    "/",
    response_model=ProductoPublic,
    status_code=status.HTTP_201_CREATED
    
)
def create_producto(
    productoCreate: ProductoCreate,  # Body con campos escalares e IDs de relaciones
    uow: Annotated[UnitOfWork, Depends(get_uow)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    """
    Crea un nuevo producto.

    - Permite asociar categorías e ingredientes enviando sus listas de IDs.
    - Se delega toda la lógica y transacciones al service.
    """
    with uow:
        service = ProductoService(uow)
        return service.create(productoCreate)


@router.patch("/{producto_id}", response_model=ProductoPublic)
def update_producto(
    producto_id: int,
    productoUpdate: ProductoUpdate,  # Input parcial (PATCH) incluyendo opcionalmente los IDs
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """
    Actualiza parcialmente un producto (y sus relaciones many-to-many si se envían IDs).
    """
    with uow:
        service = ProductoService(uow)
        return service.update_producto(producto_id, productoUpdate)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(
    producto_id: int,
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """
    Realiza un borrado lógico (disponible = False) de un producto.

    - 204 No Content → respuesta estándar REST correcta.
    """
    with uow:
        service = ProductoService(uow)
        service.delete(producto_id)