from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.uow import UnitOfWork, get_uow
from app.core.deps import get_current_active_user,require_role
from app.modules.usuarios.model import Usuario
from app.modules.ingredientes.model import IngredientePublic,IngredienteCreate,IngredienteUpdate
from app.modules.ingredientes.service import IngredienteService



router = APIRouter(prefix="/api/v1/ingredientes", tags=["ingredientes"])

@router.get("/", response_model=list[IngredientePublic])
def list_ingredientes(
    # Inyección de usuario autenticado (no se usa directamente → "_" convención)
    _user: Annotated[Usuario, Depends(get_current_active_user)],

    # Inyección del Unit of Work
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):

    with uow:  # Manejo de sesión/transacción
        service = IngredienteService(uow)  # Inyección manual del UoW
        return service.list_all()   
    
@router.post(
    "/",
    response_model=IngredientePublic,
    status_code=status.HTTP_201_CREATED  # Semántica REST correcta (creación)
)
def create_ingrediente(
    ingredienteCreate: IngredienteCreate,  # Body validado por Pydantic

    _user: Annotated[Usuario, Depends(get_current_active_user)],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """
    Crea una nueva categoría.

    - cat_in ya llega validado
    - No hay lógica aquí → se delega al service
    """

    with uow:
        service = IngredienteService(uow)
        return service.create(ingredienteCreate)


@router.patch("/{ingrediente_id}", response_model=IngredientePublic)
def update_ingrediente(
    ingrediente_id: int,
    ingredienteUpdate: IngredienteUpdate,  # Input parcial (PATCH)

    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """
    Actualiza parcialmente una categoría.
    """

    with uow:
        service = IngredienteService(uow)
        return service.update(ingrediente_id, ingredienteUpdate)


@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingrediente(
    ingrediente_id: int,

    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    """
    Elimina una categoría.

    - 204 → no retorna contenido (correcto en REST)
    - Si falla, el service debería lanzar excepción
    """

    with uow:
        service = IngredienteService(uow)
        service.delete(ingrediente_id)  # No retorna nada