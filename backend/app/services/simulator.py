import random
import time
from sqlalchemy.orm import Session

from app.models.server import Server
from app.models.attack import Attack


def simulate_server_load(db: Session):
    servers = db.query(Server).all()

    for server in servers:
        # Random CPU spike
        server.cpu_usage = min(100, max(0, server.cpu_usage + random.randint(-10, 25)))

        # Random memory change
        server.memory_usage = min(100, max(0, server.memory_usage + random.randint(-5, 15)))

        # Random status change
        if server.cpu_usage > 85:
            server.status = "High Load"
        elif server.cpu_usage < 30:
            server.status = "Online"

    db.commit()


def simulate_threats(db: Session):
    chance = random.randint(1, 10)

    if chance > 7:
        attack = Attack(
            attack_type=random.choice(["DDoS", "SQL Injection", "Brute Force"]),
            source_ip=f"192.168.{random.randint(1,255)}.{random.randint(1,255)}",
            destination_ip="10.0.0.1",
            severity=random.choice(["low", "medium", "high"]),
            status="detected",
            user_id=1
        )

        db.add(attack)
        db.commit()


def run_simulation(db: Session):
    simulate_server_load(db)
    simulate_threats(db)