import random
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/cloud",
    tags=["Cloud"]
)

class CloudStatus(BaseModel):
    provider: str
    instances: int
    running: int
    stopped: int

@router.get("/", response_model=CloudStatus)
def get_cloud_status():
    """
    Retrieves a simulated status of the cloud environment.
    In a real application, this would connect to a cloud provider API.
    """
    # Simulating fetching data from a cloud provider
    total_instances = random.randint(10, 20)
    running_instances = random.randint(5, total_instances)
    stopped_instances = total_instances - running_instances
    return {
        "provider": "Simulated Cloud",
        "instances": total_instances,
        "running": running_instances,
        "stopped": stopped_instances,
    }
