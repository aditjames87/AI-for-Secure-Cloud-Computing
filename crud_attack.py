from backend.crud.base import CRUDBase
from backend.app.models.attack import Attack
from backend.app.schemas.threat import AttackCreate, AttackUpdate


class CRUDAttack(CRUDBase[Attack, AttackCreate, AttackUpdate]):
    pass


attack = CRUDAttack(Attack)