//Archivo pricipal del servidor
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Se abre la configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhosst',
    user: 'root',
    password: ' ',//remplazar usuario y contraseñad de mysql
    database: 'registro users' //remplazar nombre de la base de datos

});

// Conexión a la base de datos
db.connect((err) => {
    if(err){
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');


//Tabla de usuarios
const crearTablaUsuarios = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(crearTablaUsuarios, (err) => {
    if(err){
        console.error('Error al crear la tabla de usuarios:', err);
        return;
    }
    console.log('Tabla de usuarios creada exitosamente');
});

}); //Aqui se cierra la conexión a la base de datos

// Rutas para registrar usuarios
app.post('/api/usuarios', (req, res) => {
    const {nombre, apellido, edad, telefono} = req.body;
    
    //Validar los datos basicos
    if(!nombre || !apellido || !edad || !telefono){
        return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    //Insertar el usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombre, apellido, edad, telefono) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, apellido, edad, telefono], (err, result) => {
        if(err){
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({message: 'Error al registrar el usuario'});
        }
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userld: result.insertId,
        });
    });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, results) => {
        if(err){
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({message: 'Error al obtener los usuarios'});
        }
        res.status(200).json(results);
    });
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 