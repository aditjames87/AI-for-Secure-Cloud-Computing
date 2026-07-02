from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import random

from backend.app import schemas

router = APIRouter()

# In-memory "database" for demonstration purposes
db_servers = [
    schemas.Server(id=1, server_name="prod-web-1", ip_address="192.168.1.10", operating_system="Ubuntu 20.04", status="Online", cpu_usage=random.uniform(10, 90), memory_usage=random.uniform(20, 80), disk_usage=random.uniform(30, 70)),
    schemas.Server(id=2, server_name="prod-db-1", ip_address="192.168.1.11", operating_system="CentOS 8", status="Online", cpu_usage=random.uniform(10, 90), memory_usage=random.uniform(20, 80), disk_usage=random.uniform(30, 70)),
    schemas.Server(id=3, server_name="dev-test-1", ip_address="10.0.0.5", operating_system="Windows Server 2019", status="Offline", cpu_usage=0, memory_usage=0, disk_usage=random.uniform(10, 90)),
    schemas.Server(id=4, server_name="staging-api-1", ip_address="172.16.0.22", operating_system="Ubuntu 22.04", status="Online", cpu_usage=random.uniform(10, 90), memory_usage=random.uniform(20, 80), disk_usage=random.uniform(30, 70)),
]


@router.get("/", response_model=List[schemas.Server])
def read_servers(search: Optional[str] = None):
    """
    Retrieve servers, with optional search.
    """
    if search:
        return [s for s in db_servers if search.lower() in s.server_name.lower() or search in s.ip_address]
    return db_servers


@router.post("/", response_model=schemas.Server, status_code=201)
def create_server(server: schemas.ServerCreate):
    """
    Create a new server.
    """
    new_id = max(s.id for s in db_servers) + 1 if db_servers else 1
    new_server = schemas.Server(
        id=new_id,
        **server.model_dump(),
        status="Offline",
        cpu_usage=0,
        memory_usage=0,
        disk_usage=0
    )
    db_servers.append(new_server)
    return new_server


@router.put("/{server_id}", response_model=schemas.Server)
def update_server(server_id: int, server_update: schemas.ServerUpdate):
    """
    Update an existing server.
    """
    for i, s in enumerate(db_servers):
        if s.id == server_id:
            update_data = server_update.model_dump(exclude_unset=True)
            updated_server = s.model_copy(update=update_data)
            db_servers[i] = updated_server
            return updated_server
    raise HTTPException(status_code=404, detail="Server not found")


@router.delete("/{server_id}", status_code=204)
def delete_server(server_id: int):
    """
    Delete a server.
    """
    global db_servers
    server_to_delete = next((s for s in db_servers if s.id == server_id), None)
    if not server_to_delete:
        raise HTTPException(status_code=404, detail="Server not found")
    db_servers = [s for s in db_servers if s.id != server_id]
    return