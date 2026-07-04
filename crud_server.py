from backend.crud import CRUDBase
from backend.app.models.server import Server
from backend.app.schemas.server import ServerCreate, ServerUpdate


class CRUDServer(CRUDBase[Server, ServerCreate, ServerUpdate]):
    pass


server = CRUDServer(Server)