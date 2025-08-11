const express = require('express');
const cors = require('cors');
const { readDB, writeDB } = require('./db');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all users
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users || []);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const db = readDB();
  const user = (db.users || []).find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user (signup)
app.post('/api/users', (req, res) => {
  const db = readDB();
  const { username, email, password, status } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }
  if ((db.users || []).some(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }
  if ((db.users || []).some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists.' });
  }
  const newUser = {
    id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password,
    status: status || 'active'
  };
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

// Login
app.post('/api/login', (req, res) => {
  const db = readDB();
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  res.json({ id: user.id, username: user.username, email: user.email, status: user.status });
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const db = readDB();
  const user = (db.users || []).find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  writeDB(db);
  res.json(user);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const db = readDB();
  db.users = (db.users || []).filter(u => u.id != req.params.id);
  writeDB(db);
  res.status(204).end();
});

// Dashboard summary endpoint
app.get('/api/summary', (req, res) => {
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);
  const loginsToday = (db.loginsToday || []).filter(l => l.timestamp && l.timestamp.startsWith(today));
  const activeUsers = (db.users || []).filter(u => u.status === 'active').length;
  const summary = {
    totalUsers: (db.users || []).length,
    activeUsers,
    loginsToday: loginsToday.length,
    anomalies: 0, // Placeholder, update if you track anomalies
    lastUpdated: new Date().toISOString()
  };
  res.json(summary);
});

// Usage metrics endpoint
app.get('/api/usage', (req, res) => {
  const db = readDB();
  const timeframe = req.query.timeframe || 'daily';
  // If you have usageMetrics in db.json, return it. Otherwise, return an empty array.
  if (db.usageMetrics && db.usageMetrics[timeframe]) {
    res.json(db.usageMetrics[timeframe]);
  } else {
    res.json([]);
  }
});

// User activity endpoint
app.get('/api/user-activity', (req, res) => {
  const db = readDB();
  // If you have userActivity in db.json, return it. Otherwise, return an empty array.
  res.json(db.userActivity || []);
});

// Anomalies endpoint
app.get('/api/anomalies', (req, res) => {
  const db = readDB();
  // If you have anomalies in db.json, return it. Otherwise, return an empty array.
  res.json(db.anomalies || []);
});

// System status endpoint
app.get('/api/system-status', (req, res) => {
  const db = readDB();
  // If you have systemStatus in db.json, return it. Otherwise, return an empty object.
  res.json(db.systemStatus || {});
});

app.listen(PORT, () => {
  console.log(`User API running on http://localhost:${PORT}`);
});
