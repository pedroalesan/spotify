const express = require('express');
const morgan = require('morgan');
const mongose = require('mongoose');

const app = express();

//Midllewares
app.use(morgan('dev'));
app.use(express.json());

// Conexion a mongo
mongose.connect("mongodb+srv://root:root@cluster0.vcrqhkl.mongodb.net/spotify")
    .then(() => console.log("Conexión exitosa a MongoDB"))
    .catch(err => console.log("Error al conectar a MongoDB", err))

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
    artista_id: { type: mongose.Schema.Types.ObjectId, ref: 'Artista'},
    album: String,
    duracion: Number,
    reproducciones: Number,
    añoLanzamiento: Number,
    urlFotoAlbum: String
});
const Cancion = mongose.model('Cancion', cancionSchema, 'canciones');

//1. 
app.get('/api/artistas', async (req,res)=>{
    try {
        const artistas = await Artista.find();
        res.status(200).json(artistas);
    } catch (e) { res.status(500).json({msg: "Error al obtener Artistas", error: e});}
});

app.get('/api/canciones', async (req,res)=>{
    try {
        const canciones = await Cancion.find();
        res.status(200).json(canciones);
    } catch (e) {res.status(500).json({msg:"Error al obtener Canciones",error:e});}
});

//2.
// ===== ARTISTAS =====

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

// ===== CANCIONES =====

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

app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000")
});

app.get("/", (req,res)=>{
        res.status(200).json({
            mensaje: "Servidor Express funcionando correctamente"
        });
});