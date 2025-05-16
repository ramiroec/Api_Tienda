// Importar better-sqlite3
const Database = require('better-sqlite3');

// Nombre del archivo de la base de datos
const dbFile = 'tienda.sqlite';

// Conexión a la base de datos SQLite
const db = new Database(dbFile);

// Exportar la base de datos
module.exports = db;
