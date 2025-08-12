const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database functions
function readDatabase() {
  try {
    const dbPath = path.join(__dirname, 'db.json');
    if (!fs.existsSync(dbPath)) {
      // Create initial db.json if it doesn't exist
      const initialDb = { 
        users: [], 
        loginsToday: [],
        usageMetrics: [],
        userActivity: [],
        anomalies: [],
        systemStatus: {}
      };
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], loginsToday: [] };
  }
}

function writeDatabase(data) {
  try {
    const dbPath = path.join(__dirname, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API server is working' });
});

// User routes
app.get('/api/users', (req, res) => {
  const db = readDatabase();
  res.json(db.users || []);
});

app.get('/api/users/:id', (req, res) => {
  const db = readDatabase();
  const user = (db.users || []).find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { username, email, password, status = 'active' } = req.body;
  
  // Validate required fields
  if (!username) return res.status(400).json({ error: 'Username is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });
  
  const db = readDatabase();
  
  // Check for duplicate username
  if ((db.users || []).some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  // Check for duplicate email
  if ((db.users || []).some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    status
  };
  
  if (!db.users) db.users = [];
  db.users.push(newUser);
  
  writeDatabase(db);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, status } = req.body;
  
  const db = readDatabase();
  const userIndex = (db.users || []).findIndex(u => u.id === userId);
  
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  // Check for duplicate username
  if (username && username !== db.users[userIndex].username) {
    if (db.users.some(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  }
  
  // Check for duplicate email
  if (email && email !== db.users[userIndex].email) {
    if (db.users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
  }
  
  // Update user
  db.users[userIndex] = {
    ...db.users[userIndex],
    username: username || db.users[userIndex].username,
    email: email || db.users[userIndex].email,
    status: status || db.users[userIndex].status
  };
  
  writeDatabase(db);
  
  // Return user without password
  const { password, ...userWithoutPassword } = db.users[userIndex];
  res.json(userWithoutPassword);
});

app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  const db = readDatabase();
  const userIndex = (db.users || []).findIndex(u => u.id === userId);
  
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  // Remove user
  db.users.splice(userIndex, 1);
  writeDatabase(db);
  
  res.json({ success: true, message: 'User deleted successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDatabase();
  
  const user = (db.users || []).find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  // Track this login for today
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Initialize loginsToday array if it doesn't exist
  if (!db.loginsToday) {
    db.loginsToday = [];
  }
  
  // Add this login to the loginsToday array
  db.loginsToday.push({
    username: user.username,
    timestamp: now.toISOString(),
    date: today // Explicitly store the date for easier filtering
  });
  
  // Save to database
  writeDatabase(db);
  
  console.log(`Login recorded for ${username} on ${today}`);
  console.log(`Total logins recorded: ${db.loginsToday.length}`);
  
  return res.json({ 
    success: true, 
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status || 'active'
    }
  });
});

// Summary endpoint
app.get('/api/summary', (req, res) => {
  const db = readDatabase();
  
  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  console.log(`Today's date: ${today}`);
  
  // Ensure loginsToday exists
  if (!db.loginsToday) {
    db.loginsToday = [];
  }
  
  // Filter loginsToday to count only logins from today
  const todayLogins = db.loginsToday.filter(login => {
    // Use the date field if available, otherwise parse from timestamp
    const loginDate = login.date || login.timestamp.split('T')[0];
    return loginDate === today;
  });
  
  // Count unique users who logged in today
  const uniqueUsers = [...new Set(todayLogins.map(login => login.username))];
  
  const summary = {
    totalUsers: db.users ? db.users.length : 0,
    activeUsers: db.users ? db.users.filter(user => user.status === 'active').length : 0,
    loginsToday: uniqueUsers.length,
    anomalies: db.anomalies ? db.anomalies.length : 0,
    lastUpdated: new Date().toISOString()
  };
  
  res.json(summary);
});

// Usage endpoint
app.get('/api/usage', (req, res) => {
  const db = readDatabase();
  const timeframe = req.query.timeframe || 'daily';
  
  res.json(db.usageMetrics || []);
});

// User Activity endpoint
app.get('/api/user-activity', (req, res) => {
  const db = readDatabase();
  
  res.json(db.userActivity || []);
});

// Anomalies endpoint
app.get('/api/anomalies', (req, res) => {
  const db = readDatabase();
  
  res.json(db.anomalies || []);
});

// System Status endpoint
app.get('/api/system-status', (req, res) => {
  const db = readDatabase();
  
  res.json(db.systemStatus || {});
});

// Debug endpoints
app.get('/api/debug/logins', (req, res) => {
  const db = readDatabase();
  const today = new Date().toISOString().split('T')[0];
  
  res.json({
    today: today,
    allLogins: db.loginsToday || [],
    todayLogins: (db.loginsToday || []).filter(l => {
      const date = l.date || l.timestamp.split('T')[0];
      return date === today;
    })
  });
});

app.post('/api/debug/reset-logins', (req, res) => {
  const db = readDatabase();
  db.loginsToday = [];
  writeDatabase(db);
  console.log('Login counts reset');
  res.json({ success: true, message: 'Login counts reset successfully' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});