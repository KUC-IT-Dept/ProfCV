require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Fail database operations quickly if Mongo is unavailable instead of hanging requests.
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 5000);

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const directoryRoutes = require('./routes/directory');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://profcv-kuc.netlify.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [])
]);

const netlifyPreviewPattern = /^https:\/\/[a-z0-9-]+--profcv-kuc\.netlify\.app$/i;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (netlifyPreviewPattern.test(origin)) return true;
  return false;
}

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static file serving for uploads ──────────────────────────────────────────
// Constraint #3: path.join(__dirname, ...) for absolute path correctness
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/directory', directoryRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
const mongoStateLabel = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

app.get('/api/health', (_req, res) => {
  const dbState = mongoStateLabel[mongoose.connection.readyState] || 'unknown';
  return res.json({ status: 'ok', dbState });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[GlobalError]', err);
  if (typeof err.message === 'string' && err.message.startsWith('Not allowed by CORS')) {
    return res.status(403).json({ message: err.message });
  }
  // Handle multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5 MB.' });
  }
  return res.status(500).json({ message: err.message || 'Internal server error.' });
});

// ── Database & Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

app.listen(PORT, () => {
  console.log(`🚀 Prof CV API server running on http://localhost:${PORT}`);
});

if (!MONGO_URI) {
  console.error('❌ Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in environment variables.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected');
});
