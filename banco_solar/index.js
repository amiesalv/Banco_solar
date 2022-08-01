const express = require("express");
const { Pool } = require("pg");
const {
  guardarUsuario,
  consultarUsuarios,
  editarUsuario,
  eliminarUsuario,
  registrarTransferencia,
  historialTransferencias,
} = require("./consultas.js");
const app = express();
require("dotenv").config();
//middleware
app.use(express.json());
//conectarse con front
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//ruta post guardar usuario
app.post("/usuario", async (req, res) => {
  try {
    const data = Object.values(req.body);
    const result = await guardarUsuario(data);
    res.status(201).send("Se agrego un nuevo usuario con exito.");
  } catch (error) {
    res.status(500).send("No se pudo crear el usuario.");
  }
});
//ruta get para mandar info de la bd al front
app.get("/usuarios", async (req, res) => {
  try {
    const result = await consultarUsuarios();
    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//ruta put para actualizar usuario en front y bd
app.put("/usuario", async (req, res) => {
  try {
    const usuario = Object.values(req.body);
    const { id } = req.query;
    const result = await editarUsuario(usuario, id);
    res.status(201).send("Se ha editado correctamente el usuario");
  } catch (error) {
    res.status(500).send(error);
  }
});

//funcion para eliminar usuario
app.delete("/usuario", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await eliminarUsuario(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Error al eliminar usuario");
  }
});

// funcion registrar transferencia en bd
app.post("/transferencia", async (req, res) => {
  try {
    const registrar = req.body;

    const result = await registrarTransferencia(registrar);

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Error en Transferencia");
  }
});

//funcion get datos transferencias en front

app.get("/transferencias", async (req, res) => {
  try {
    const transferencia = await historialTransferencias();
    res.json(transferencia);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
