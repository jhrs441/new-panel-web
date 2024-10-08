// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.post('/create-file', (req, res) => {
    const { fileName, area, filas } = req.body;
    const dataDir = path.join(process.cwd(), 'datos');

    // Verificar si la carpeta 'datos' existe, si no, crearla
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, `${fileName}.json`);

    // Crear losas automáticamente
    const cubos = filas * 15;
    const losas = [];
    for (let i = 1; i <= cubos; i++) {
        losas.push({
            [`losa-${i}`]: [{
                estado: 0,
                ip: "",
                MAC: "",
                nombre_equipo: "",
                tipo: "",
                img1: "losa_central.png",
                img2: "null",
                img3: "null"
            }]
        });
    }

    const testData = {
        area,
        filas,
        losas
    };

    fs.writeFile(filePath, JSON.stringify(testData, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error al crear el archivo');
        }
        res.send('Archivo creado exitosamente');
    });
});

app.put('/update-losa', (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const { fileName, losa, estado, ip, MAC, nombre_equipo } = req.body;
    // Construir la ruta completa del archivo JSON
    const filePath = path.join(process.cwd(), 'datos', `${fileName}.json`);

    // Leer el archivo JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Manejar el error si ocurre al leer el archivo
            return res.status(500).send('Error al leer el archivo');
        }

        // Parsear el contenido del archivo JSON a un objeto JavaScript
        const jsonData = JSON.parse(data);
        // Verificar si la losa especificada existe
        if (jsonData.losas[0][losa]) {
            // Obtener los datos de la losa
            const losaData = jsonData.losas[0][losa][0];

            // Actualizar solo los campos proporcionados
            if (estado !== undefined) losaData.estado = estado;
            if (ip !== undefined) losaData.ip = ip;
            if (MAC !== undefined) losaData.MAC = MAC;
            if (nombre_equipo !== undefined) losaData.nombre_equipo = nombre_equipo;

            // Escribir el archivo actualizado de vuelta al sistema de archivos
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    // Manejar el error si ocurre al escribir el archivo
                    return res.status(500).send('Error al actualizar el archivo');
                }
                // Enviar una respuesta de éxito
                res.send('Archivo actualizado exitosamente');
            });
        } else {
            // Enviar una respuesta de error si la losa no se encuentra
            res.status(404).send('Losa no encontrada');
        }
    });
});

app.get('/lista-areas-json', (req, res) => {
    const dataDir = path.join(process.cwd(), 'datos');
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error al leer la carpeta de datos');
        }

        const areas = files.map(file => {
            const filePath = path.join(dataDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return { fileName: file, area: data.area };
        });

        res.json(areas);
    });
});

app.get('/datos-archivo-json', (req, res) => {
    const { fileName } = req.query; // Obtener el nombre del archivo desde los parámetros de la URL
    console.log(fileName);
    const filePath = path.join(process.cwd(), 'datos', `${fileName}`);
    console.log(filePath)

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('Archivo no encontrado');
            }
            return res.status(500).send(`Error al leer el archivo: ${err.message}`);
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            res.status(500).send(`Error al parsear el archivo JSON: ${parseError.message}`);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
