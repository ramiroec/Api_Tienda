const sqlite3 = require('sqlite3').verbose();

// Nombre del archivo de la base de datos
const dbFile = 'tienda.sqlite';

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

module.exports = db;
