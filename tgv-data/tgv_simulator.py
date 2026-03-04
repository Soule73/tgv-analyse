"""
TGV Data Simulator
Generates realistic TGV punctuality records at random intervals
and persists them in MongoDB.
"""

import time
import os
import random
from datetime import datetime, timedelta
from typing import Optional

from pymongo import MongoClient

# ─── Configuration ────────────────────────────────────────────────────────────
MONGO_HOST = os.getenv('MONGO_HOST', 'mongodb')
MONGO_PORT = int(os.getenv('MONGO_PORT', 27017))
MONGO_DB   = os.getenv('MONGO_DB', 'tgv_db')

# Reference data used for random record generation
REGIONS = ['Atlantique', 'Sud-Est', 'Nord', 'Est']

GARES = {
    'Atlantique': ['PARIS MONTPARNASSE', 'NANTES', 'RENNES', 'BREST', 'BORDEAUX ST JEAN', 
                   'TOURS', 'ANGERS SAINT LAUD', 'LE MANS', 'LAVAL', 'VANNES', 'QUIMPER',
                   'LA ROCHELLE VILLE', 'POITIERS', 'ANGOULEME', 'ST MALO', 'ST PIERRE DES CORPS'],
    'Sud-Est': ['PARIS LYON', 'LYON PART DIEU', 'MARSEILLE ST CHARLES', 'AVIGNON TGV',
                'MONTPELLIER', 'NICE VILLE', 'TOULON', 'AIX EN PROVENCE TGV', 'GRENOBLE',
                'CHAMBERY CHALLES LES EAUX', 'VALENCE ALIXAN TGV', 'DIJON VILLE', 'MACON LOCHE',
                'BELLEGARDE (AIN)', 'ANNECY', 'NIMES', 'PERPIGNAN', 'SAINT ETIENNE CHATEAUCREUX',
                'LE CREUSOT MONTCEAU MONTCHANIN', 'BESANCON FRANCHE COMTE TGV'],
    'Nord': ['PARIS NORD', 'LILLE', 'ARRAS', 'DOUAI', 'DUNKERQUE'],
    'Est': ['PARIS EST', 'STRASBOURG', 'REIMS', 'NANCY', 'METZ', 'MULHOUSE VILLE', 'NANTES']
}

# ─── MongoDB connection ───────────────────────────────────────────────────────
mongo_client = MongoClient(f'mongodb://{MONGO_HOST}:{MONGO_PORT}/')
db           = mongo_client[MONGO_DB]
collection   = db['tgv_regularite']

def wait_for_services() -> bool:
    """Poll MongoDB until it is reachable or the maximum retry count is exceeded.

    Returns:
        True if MongoDB responded successfully, False otherwise.
    """
    max_retries = 30
    retry_count = 0

    print("Waiting for services to become available...")

    while retry_count < max_retries:
        try:
            mongo_client.admin.command('ping')
            print("MongoDB is available")
            return True
        except Exception as exc:
            retry_count += 1
            print(f"Attempt {retry_count}/{max_retries} — MongoDB not yet available: {exc}")
            time.sleep(2)

    print("Error: MongoDB did not become available after maximum retries")
    return False

def generate_random_tgv_data() -> dict:
    """Build a realistic random TGV record.

    Selects a random region and two distinct stations within that region,
    then derives realistic statistics (cancellations, delays, punctuality).

    Returns:
        A dictionary suitable for insertion into the MongoDB collection.
    """
    # Pick a random region
    region = random.choice(REGIONS)

    # Select two distinct stations in that region
    station_pool = GARES[region]
    if len(station_pool) < 2:
        # Fallback: flatten all stations across regions
        station_pool = [s for stations in GARES.values() for s in stations]

    depart, arrivee = random.sample(station_pool, 2)

    # Generate realistic traffic statistics
    trains_prevus   = random.randint(50, 700)
    cancellation_rate = random.uniform(0, 0.02)          # 0–2 % cancellation
    trains_annules  = int(trains_prevus * cancellation_rate)
    trains_realises = trains_prevus - trains_annules

    # Punctuality between 70 % and 98 %
    ponctualite     = round(random.uniform(70.0, 98.0), 1)
    trains_on_time  = int(trains_realises * ponctualite / 100)
    retards         = trains_realises - trains_on_time

    # Random month between September 2011 and today
    start_date  = datetime(2011, 9, 1)
    end_date    = datetime.now()
    random_date = start_date + timedelta(
        days=random.randint(0, (end_date - start_date).days)
    )

    return {
        'date':             random_date.strftime('%Y-%m'),
        'region':           region,
        'depart':           depart,
        'arrivee':          arrivee,
        'trains_prevus':    trains_prevus,
        'trains_realises':  trains_realises,
        'trains_annules':   trains_annules,
        'retards':          retards,
        'ponctualite':      ponctualite,
        'timestamp':        datetime.utcnow().isoformat(),
    }

def parse_csv_row(row: str) -> Optional[dict]:
    """Parse a semicolon-delimited CSV row into a TGV record dictionary.

    Args:
        row: A raw CSV line with exactly 9 semicolon-separated fields.

    Returns:
        A parsed dictionary, or None if the row is malformed.
    """
    parts = row.strip().split(';')

    if len(parts) != 9:
        return None

    try:
        return {
            'date':             parts[0],
            'region':           parts[1],
            'depart':           parts[2],
            'arrivee':          parts[3],
            'trains_prevus':    int(parts[4]),
            'trains_realises':  int(parts[5]),
            'trains_annules':   int(parts[6]),
            'retards':          int(parts[7]),
            'ponctualite':      float(parts[8]),
            'timestamp':        datetime.utcnow().isoformat(),
        }
    except (ValueError, IndexError) as exc:
        print(f"CSV parse error: {exc}")
        return None

def save_to_mongodb(data: dict) -> bool:
    """Insert a single TGV record into the MongoDB collection.

    Args:
        data: The document to insert.

    Returns:
        True if the insert succeeded, False otherwise.
    """
    try:
        result = collection.insert_one(data)
        return result.inserted_id is not None
    except Exception as exc:
        print(f"MongoDB write error: {exc}")
        return False

def simulate_data_stream() -> None:
    """Generate and persist TGV records in an infinite loop at random intervals.

    Each iteration:
    - Creates a random TGV record.
    - Inserts it into MongoDB.
    - Waits for a randomly chosen interval (5, 10, 15 or 30 seconds).

    Exits cleanly on KeyboardInterrupt.
    """
    INTERVALS = [5, 10, 15, 30]  # Possible wait times in seconds

    print(f"\n{'='*60}")
    print("TGV SIMULATOR — Real-time data generation")
    print(f"{'='*60}\n")
    print("Generating random TGV records...")
    print(f"Random intervals: {INTERVALS} seconds")
    print(f"\n{'='*60}\n")

    count = 0

    try:
        while True:
            count += 1
            data          = generate_random_tgv_data()
            success       = save_to_mongodb(data)
            mongo_status  = "OK" if success else "ERROR"
            next_interval = random.choice(INTERVALS)

            print(
                f"[{count}] {data['date']} | {data['region']:12} | "
                f"{data['depart'][:20]:20} → {data['arrivee'][:20]:20} | "
                f"MongoDB: {mongo_status} | "
                f"Punctuality: {data['ponctualite']}% | "
                f"Next in: {next_interval}s"
            )

            time.sleep(next_interval)

    except KeyboardInterrupt:
        print(f"\n\n{'='*60}")
        print("Simulation stopped by user")
        print(f"{'='*60}\n")
        print_statistics()
    except Exception as exc:
        print(f"\n\nFATAL ERROR: {exc}")
        print_statistics()

def print_statistics() -> None:
    """Print a summary of the documents currently stored in MongoDB."""
    try:
        count = collection.count_documents({})
        print(f"MongoDB — total documents: {count}")
    except Exception as exc:
        print(f"Failed to retrieve statistics: {exc}")


def main() -> None:
    """Entry point: wait for MongoDB then start the simulation loop."""
    print("\nStarting TGV simulator...\n")

    if not wait_for_services():
        return

    simulate_data_stream()

    print("\nSimulator stopped")

if __name__ == "__main__":
    main()
