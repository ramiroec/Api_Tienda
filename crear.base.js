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

// Crear las tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS marca (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS producto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      foto TEXT NOT NULL,
      disponibilidad INTEGER NOT NULL CHECK (disponibilidad IN (0, 1)),
      id_marca INTEGER,
      FOREIGN KEY (id_marca) REFERENCES marca(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cliente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefono TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      fecha DATE NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS detalles_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pedido INTEGER,
      id_producto INTEGER,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      FOREIGN KEY (id_pedido) REFERENCES pedido(id),
      FOREIGN KEY (id_producto) REFERENCES producto(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      rol TEXT NOT NULL
    )
  `);

  // Insertar un usuario
  const nombreUsuario = 'admin';
  const contrasena = 'admin123';
  const nombre = 'Admin';
  const apellido = 'User';
  const rol = 'administrador';

  const insertUser = db.prepare(`
    INSERT INTO usuario (nombre_usuario, contrasena, nombre, apellido, rol)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run(nombreUsuario, contrasena, nombre, apellido, rol, (err) => {
    if (err) {
      console.error('Error al insertar el usuario:', err.message);
    } else {
      console.log('Base de datos y tablas creadas exitosamente. Usuario insertado.');
    }
  });

  insertUser.finalize();
});

// Cerrar la base de datos cuando termine el script
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Base de datos SQLite cerrada.');
  }
});
