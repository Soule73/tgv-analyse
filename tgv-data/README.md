# Simulateur TGV - Génération de données en temps réel

Ce dossier contient un simulateur Python qui génère des données aléatoires de régularité des TGV et les indexe en temps réel sur Elasticsearch et MongoDB.

## Fonctionnalités

- 🎲 **Génération aléatoire** : Crée des données réalistes inspirées des vraies données SNCF
- 🔄 **Boucle infinie** : Génère et envoie des données en continu
- ⏱️ **Intervalles aléatoires** : Délais variables entre chaque envoi (5, 10, 15 ou 30 secondes)
- 🔍 **Indexation Elasticsearch** : Indexe chaque enregistrement dans l'index `tgv-regularite`
- 💾 **Sauvegarde MongoDB** : Enregistre les données dans la collection `tgv_regularite`
- ✅ **Vérification de disponibilité** : Attend que les services soient prêts avant de commencer
- 📈 **Statistiques** : Affiche le nombre total de documents indexés

## Données générées

Le simulateur génère des enregistrements avec les champs suivants :

- `date` : Date aléatoire entre 2011 et aujourd'hui (format YYYY-MM)
- `region` : Région aléatoire (Atlantique, Sud-Est, Nord, Est)
- `depart` : Gare de départ aléatoire
- `arrivee` : Gare d'arrivée aléatoire (différente du départ)
- `trains_prevus` : Nombre de trains prévus (50-700)
- `trains_realises` : Trains réellement effectués
- `trains_annules` : Trains annulés (0-2% des prévus)
- `retards` : Nombre de trains en retard (calculé selon la ponctualité)
- `ponctualite` : Taux de ponctualité en % (70-98%)
- `timestamp` : Horodatage de la génération

## Utilisation

### Démarrer le simulateur

```bash
docker-compose up tgv-simulator
```

### Démarrer tous les services

```bash
docker-compose up -d
```

### Voir les logs du simulateur

```bash
docker-compose logs -f tgv-simulator
```

### Arrêter le simulateur

```bash
docker-compose stop tgv-simulator
```

## Configuration

Les variables d'environnement suivantes peuvent être configurées dans `docker-compose.yml` :

- `ES_HOST` : Hôte Elasticsearch (défaut: elasticsearch)
- `ES_PORT` : Port Elasticsearch (défaut: 9200)
- `MONGO_HOST` : Hôte MongoDB (défaut: mongodb)
- `MONGO_PORT` : Port MongoDB (défaut: 27017)
- `MONGO_DB` : Base de données MongoDB (défaut: tgv_db)

**Note** : Les intervalles de génération sont aléatoires (5, 10, 15 ou 30 secondes) et ne peuvent pas être configurés.

## Vérification des données

### Elasticsearch

Vérifier le nombre de documents :

```bash
curl http://localhost:9200/tgv-regularite/_count
```

Rechercher des données :

```bash
curl http://localhost:9200/tgv-regularite/_search?pretty
```

### MongoDB

Se connecter à MongoDB :

```bash
docker exec -it mongodb mongo
```

Dans le shell Mongo :

```javascript
use tgv_db
db.tgv_regularite.count()
db.tgv_regularite.findOne()
```

## Interface Kibana

Accéder à Kibana pour visualiser les données :

- URL : http://localhost:5601
- Index pattern : `tgv-regularite`

## Fichiers

- `tgv_simulator.py` : Script principal du simulateur
- `requirements.txt` : Dépendances Python
- `Dockerfile` : Configuration Docker
- `README.md` : Cette documentation

## Exemple de sortie

```
[1] 2023-05 | Atlantique   | PARIS MONTPARNASSE   → NANTES               | ES: ✓ | MongoDB: ✓ | Ponctualité: 92.3% | Prochain envoi: 10s
[2] 2022-11 | Sud-Est      | LYON PART DIEU       → MARSEILLE ST CHARLES | ES: ✓ | MongoDB: ✓ | Ponctualité: 85.7% | Prochain envoi: 5s
[3] 2021-03 | Nord         | LILLE                → PARIS NORD           | ES: ✓ | MongoDB: ✓ | Ponctualité: 94.1% | Prochain envoi: 30s
```
