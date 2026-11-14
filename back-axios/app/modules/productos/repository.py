from app.core.base_repository import BaseRepository
from app.modules.productos.model import Producto
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload


class ProductoRepository(BaseRepository[Producto]):

    def __init__(self, session: Session):
        super().__init__(Producto, session)

    def get_by_nombre(self, nombre: str) -> Producto | None:
        return self.session.exec(
            select(Producto).where(Producto.nombre == nombre)
        ).first()

    def soft_delete(self, producto: Producto) -> Producto:
        producto.disponible = False
        self.session.add(producto)
        return producto

    
    def get_all_with_relations(self) -> list[Producto]:
        """Obtiene todos los productos cargando sus categorías e ingredientes de una vez."""
        return list(
            self.session.exec(
                select(Producto).options(
                    selectinload(Producto.categorias),
                    selectinload(Producto.ingredientes)
                )
            ).all()
        )

    def get_by_id_with_relations(self, producto_id: int) -> Producto | None:
        """Obtiene un producto por ID cargando sus relaciones."""
        return self.session.exec(
            select(Producto)
            .where(Producto.id == producto_id)
            .options(
                selectinload(Producto.categorias),
                selectinload(Producto.ingredientes)
            )
        ).first()