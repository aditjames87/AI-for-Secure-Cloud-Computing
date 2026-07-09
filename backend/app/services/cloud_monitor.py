import time
import threading
import logging
import psutil

from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.server import Server
from app.models.resource import CloudResource

logging.basicConfig(level=logging.INFO)

NETWORK_INTERVAL = 5  # seconds


class CloudMonitor:

    def __init__(self):
        self.running = False
        self.thread = None

        self.previous_sent = psutil.net_io_counters().bytes_sent
        self.previous_recv = psutil.net_io_counters().bytes_recv

    def start(self):
        if self.running:
            return

        self.running = True

        self.thread = threading.Thread(
            target=self.monitor_loop,
            daemon=True
        )

        self.thread.start()

        logging.info("Cloud Monitor Started")

    def stop(self):
        self.running = False

        if self.thread:
            self.thread.join()

        logging.info("Cloud Monitor Stopped")

    def monitor_loop(self):

        while self.running:

            db: Session = SessionLocal()

            try:

                cpu = psutil.cpu_percent(interval=1)

                memory = psutil.virtual_memory().percent

                storage = psutil.disk_usage("/").percent

                net = psutil.net_io_counters()

                sent = net.bytes_sent
                recv = net.bytes_recv

                network = (
                    (sent - self.previous_sent)
                    +
                    (recv - self.previous_recv)
                ) / 1024

                self.previous_sent = sent
                self.previous_recv = recv

                server = db.query(Server).first()

                if server is None:

                    server = Server(
                        server_name="Local Machine",
                        ip_address="127.0.0.1",
                        operating_system="Windows",
                        cpu_usage=cpu,
                        memory_usage=memory,
                        storage_usage=storage,
                        network_usage=network,
                        status="Running",
                    )

                    db.add(server)
                    db.commit()
                    db.refresh(server)

                else:

                    server.cpu_usage = cpu
                    server.memory_usage = memory
                    server.storage_usage = storage
                    server.network_usage = network

                    db.commit()

                snapshot = CloudResource(
                    server_id=server.id,
                    cpu=cpu,
                    memory=memory,
                    storage=storage,
                    network=network,
                )

                db.add(snapshot)

                db.commit()

                logging.info(
                    f"CPU={cpu:.1f}% "
                    f"RAM={memory:.1f}% "
                    f"Disk={storage:.1f}% "
                    f"Net={network:.1f} KB"
                )

            except Exception as ex:

                logging.exception(ex)

                db.rollback()

            finally:

                db.close()

            time.sleep(NETWORK_INTERVAL)


cloud_monitor = CloudMonitor()