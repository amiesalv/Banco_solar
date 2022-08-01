const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  database: process.env.DB,
  host: process.env.DBHOST,
});
//funcion para guardar usuario a bd
const guardarUsuario = async (data) => {
  try {
    const SQLCONSULT = {
      text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING*",
      values: data,
    };
    const result = await pool.query(SQLCONSULT);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
};
//funcion para consultar a la bd
const consultarUsuarios = async () => {
  const SQLCONSULT = {
    text: "SELECT * FROM usuarios",
  };
  const result = await pool.query(SQLCONSULT);
  return result;
};

//funcion para editar usuario en bd
const editarUsuario = async (usuario, id) => {
  try {
    const values = Object.values(usuario).concat([id]);
    const SQLCONSULT = {
      text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id=$3 RETURNING*",
      values,
    };
    const result = await pool.query(SQLCONSULT);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//funcion para eliminar usuario

const eliminarUsuario = async (id) => {
  try {
    const SQLCONSULT = {
      text: "DELETE from usuarios WHERE id = $1 RETURNING*",
      values: [id],
    };
    const result = await pool.query(SQLCONSULT);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const registrarTransferencia = async ({ emisor, receptor, monto }) => {
  console.log(emisor, receptor, monto);
  //query para relacionar las dos tablas
  const { id: emisorID } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre='${emisor}' `)
  ).rows[0];
  const { id: receptorID } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre='${receptor}' `)
  ).rows[0];
  const registrarTransferenciaQuery = {
    text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES($1, $2, $3, NOW())",
    values: [emisorID, receptorID, monto],
  };
  const emisionTransferencias = {
    text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre=$2",
    values: [monto, emisor],
  };
  const recepcionTransferencias = {
    text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre=$2",
    values: [monto, receptor],
  };

  try {
    await pool.query("BEGIN");
    await pool.query(registrarTransferenciaQuery);
    await pool.query(emisionTransferencias);
    await pool.query(recepcionTransferencias);
    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw new Error(error);
  }
};

const historialTransferencias = async () => {
  const SQLCONSULT = {
    text: "SELECT * FROM transferencias",
    rowMode: "array",
  };
  const { rows } = await pool.query(SQLCONSULT);
  console.log(rows);
  return rows;
};

module.exports = {
  guardarUsuario,
  consultarUsuarios,
  editarUsuario,
  eliminarUsuario,
  registrarTransferencia,
  historialTransferencias,
};
