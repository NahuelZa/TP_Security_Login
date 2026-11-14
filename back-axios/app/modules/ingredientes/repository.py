from app.core.base_repository import BaseRepository
from app.modules.ingredientes.model import Ingrediente
from sqlmodel import Session, select


class IngredienteRepository(BaseRepository[Ingrediente]):

    def __init__(self, session: Session):
        super().__init__(Ingrediente, session)

    def get_by_nombre(self, nombre: str) -> Ingrediente | None:
        return self.session.exec(
            select(Ingrediente).where(Ingrediente.nombre == nombre)
        ).first()

    def soft_delete(self, ingrediente: Ingrediente) -> Ingrediente:
        ingrediente.activo = False
        self.session.add(ingrediente)
        return ingrediente
    