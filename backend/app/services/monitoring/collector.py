import socket
import platform
import psutil
from sqlalchemy.orm import Session

from app.models.server import Server


# Keep previous network counters so we can calculate usage between runs
_previous_net = psutil.net_io_counters()


def _get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def _get_network_usage_percent() -> float:
    """
    Approximate network activity as a percentage of a 100 Mbps link.
    This is not perfect, but it is REAL network traffic, not random data.
    """
    global _previous_net

    current = psutil.net_io_counters()

    bytes_sent = current.bytes_sent - _previous_net.bytes_sent
    bytes_recv = current.bytes_recv - _previous_net.bytes_recv

    _previous_net = current

    total_bytes = max(0, bytes_sent + bytes_recv)

    # background worker runs every 5 seconds
    interval_seconds = 5
    bytes_per_second = total_bytes / interval_seconds

    # 100 Mbps = 12.5 MB/s
    max_bytes_per_second = 12.5 * 1024 * 1024

    usage = (bytes_per_second / max_bytes_per_second) * 100
    return round(min(100.0, max(0.0, usage)), 2)


def _calculate_health(cpu: float, memory: float) -> str:
    if cpu >= 90 or memory >= 90:
        return "Critical"
    elif cpu >= 80 or memory >= 80:
        return "High Load"
    elif cpu >= 60 or memory >= 60:
        return "Moderate"
    return "Normal"


def collect_metrics(db: Session):
    hostname = socket.gethostname()
    os_name = f"{platform.system()} {platform.release()}"
    ip_address = _get_local_ip()

    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    storage = psutil.disk_usage("/" if platform.system() != "Windows" else "C:\\").percent
    network = _get_network_usage_percent()

    health = _calculate_health(cpu, memory)

    server = db.query(Server).filter(Server.server_name == hostname).first()

    if not server:
        server = Server(
            server_name=hostname,
            operating_system=os_name,
            ip_address=ip_address,
            status="active",
        )
        db.add(server)

    server.operating_system = os_name
    server.ip_address = ip_address
    server.cpu_usage = round(cpu, 2)
    server.memory_usage = round(memory, 2)
    server.storage_usage = round(storage, 2)
    server.network_usage = network
    server.status = "active"
    server.health_status = health

    db.commit()
    db.refresh(server)

    return server