import { dbConnection } from "../database";
import axios from 'axios';

// Obtener todos los documentos de la base de datos
export const getAllReniecSunat = (req, res) => {
  dbConnection.query("SELECT * FROM documento_identidad", (err, rows) => {
    if (!err) {
      return res.status(200).json({
        documentos: rows,
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error al obtener documentos de reniec sunat",
        error: err,
      });
    }
  });
};

export const getReniecSunatByIdApis = async (req, res) => {
  const { numero: dni } = req.body;

  // Validar que el DNI tenga al menos 8 dígitos
  if (!dni || dni.length < 8) {
    return res.status(400).json({ error: "El DNI debe tener al menos 8 dígitos." });
  }

  console.log('DNI recibido desde el cuerpo:', dni);

  try {
    // Hacer la solicitud a la API de RENIEC
    const response = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
      headers: {
        Authorization: "Bearer apis-token-9389.WDi7ib91foCGt-Pk7ST4SgD3LEalekx5",
      },
    });

    const reniecData = response.data;

    if (reniecData) {
      console.log('Datos de RENIEC:', reniecData); 

      // Insertar los datos en la base de datos sin retornar nada
      createReniecSunat(req, reniecData);

      // Retornar solo los datos al cliente
      return res.status(200).json(reniecData);
    } else {
      return res.status(404).json({ error: "Datos no encontrados." });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud a la API de RENIEC:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud a la API de RENIEC' });
  }
};
// Obtener un documento de la base de datos por ID
export const getReniecSunatById = (req, res) => {
  const { id } = req.body;

  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc=?",
    [id],
    (err, rows, fields) => {
      if (rows.length <= 0)
        return res.status(404).json({
          message: "Documento no encontrado",
        });

      if (!err) {
        return res.status(200).json(rows[0]);
      } else {
        console.error(err);
        return res.status(500).json({
          message: "Error en el servidor",
        });
      }
    }
  );
};

// Crear un nuevo documento en la base de datos sin retornar nada
export const createReniecSunat = (req, reniecData) => {
  console.log('Datos que se están insertando en la BD:', reniecData);

  const {
    numeroDocumento: nro_doc,
    nombres,
    apellidoPaterno: ap,
    apellidoMaterno: am,
    direccion,
    departamento,
    provincia,
    distrito,
  } = reniecData;

  const { tipo_doc, nro_doc_txt, razon_s, estado, condicion, fecharegistro } = req.body;

  // Verificar si el documento ya existe
  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc = ?",
    [nro_doc],
    (err, rows) => {
      if (err) {
        console.error('Error al verificar si el documento existe:', err);
        return;
      }

      if (rows.length > 0) {
        console.log('Documento ya existe en la base de datos.');
        return; // Salir si ya existe
      }

      // Si no existe, proceder a insertar
      dbConnection.query(
        "INSERT INTO documento_identidad (nro_doc, tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion, direccion, departamento, provincia, distrito, fecharegistro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          nro_doc,
          tipo_doc || '',
          nro_doc_txt || '',
          nombres,
          ap,
          am,
          razon_s || '',
          estado || '',
          condicion || '',
          direccion || '',
          departamento || '',
          provincia || '',
          distrito || '',
          fecharegistro || new Date(),
        ],
        (insertErr) => {
          if (insertErr) {
            console.error('Error al guardar en la BD:', insertErr);
          } else {
            console.log("Documento almacenado correctamente");
          }
        }
      );
    }
  );
};
