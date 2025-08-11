// File-based persistence using db.json
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
