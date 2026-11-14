from fastapi import HTTPException
from sqlmodel import select
from app.core.uow import UnitOfWork
from app.modules.productos.model import Producto, ProductoUpdate
from app.modules.categorias.model import Categoria
from app.modules.ingredientes.model import Ingrediente 
from typing import List
from fastapi import status
from sqlmodel import  col
from app.modules.productos.model import ProductoCreate



class ProductoService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def update_producto(self, producto_id: int, producto_in: ProductoUpdate) -> Producto:
        # 1. Buscar el producto incluyendo sus relaciones de entrada
        db_producto = self.uow.productos.get_by_id_with_relations(producto_id)
        if not db_producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        # 2. Obtener los datos modificados del esquema
        producto_data = producto_in.model_dump(exclude_unset=True)
        
        # Asegurar sesión para el linter
        assert self.uow.session is not None, "La sesión no puede ser None"

        # 3. Manejo de categorías
        if "categoria_ids" in producto_data:
            ids = producto_data.pop("categoria_ids")
            if ids:
                db_producto.categorias = list(
                    self.uow.session.exec(
                        select(Categoria).where(col(Categoria.id).in_(ids))
                    ).all()
                )
            else:
                db_producto.categorias = []

        # 4. Manejo de ingredientes
        if "ingrediente_ids" in producto_data:
            ids = producto_data.pop("ingrediente_ids")
            if ids:
                db_producto.ingredientes = list(
                    self.uow.session.exec(
                        select(Ingrediente).where(col(Ingrediente.id).in_(ids))
                    ).all()
                )
            else:
                db_producto.ingredientes = []

        # 5. Actualizar el resto de atributos normales (nombre, precio, etc.)
        for key, value in producto_data.items():
            setattr(db_producto, key, value)

        self.uow.productos.update(db_producto)

        return self.uow.productos.get_by_id_with_relations(producto_id)

    def list_all(self) -> List[Producto]:
        """Lista todos los productos con sus relaciones cargadas."""
        return self.uow.productos.get_all_with_relations()

    def get_by_id(self, producto_id: int) -> Producto:
        """Obtiene un producto por ID con sus relaciones o lanza 404."""
        producto = self.uow.productos.get_by_id_with_relations(producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado",
            )
        return producto

    def create(self, productoCreate: ProductoCreate) -> Producto:
        """Crea un nuevo producto asociando categorías e ingredientes por ID."""
        # Validar si ya existe un producto con el mismo nombre (opcional pero recomendado)
        if self.uow.productos.get_by_nombre(productoCreate.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un producto con ese nombre",
            )

        # 1. Extraer los datos del esquema y separar las listas de IDs
        data = productoCreate.model_dump(exclude_unset=True)
        categoria_ids = data.pop("categoria_ids", [])
        ingrediente_ids = data.pop("ingrediente_ids", [])

        # 2. Crear la instancia base del producto con los campos escalares
        producto = Producto(**data)

        # Asegurar sesión para el linter
        assert self.uow.session is not None, "La sesión no puede ser None"

       # Validación y asignación de categorías
        if categoria_ids:
            db_categorias = list(
                self.uow.session.exec(
                    select(Categoria).where(col(Categoria.id).in_(categoria_ids))
                ).all()
            )
            found_ids = {c.id for c in db_categorias}
            missing_ids = set(categoria_ids) - found_ids
            if missing_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Las siguientes categorías no existen: {list(missing_ids)}"
                )
            producto.categorias = db_categorias

        # Validación y asignación de ingredientes
        if ingrediente_ids:
            db_ingredientes = list(
                self.uow.session.exec(
                    select(Ingrediente).where(col(Ingrediente.id).in_(ingrediente_ids))
                ).all()
            )
            found_ids = {i.id for i in db_ingredientes}
            missing_ids = set(ingrediente_ids) - found_ids
            if missing_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Los siguientes ingredientes no existen: {list(missing_ids)}"
                )
            producto.ingredientes = db_ingredientes
        # 5. Guardar el producto con sus relaciones a través de la UoW
        self.uow.productos.add(producto)
        
        return self.uow.productos.get_by_id_with_relations(producto.id)

    def delete(self, producto_id: int) -> None:
        """Realiza un borrado lógico (disponible = False) de un producto por ID o lanza 404."""
        producto = self.uow.productos.get_by_id(producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado",
            )
        self.uow.productos.soft_delete(producto)