from backend.crud.base import CRUDBase
from backend.app.models.cloud_resource import CloudResource
from backend.app.schemas.cloud_resource import (
    CloudResourceCreate,
    CloudResourceUpdate,
)


class CRUDCloudResource(
    CRUDBase[CloudResource, CloudResourceCreate, CloudResourceUpdate]
):
    pass


cloud_resource = CRUDCloudResource(CloudResource)