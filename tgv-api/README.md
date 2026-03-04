# TGV API - Express MongoDB

REST API in Express.js to retrieve TGV punctuality data from MongoDB.

## Available Endpoints

### GET /

API documentation with the list of endpoints

### GET /api/tgv

Retrieve all data with pagination

**Query params:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 50)

**Example:**

```
GET /api/tgv?page=1&limit=20
```

### GET /api/tgv/:id

Retrieve a specific document by its MongoDB ID

**Example:**

```
GET /api/tgv/507f1f77bcf86cd799439011
```

### GET /api/tgv/region/:region

Filter data by region

**Available regions:** Atlantique, Sud-Est, Nord, Est

**Example:**

```
GET /api/tgv/region/Atlantique?page=1&limit=50
```

### GET /api/tgv/gare/:gare

Filter data by station (searches both departure and arrival)

**Example:**

```
GET /api/tgv/gare/PARIS
```

### GET /api/stats

Get global statistics

**Returns:**

- Total number of documents
- Number of documents per region
- Average punctuality
- Date of last entry

### GET /api/latest

Retrieve the latest records

**Query params:**

- `limit` (optional): Number of items (default: 10)

**Example:**

```
GET /api/latest?limit=20
```

### GET /api/regions

List available regions

## Response Format

### Success

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "pages": 20
  }
}
```

### Error

```json
{
  "success": false,
  "error": "Error message"
}
```

## Usage

### Start the API

```bash
docker-compose up tgv-api
```

### Access the API

The API will be available at: `http://localhost:3000`

### Request Examples

```bash
# Retrieve all data
curl http://localhost:3000/api/tgv

# Retrieve the latest records
curl http://localhost:3000/api/latest?limit=5

# Statistics
curl http://localhost:3000/api/stats

# Filter by region
curl http://localhost:3000/api/tgv/region/Atlantique

# Search by station
curl http://localhost:3000/api/tgv/gare/PARIS
```

## Configuration

Environment variables in `docker-compose.yml`:

- `PORT`: API port (default: 3000)
- `MONGO_HOST`: MongoDB host (default: mongodb)
- `MONGO_PORT`: MongoDB port (default: 27017)
- `MONGO_DB`: Database name (default: tgv_db)

## Data Structure

Each document contains:

```json
{
  "_id": "ObjectId",
  "date": "2023-05",
  "region": "Atlantique",
  "depart": "PARIS MONTPARNASSE",
  "arrivee": "NANTES",
  "trains_prevus": 595,
  "trains_realises": 595,
  "trains_annules": 0,
  "retards": 24,
  "ponctualite": 96.0,
  "timestamp": "2023-12-06T10:30:00.000Z"
}
```

## Files

- `server.js`: Main API code
- `package.json`: Node.js dependencies
- `Dockerfile`: Docker configuration
- `README.md`: This documentation
