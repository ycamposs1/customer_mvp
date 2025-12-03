// src/db.js
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Ruta al archivo .db (en la raíz del proyecto)
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'face_exam.db');
// Ruta al schema.sql
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');

// Crear/abrir la base de datos (una sola vez)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo la base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite abierta en:', dbPath);

    // Leer y aplicar el schema
    try {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema, (err2) => {
        if (err2) {
          console.error('Error aplicando schema.sql:', err2.message);
        } else {
          console.log('schema.sql aplicado (o tablas ya existían).');
        }
      });
    } catch (readErr) {
      console.error('No se pudo leer schema.sql:', readErr.message);
    }
  }
});

// Helpers en PROMESA para usar en los repos

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('DB run error:', err.message);
        return reject(err);
      }
      // this.lastID, this.changes, etc.
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('DB get error:', err.message);
        return reject(err);
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('DB all error:', err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  db,
  run,
  get,
  all
};
