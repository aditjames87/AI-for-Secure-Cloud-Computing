import socket
import platform
import psutil

from sqlalchemy.orm import Session
from app.models.server import Server


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def calculate_health(cpu: float, memory: float):
    if cpu >= 90 or memory >= 90:
        return "Critical"

    if cpu >= 80 or memory >= 80:
        return "High Load"

    if cpu >= 60 or memory >= 60:
        return "Moderate"

    return "Normal"


def collect_metrics(db: Session):
    """
    Collect real metrics from the local machine
    and update the Server table.
    """

    hostname = socket.gethostname()

    operating_system = f"{platform.system()} {platform.release()}"

    ip_address = get_local_ip()

    cpu_usage = psutil.cpu_percent(interval=1)

    memory_usage = psutil.virtual_memory().percent

    storage_usage = psutil.disk_usage("/").percent

    network = psutil.net_io_counters()

    network_usage = round(
        (network.bytes_sent + network.bytes_recv) / (1024 * 1024),
        2,
    )

    health_status = calculate_health(cpu_usage, memory_usage)

    server = (
        db.query(Server)
        .filter(Server.server_name == hostname)
        .first()
    )

    if server is None:

        server = Server(
            server_name=hostname,
            operating_system=operating_system,
            ip_address=ip_address,
        )

        db.add(server)

    server.server_name = hostname
    server.operating_system = operating_system
    server.ip_address = ip_address

    server.cpu_usage = cpu_usage
    server.memory_usage = memory_usage
    server.storage_usage = storage_usage
    server.network_usage = network_usage

    server.status = "active"
    server.health_status = health_status

    db.commit()

    print("=" * 60)
    print("REAL METRICS UPDATED")
    print("=" * 60)
    print(f"Host      : {hostname}")
    print(f"IP        : {ip_address}")
    print(f"OS        : {operating_system}")
    print(f"CPU       : {cpu_usage}%")
    print(f"Memory    : {memory_usage}%")
    print(f"Storage   : {storage_usage}%")
    print(f"Network   : {network_usage} MB")
    print(f"Health    : {health_status}")
    print("=" * 60)