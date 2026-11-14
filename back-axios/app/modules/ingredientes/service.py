from fastapi import HTTPException, status

from app.core.uow import UnitOfWork
from app.modules.ingredientes.model import Ingrediente, IngredienteCreate, IngredienteUpdate


class IngredienteService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def list_all(self) -> list[Ingrediente]:
        """Lista todas las categorías."""
        return self.uow.ingredientes.get_all()

    def get_by_id(self, ingrediente_id: int) -> Ingrediente:
        """Obtiene una categoría por ID o lanza 404."""
        ingrediente = self.uow.ingredientes.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingrediente no encontrado",
            )
        return ingrediente

    def create(self, ingredienteCreate: IngredienteCreate) -> Ingrediente:
            """Crea una nueva categoría. Nombre debe ser único."""
            if self.uow.ingredientes.get_by_nombre(ingredienteCreate.nombre):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe una categoría con ese nombre",
                )

            ingrediente = Ingrediente.model_validate(ingredienteCreate)
            return self.uow.ingredientes.add(ingrediente)

    def update(self, ingrediente_id: int, ingredienteUpdate: IngredienteUpdate) -> Ingrediente:
        """Actualización parcial de una categoría."""
        ingrediente = self.uow.ingredientes.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoría no encontrada",
            )

        update_data = ingredienteUpdate.model_dump(exclude_unset=True)

        if "nombre" in update_data:
            existing = self.uow.ingredientes.get_by_nombre(update_data["nombre"])
            if existing and existing.id != ingrediente_id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Ya existe un ingrediente con ese nombre",
                    )

        for key, value in update_data.items():
            setattr(ingrediente, key, value)

        return self.uow.ingredientes.update(ingrediente)

    def delete(self, ingrediente_id: int) -> None:
        """Elimina una categoría por ID o lanza 404."""
        ingrediente = self.uow.ingredientes.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoría no encontrada",
            )
        self.uow.ingredientes.soft_delete(ingrediente)
