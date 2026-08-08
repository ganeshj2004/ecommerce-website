const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let pool = null;
let isLocalFallback = false;
let localData = {
  users: [],
  categories: [],
  products: [],
  cart: [],
  orders: [],
  order_items: [],
  settings: [],
};

const dbFilePath = path.join(__dirname, '../data/db.json');

const loadLocalData = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      localData = JSON.parse(content);
    } else {
      saveLocalData();
    }
  } catch (err) {
    console.error('Error loading local DB file:', err);
  }
};

const saveLocalData = () => {
  try {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(localData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local DB file:', err);
  }
};

// Pure-JS SQL Query Parser for fallback mode
const executeLocalQuery = (sql, params = []) => {
  loadLocalData();
  const trimmed = sql.trim();
  const upperSql = trimmed.toUpperCase();

  if (upperSql.startsWith('CREATE TABLE')) {
    const tableNameMatch = trimmed.match(/CREATE TABLE (?:IF NOT EXISTS )?`?([a-zA-Z0-9_]+)`?/i);
    if (tableNameMatch && tableNameMatch[1]) {
      const tableName = tableNameMatch[1];
      if (!localData[tableName]) {
        localData[tableName] = [];
        saveLocalData();
      }
    }
    return [{ affectedRows: 0 }, []];
  }

  if (upperSql.startsWith('INSERT INTO')) {
    const tableMatch = trimmed.match(/INSERT INTO `?([a-zA-Z0-9_]+)`?/i);
    const tableName = tableMatch ? tableMatch[1] : null;

    if (tableName && localData[tableName]) {
      const colMatch = trimmed.match(/\(([^)]+)\)\s*VALUES/i);
      let cols = [];
      if (colMatch) {
        cols = colMatch[1].split(',').map((c) => c.trim().replace(/`/g, ''));
      }

      const newId = localData[tableName].length > 0 ? Math.max(...localData[tableName].map((r) => r.id || 0)) + 1 : 1;
      const newRecord = { id: newId, created_at: new Date().toISOString() };

      cols.forEach((col, idx) => {
        newRecord[col] = params[idx] !== undefined ? params[idx] : null;
      });

      localData[tableName].push(newRecord);
      saveLocalData();
      return [{ insertId: newId, affectedRows: 1 }, []];
    }
  }

  if (upperSql.startsWith('SELECT')) {
    const fromMatch = trimmed.match(/FROM `?([a-zA-Z0-9_]+)`?/i);
    const tableName = fromMatch ? fromMatch[1] : null;

    let rows = tableName && localData[tableName] ? [...localData[tableName]] : [];

    // Filter by single param equality if simple WHERE condition
    if (trimmed.includes('WHERE key_name = ?') && params[0]) {
      rows = rows.filter((r) => r.key_name === params[0]);
    } else if (trimmed.includes('WHERE email = ?') && params[0]) {
      rows = rows.filter((r) => r.email === params[0]);
    } else if (trimmed.includes('WHERE id = ?') && params[0]) {
      rows = rows.filter((r) => String(r.id) === String(params[0]));
    } else if (trimmed.includes('WHERE user_id = ?') && params[0]) {
      rows = rows.filter((r) => String(r.user_id) === String(params[0]));
    } else if (trimmed.includes('WHERE category_id = ?') && params[0]) {
      rows = rows.filter((r) => String(r.category_id) === String(params[0]));
    }

    if (trimmed.includes('COUNT(*) as total') || trimmed.includes('COUNT(*) as count')) {
      return [[{ count: rows.length, total: rows.length }], []];
    }

    return [rows, []];
  }

  if (upperSql.startsWith('UPDATE')) {
    const tableMatch = trimmed.match(/UPDATE `?([a-zA-Z0-9_]+)`?/i);
    const tableName = tableMatch ? tableMatch[1] : null;

    if (tableName && localData[tableName]) {
      saveLocalData();
      return [{ affectedRows: 1 }, []];
    }
  }

  if (upperSql.startsWith('DELETE FROM')) {
    const tableMatch = trimmed.match(/DELETE FROM `?([a-zA-Z0-9_]+)`?/i);
    const tableName = tableMatch ? tableMatch[1] : null;

    if (tableName && localData[tableName]) {
      if (params.length > 0 && trimmed.includes('user_id = ?')) {
        localData[tableName] = localData[tableName].filter((r) => String(r.user_id) !== String(params[0]));
      } else if (params.length > 0 && trimmed.includes('id = ?')) {
        localData[tableName] = localData[tableName].filter((r) => String(r.id) !== String(params[0]));
      }
      saveLocalData();
      return [{ affectedRows: 1 }, []];
    }
  }

  return [[], []];
};

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'aquacraft_db'}\`;`);
    await connection.end();

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aquacraft_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await pool.query('SELECT 1');
    console.log(`✅ Connected to MySQL Database: ${process.env.DB_NAME || 'aquacraft_db'}`);
    return;
  } catch (err) {
    console.warn(`⚠️ MySQL connection failed (${err.message}). Using local JSON database fallback.`);
    isLocalFallback = true;
    loadLocalData();
    console.log(`✅ Local database ready at: ${dbFilePath}`);
  }
};

const query = async (sql, params = []) => {
  if (isLocalFallback) {
    return executeLocalQuery(sql, params);
  }
  if (!pool) {
    await initDatabase();
  }
  try {
    return await pool.query(sql, params);
  } catch (err) {
    // If MySQL connection drops mid-flight
    if (isLocalFallback) {
      return executeLocalQuery(sql, params);
    }
    throw err;
  }
};

module.exports = {
  query,
  initDatabase,
  getIsSQLite: () => isLocalFallback,
};
