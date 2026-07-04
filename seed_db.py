import logging
import random
from faker import Faker
from sqlalchemy.orm import Session

from backend import crud, schemas
from backend.core.config import settings
from backend.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

fake = Faker()


def seed_users(db: Session):
    logger.info("Seeding users...")
    # Create a superuser
    admin_email = "admin@example.com"
    user = crud.user.get_by_email(db, email=admin_email)
    if not user:
        user_in = schemas.UserCreate(email=admin_email, password="password")
        user = crud.user.create(db, obj_in=user_in)
        user.is_superuser = True
        db.commit()
        logger.info(f"Created superuser: {admin_email}")

    # Create random users
    for _ in range(10):
        email = fake.email()
        user = crud.user.get_by_email(db, email=email)
        if not user:
            user_in = schemas.UserCreate(email=email, password="password")
            crud.user.create(db, obj_in=user_in)
            logger.info(f"Created user: {email}")


def seed_servers_and_resources(db: Session):
    logger.info("Seeding servers and cloud resources...")
    if crud.server.get_multi(db, limit=1):
        logger.info("Servers already exist, skipping.")
        return

    for _ in range(5):
        server_in = schemas.ServerCreate(
            hostname=fake.hostname(),
            ip_address=fake.ipv4(),
            status=random.choice(["active", "maintenance", "inactive"]),
        )
        server = crud.server.create(db, obj_in=server_in)
        logger.info(f"Created server: {server.hostname}")

        # Create resources for each server
        for _ in range(random.randint(2, 5)):
            resource_in = schemas.CloudResourceCreate(
                name=f"{random.choice(['vm', 'db', 'storage'])}-{fake.word()}",
                resource_type=random.choice(
                    ["Virtual Machine", "Database", "Load Balancer", "Storage Bucket"]
                ),
                status=random.choice(["running", "stopped", "provisioning"]),
                server_id=server.id,
            )
            crud.cloud_resource.create(db, obj_in=resource_in)
            logger.info(f"  - Created resource: {resource_in.name}")


def seed_predictions_and_attacks(db: Session):
    logger.info("Seeding predictions and attacks...")

    servers = crud.server.get_multi(db)
    if not servers:
        logger.warning("No servers found. Cannot seed attacks.")
        return

    if crud.attack.get_multi(db, limit=1):
        logger.info("Attacks already exist, skipping.")
        return

    attack_types = ["DDoS", "SQL Injection", "Cross-Site Scripting", "Brute Force"]

    for _ in range(20):
        # 75% chance of being an attack, 25% normal
        is_attack = random.random() < 0.75
        target_server = random.choice(servers)

        if is_attack:
            attack_type = random.choice(attack_types)
            prediction_score = random.uniform(0.75, 0.99)
            input_features = {
                "source_ip": fake.ipv4(),
                "request_count": random.randint(1000, 5000),
                "payload_length": random.randint(100, 1024),
                "protocol": "TCP",
            }

            # 1. Create the Prediction
            prediction_in = schemas.PredictionCreate(
                input_features=input_features,
                prediction_class=attack_type,
                prediction_score=prediction_score,
            )
            prediction = crud.prediction.create(db, obj_in=prediction_in)

            # 2. Create the Attack linked to the Prediction
            attack_in = schemas.AttackCreate(
                attack_type=attack_type,
                source_ip=input_features["source_ip"],
                description=f"Detected potential {attack_type} from {input_features['source_ip']}",
                target_server_id=target_server.id,
                prediction_id=prediction.id,
            )
            crud.attack.create(db, obj_in=attack_in)
            logger.info(f"Created attack record: {attack_type} on {target_server.hostname}")


def main():
    logger.info("--- Starting database seeding ---")
    db = SessionLocal()
    try:
        seed_users(db)
        seed_servers_and_resources(db)
        seed_predictions_and_attacks(db)
    except Exception as e:
        logger.error(f"An error occurred during seeding: {e}")
    finally:
        db.close()
    logger.info("--- Database seeding finished ---")


if __name__ == "__main__":
    main()