const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactsController = require('./controllers/contactsController');

const app = express();
const PORT = process.env.PORT || 3000;

const ExcelJS = require('exceljs');
const JSZip   = require('jszip');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = require('./db');

const sitesPorPais = {
  Colombia: ['BTS3','Andes1','HA Barranquilla','Torre E','Andalucia'],
  Perú:      ['HA Trujillo','LOS INKAS','HA Lima','HA San Isidro','EDIFICIO GRIMALDO-MIRAFLORES'],
  México:    ['HA AGU','Pino Suarez','Cuauhtemoc','H1 MXC','Talavera'],
  // Añade el resto según tu lista…
};


// API endpoints
app.post('/api/contacts', contactsController.createContact);
app.get('/api/contacts/:area/:site', contactsController.getContacts);
app.put('/api/contacts/:id', contactsController.updateContact);
app.delete('/api/contacts/:id', contactsController.deleteContact);

app.get('/api/plantillas-disponibilidad.zip', async (req, res) => {
  try {
    const zip = new JSZip();

    for (const [pais, sites] of Object.entries(sitesPorPais)) {
      const folder = zip.folder(pais);

      for (const site of sites) {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Disponibilidad');

        // Definir columnas
        ws.columns = [
          { header: 'Nombre completo', key: 'nombre', width: 30 },
          { header: 'Fecha',           key: 'fecha',  width: 15 },
          { header: 'Subsidiaria',     key: 'sub',    width: 12 },
          { header: 'Área',            key: 'area',   width: 15 },
          { header: 'Site',            key: 'site',   width: 25 },
        ];

        // Dos filas vacías con Subsidiaria prellenada
        ws.addRow({ sub: 'MAR', site });
        ws.addRow({ sub: 'MAR', site });

        const buf = await wb.xlsx.writeBuffer();
        folder.file(`Disponibilidad_${site}.xlsx`, buf);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res
      .status(200)
      .set({
        'Content-Type':        'application/zip',
        'Content-Disposition': 'attachment; filename=Disponibilidad_Sites_Organizados.zip'
      })
      .send(zipBuffer);

  } catch (error) {
    console.error('Error generando plantillas:', error);
    res.status(500).send('Fallo al crear plantillas');
  }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/disponibilidades/cargarExcel', (req, res) => {
  const { datos } = req.body; // [{ nombre, fecha }]
  if (!Array.isArray(datos)) return res.status(400).send('Formato incorrecto');

  const nombres = [...new Set(datos.map(d => d.nombre.trim()))];

  // Buscar los analistas por nombre
  const placeholders = nombres.map(() => '?').join(',');
  db.query(`SELECT id, nombre FROM Analista WHERE nombre IN (${placeholders})`, nombres, (err, analistas) => {
    if (err) return res.status(500).send('Error al consultar analistas');

    // Mapear nombre → ID
    const mapa = {};
    analistas.forEach(a => mapa[a.nombre.trim()] = a.id);

    // Preparar valores válidos
    const values = datos
      .map(d => {
        const id = mapa[d.nombre.trim()];
        return id ? [id, d.fecha.trim(), 1] : null;
      })
      .filter(Boolean);

    if (values.length === 0) return res.status(400).send('No se encontraron coincidencias');

    // Eliminar registros futuros para esos analistas
    const idsUnicos = [...new Set(values.map(v => v[0]))];
    db.query(`DELETE FROM Disponibilidad WHERE analista_id IN (${idsUnicos.map(() => '?').join(',')}) AND fecha >= CURDATE()`, idsUnicos, (err) => {
      if (err) return res.status(500).send('Error al limpiar fechas anteriores');

      // Insertar nuevas disponibilidades
      db.query(`INSERT INTO Disponibilidad (analista_id, fecha, disponible) VALUES ? ON DUPLICATE KEY UPDATE disponible = 1`, [values], (err2, result) => {
        if (err2) return res.status(500).send('Error al insertar nuevas fechas');
        res.json({ actualizados: result.affectedRows });
      });
    });
  });
});

