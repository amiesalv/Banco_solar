Banco Solar
Software simple de Banco hecho con Express
Librerías a instalar: express, nodemon, pg, dotenv.

El software funciona con CRUD para crear, actualizar, eliminar usuarios, además de hacer la transferencia dejando un historial en el front para el cliente.
En el archivo consultas.js se encuentran todas las consultas a la base de datos creada con los siguientes comandos.

CREATE DATABASE bancosolar;
CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50), balance FLOAT CHECK (balance >= 0));
CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));

BOOTSTRAP: 4.5.3
JQUERY: 3.5.1
