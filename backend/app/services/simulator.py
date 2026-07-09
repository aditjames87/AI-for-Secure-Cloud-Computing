import random
from sqlalchemy.orm import Session

from app.models.server import Server
from app.models.attack import Attack


def _generate_server_metrics(server: Server):
    """Generates and applies new random metrics for a single server."""
    # Determine server status first
    server.status = random.choices(["active", "offline"], weights=[0.9, 0.1], k=1)[0]

    if server.status == "offline":
        # Set utilization to zero for offline servers
        server.cpu_usage = 0
        server.memory_usage = 0
        server.storage_usage = 0
        server.network_usage = 0
    else:
        # Random CPU spike
        server.cpu_usage = min(100, max(0, server.cpu_usage + random.randint(-10, 25)))
        # Random memory change
        server.memory_usage = min(100, max(0, server.memory_usage + random.randint(-5, 15)))
        # Random storage change
        server.storage_usage = min(100, max(0, server.storage_usage + random.randint(-2, 5)))
        # Random network change
        server.network_usage = min(100, max(0, server.network_usage + random.randint(-20, 40)))

    # Update health status based on new metrics
    server.health_status = _calculate_health(server)


def _calculate_health(server: Server) -> str:
    """Calculates the health status of a server based on its metrics."""
    if server.status == "offline":
        return "Offline"

    if server.cpu_usage >= 90 or server.memory_usage >= 90:
        return "Critical"
    elif server.cpu_usage >= 80 or server.memory_usage >= 80:
        return "High Load"
    elif server.cpu_usage >= 60 or server.memory_usage >= 60:
        return "Moderate"
    else:
        return "Normal"


def simulate_server_load(db: Session):
    """Simulates load for all servers in the database."""
    servers = db.query(Server).all()

    for server in servers:
        _generate_server_metrics(server)


def simulate_threats(db: Session):
    """Simulates the random occurrence of a security threat."""
    chance = random.randint(1, 10)

    # 30% chance to generate a threat (8, 9, 10)
    if chance > 7:
        attack = Attack(
            attack_type=random.choice(["DDoS", "SQL Injection", "Brute Force"]),
            source_ip=f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            destination_ip="10.0.0.1",
            severity=random.choice(["low", "medium", "high"]),
            status="detected",
            user_id=1
        )
        db.add(attack)


def run_simulation(db: Session):
    """
    Runs the main simulation logic for server loads and threats,
    and commits the changes to the database.
    """
    simulate_server_load(db)
    simulate_threats(db)

    # Perform a single commit after all updates for this simulation cycle
    db.commit()