FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le script du simulateur
COPY tgv_simulator.py .

# Commande par défaut
CMD ["python", "tgv_simulator.py"]
