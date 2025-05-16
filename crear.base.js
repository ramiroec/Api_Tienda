const Database = require('better-sqlite3');

// Nombre del archivo de la base de datos
const dbFile = 'tienda.sqlite';

// Conexión a la base de datos SQLite
const db = new Database(dbFile);
console.log('Conectado a la base de datos SQLite.');

// Crear las tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS marca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    foto TEXT NOT NULL,
    disponibilidad INTEGER NOT NULL CHECK (disponibilidad IN (0, 1)),
    id_marca INTEGER,
    FOREIGN KEY (id_marca) REFERENCES marca(id)
  );

  CREATE TABLE IF NOT EXISTS cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT
  );

  CREATE TABLE IF NOT EXISTS pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    fecha DATE NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
  );

  CREATE TABLE IF NOT EXISTS detalles_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio REAL NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
  );

  CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol TEXT NOT NULL
  );
`);

// Insertar usuario
try {
  const stmt = db.prepare(`
    INSERT INTO usuario (nombre_usuario, contrasena, nombre, apellido, rol)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run('admin', 'admin123', 'Admin', 'User', 'administrador');
  console.log('Usuario insertado.');
} catch (err) {
  console.error('Error al insertar el usuario:', err.message);
}

// Insertar marca
try {
  const stmt = db.prepare(`INSERT INTO marca (nombre) VALUES (?)`);
  stmt.run('Nike');
  console.log('Marca insertada.');
} catch (err) {
  console.error('Error al insertar la marca:', err.message);
}

// Insertar producto
try {
  const stmt = db.prepare(`
    INSERT INTO producto (nombre, precio, foto, disponibilidad, id_marca)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    'Calzado Nike',
    79.99,
    'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/7c2d678c-7f10-40df-ba7d-0872137761c6/WMNS+ZOOM+FLY+5.png',
    1,
    1
  );
  console.log('Producto insertado.');
} catch (err) {
  console.error('Error al insertar el producto:', err.message);
}

// Insertar cliente
try {
  const stmt = db.prepare(`
    INSERT INTO cliente (nombre, apellido, email, telefono)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run('Juan', 'Pérez', 'juan.perez@example.com', '123456789');
  console.log('Cliente insertado.');
} catch (err) {
  console.error('Error al insertar el cliente:', err.message);
}

// Cerrar la base de datos
db.close();
console.log('Base de datos SQLite cerrada.');
