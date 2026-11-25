const express = require('express');
const morgan = require('morgan');
const mongose = require('mongoose');
const path = require('path');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Conexión a MongoDB
mongose.connect("mongodb+srv://root:root@cluster0.vcrqhkl.mongodb.net/spotify")
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch(err => console.log("Error al conectar a MongoDB", err));

const artistaSchema = new mongose.Schema({
    nombre: String,
    pais: String,
    añoFormacion: Number,
    generoMusical: String,
    integrantes: Number,
    reproduccionesMensuales: Number,
    urlFoto: String
});
const Artista = mongose.model('Artista', artistaSchema, 'artistas');

const cancionSchema = new mongose.Schema({
    titulo: String,
    artista_id: { type: mongose.Schema.Types.ObjectId, ref: 'Artista' },
    album: String,
    duracion: Number,
    reproducciones: Number,
    añoLanzamiento: Number,
    urlFotoAlbum: String
});
const Cancion = mongose.model('Cancion', cancionSchema, 'canciones');

// ===== RUTAS API =====

// Obtener todos
app.get('/api/artistas', async (req, res) => {
    try {
        const artistas = await Artista.find();
        res.status(200).json(artistas);
    } catch (e) { res.status(500).json({ msg: "Error al obtener Artistas", error: e }); }
});

app.get('/api/canciones', async (req, res) => {
    try {
        const canciones = await Cancion.find().populate('artista_id');
        res.status(200).json(canciones);
    } catch (e) { res.status(500).json({ msg: "Error al obtener Canciones", error: e }); }
});

// Insertar artista
app.post('/api/artistas', async (req, res) => {
    try {
        const nuevoArtista = new Artista(req.body);
        const artistaGuardado = await nuevoArtista.save();
        res.status(201).json({
            mensaje: "Artista creado correctamente",
            artista: artistaGuardado
        });
    } catch (e) {
        res.status(400).json({ msg: "Error al crear el artista", error: e });
    }
});

// Actualizar artista
app.put('/api/artistas/:id', async (req, res) => {
    try {
        const artistaActualizado = await Artista.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!artistaActualizado) {
            return res.status(404).json({ mensaje: "Artista no encontrado" });
        }

        res.status(200).json({
            mensaje: "Artista actualizado correctamente",
            artista: artistaActualizado
        });
    } catch (e) {
        res.status(400).json({ msg: "Error al actualizar el artista", error: e });
    }
});

// Eliminar artista
app.delete('/api/artistas/:id', async (req, res) => {
    try {
        const artistaEliminado = await Artista.findByIdAndDelete(req.params.id);

        if (!artistaEliminado) {
            return res.status(404).json({ mensaje: "Artista no encontrado" });
        }

        res.status(200).json({
            mensaje: "Artista eliminado correctamente",
            artista: artistaEliminado
        });
    } catch (e) {
        res.status(500).json({ msg: "Error al eliminar el artista", error: e });
    }
});

// Insertar canción
app.post('/api/canciones', async (req, res) => {
    try {
        const nuevaCancion = new Cancion(req.body);
        const cancionGuardada = await nuevaCancion.save();
        res.status(201).json({
            mensaje: "Canción creada correctamente",
            cancion: cancionGuardada
        });
    } catch (e) {
        res.status(400).json({ msg: "Error al crear la canción", error: e });
    }
});

// Actualizar canción
app.put('/api/canciones/:id', async (req, res) => {
    try {
        const cancionActualizada = await Cancion.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!cancionActualizada) {
            return res.status(404).json({ mensaje: "Canción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Canción actualizada correctamente",
            cancion: cancionActualizada
        });
    } catch (e) {
        res.status(400).json({ msg: "Error al actualizar la canción", error: e });
    }
});

// Eliminar canción
app.delete('/api/canciones/:id', async (req, res) => {
    try {
        const cancionEliminada = await Cancion.findByIdAndDelete(req.params.id);

        if (!cancionEliminada) {
            return res.status(404).json({ mensaje: "Canción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Canción eliminada correctamente",
            cancion: cancionEliminada
        });
    } catch (e) {
        res.status(500).json({ msg: "Error al eliminar la canción", error: e });
    }
});

app.get('/api/estado', (req, res) => {
    res.json({ mensaje: 'Servidor Express funcionando correctamente' });
});

// Servir el frontend principal en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Solo levantar puerto en desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Servidor escuchando en http://localhost:3000");
    });
}

module.exports = app;