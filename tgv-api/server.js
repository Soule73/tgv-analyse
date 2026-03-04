/**
 * TGV Regularity API
 * Express server exposing REST endpoints for TGV data stored in MongoDB.
 */

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MongoDB configuration ────────────────────────────────────────────────────
const MONGO_HOST = process.env.MONGO_HOST || 'mongodb';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB = process.env.MONGO_DB || 'tgv_db';
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;

const COLLECTION_NAME = 'tgv_regularite';
const RECONNECT_DELAY_MS = 5000;

let collection;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts pagination parameters from an Express query string.
 * @param {object} query - Express request.query object.
 * @returns {{ page: number, limit: number, skip: number }}
 */
function getPagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Builds a standardised paginated JSON response.
 * @param {object[]} data       - Documents for the current page.
 * @param {number}   total      - Total matching document count.
 * @param {{ page: number, limit: number }} pagination
 * @returns {object}
 */
function paginatedResponse(data, total, { page, limit }) {
  return {
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

// ─── Database connection ──────────────────────────────────────────────────────

/**
 * Connects to MongoDB and assigns the module-level `collection` variable.
 * Retries automatically after RECONNECT_DELAY_MS on failure.
 */
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    collection = client.db(MONGO_DB).collection(COLLECTION_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    setTimeout(connectToMongoDB, RECONNECT_DELAY_MS);
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/tgv
 * Returns all documents with cursor-based pagination.
 * Query params: page (default 1), limit (default 50).
 */
app.get('/api/tgv', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [data, total] = await Promise.all([
      collection.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments({}),
    ]);

    res.json(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error('GET /api/tgv error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/tgv/all
 * Returns all documents as a plain array (no pagination wrapper).
 * ObjectId fields are serialised as strings for JSON compatibility.
 * Query params: limit (default 1000).
 */
app.get('/api/tgv/all', async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 1000);

    const data = await collection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();

    const cleanData = data.map((doc) => ({ ...doc, _id: doc._id.toString() }));
    res.json(cleanData);
  } catch (error) {
    console.error('GET /api/tgv/all error:', error.message);
    res.status(500).json([]);
  }
});

/**
 * GET /api/tgv/:id
 * Returns a single document by its MongoDB ObjectId.
 */
app.get('/api/tgv/:id', async (req, res) => {
  try {
    const data = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!data) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/tgv/:id error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/tgv/region/:region
 * Returns documents filtered by region name, with pagination.
 */
app.get('/api/tgv/region/:region', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { region: req.params.region };

    const [data, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    res.json(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error('GET /api/tgv/region/:region error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/tgv/gare/:gare
 * Returns documents where departure or arrival station matches the query
 * (case-insensitive substring match), with pagination.
 */
app.get('/api/tgv/gare/:gare', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const stationRegex = { $regex: req.params.gare, $options: 'i' };
    const filter = {
      $or: [{ depart: stationRegex }, { arrivee: stationRegex }],
    };

    const [data, total] = await Promise.all([
      collection.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    res.json(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error('GET /api/tgv/gare/:gare error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/stats
 * Returns global statistics: document count, per-region breakdown,
 * average punctuality, and timestamp of the most-recent record.
 */
app.get('/api/stats', async (req, res) => {
  try {
    const [total, regions, avgResult, latest] = await Promise.all([
      collection.countDocuments({}),
      collection.aggregate([{ $group: { _id: '$region', count: { $sum: 1 } } }]).toArray(),
      collection
        .aggregate([{ $group: { _id: null, moyenne: { $avg: '$ponctualite' } } }])
        .toArray(),
      collection.find({}).sort({ timestamp: -1 }).limit(1).toArray(),
    ]);

    res.json({
      success: true,
      stats: {
        total_documents: total,
        regions,
        ponctualite_moyenne: avgResult[0]?.moyenne || 0,
        dernier_envoi: latest[0]?.timestamp || null,
      },
    });
  } catch (error) {
    console.error('GET /api/stats error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/latest
 * Returns the most-recent records.
 * Query params: limit (default 10).
 */
app.get('/api/latest', async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    const data = await collection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();

    res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('GET /api/latest error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/regions
 * Returns the list of distinct region names present in the collection.
 */
app.get('/api/regions', async (req, res) => {
  try {
    const regions = await collection.distinct('region');
    res.json({ success: true, regions });
  } catch (error) {
    console.error('GET /api/regions error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /
 * Root route — API discovery.
 */
app.get('/', (_req, res) => {
  res.json({
    message: 'TGV Regularity API',
    version: '1.0.0',
    endpoints: {
      'GET /api/tgv': 'All data (paginated: ?page=1&limit=50)',
      'GET /api/tgv/all': 'All data as array (?limit=1000)',
      'GET /api/tgv/:id': 'Single document by ObjectId',
      'GET /api/tgv/region/:region': 'Filter by region (paginated)',
      'GET /api/tgv/gare/:gare': 'Filter by station — departure or arrival (paginated)',
      'GET /api/stats': 'Global statistics',
      'GET /api/latest': 'Latest records (?limit=10)',
      'GET /api/regions': 'List of available regions',
    },
  });
});

// ─── Server bootstrap ─────────────────────────────────────────────────────────

/**
 * Connects to MongoDB then starts the HTTP server.
 */
async function startServer() {
  await connectToMongoDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TGV API listening on port ${PORT}`);
  });
}

startServer();
