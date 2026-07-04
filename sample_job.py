import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

def log_server_status():
    logging.info(f"Server is running. Status check at {datetime.now()}")