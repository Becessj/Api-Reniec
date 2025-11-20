import { dbConnection } from "../database";
import axios from 'axios';

export const getDniSmart = async (req, res) => {
  const { numero: dni } = req.body;

  if (!dni || dni.length < 8) {
    return res.status(400).json({ error: "El DNI debe tener al menos 8 dígitos." });
  }

  // 1) Buscar primero en tu BD
  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc=?",
    [dni],
    async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (rows.length > 0) {
        // Ya existe en BD → devolverlo y no llamar a RENIEC
        return res.status(200).json(rows[0]);
      }

      // 2) Si no existe en BD → llamar a la API de RENIEC
      try {
        const response = await axios.get(
          `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RENIEC_API_TOKEN}`,
            },
          }
        );

        const reniecData = response.data;

        if (!reniecData) {
          return res.status(404).json({ error: "Datos no encontrados." });
        }

        // Guardar en BD (si no existe — tu función ya valida)
        createReniecSunat(req, reniecData);

        // Devolver datos de RENIEC
        return res.status(200).json(reniecData);
      } catch (error) {
        console.error("Error API RENIEC:", error);
        return res
          .status(500)
          .json({ error: "Error al procesar la solicitud a la API de RENIEC" });
      }
    }
  );
};


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
        Authorization: `Bearer ${process.env.RENIEC_API_TOKEN}`,
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

// Crear / actualizar un RUC en la base de datos
export const createRucSunat = (req, rucData) => {
  console.log("Datos RUC que se están insertando en la BD:", rucData);

  const {
    numero_documento: nro_doc,
    razon_social,
    estado,
    condicion,
    direccion,
    departamento,
    provincia,
    distrito,
  } = rucData;

  // Van opcionales desde el body, por si quieres distinguir tipo_doc, etc.
  const { tipo_doc, nro_doc_txt, fecharegistro } = req.body;

  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc = ?",
    [nro_doc],
    (err, rows) => {
      if (err) {
        console.error("Error al verificar si el RUC existe:", err);
        return;
      }

      if (rows.length > 0) {
        console.log("RUC ya existe en la base de datos.");
        return; // salir si ya existe
      }

      dbConnection.query(
        `INSERT INTO documento_identidad 
         (nro_doc, tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion, 
          direccion, departamento, provincia, distrito, fecharegistro)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          nro_doc,
          tipo_doc || "RUC",
          nro_doc_txt || "",
          "", // nombres (no aplica para RUC)
          "", // ap
          "", // am
          razon_social || "",
          estado || "",
          condicion || "",
          direccion || "",
          departamento || "",
          provincia || "",
          distrito || "",
          fecharegistro || new Date(),
        ],
        (insertErr) => {
          if (insertErr) {
            console.error("Error al guardar RUC en la BD:", insertErr);
          } else {
            console.log("RUC almacenado correctamente");
          }
        }
      );
    }
  );
};



export const getRucSmart = (req, res) => {
  const { numero: ruc } = req.body;

  if (!ruc || ruc.length !== 11) {
    return res
      .status(400)
      .json({ error: "El RUC debe tener exactamente 11 dígitos." });
  }

  // 1) Buscar primero en BD
  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc = ?",
    [ruc],
    async (err, rows) => {
      if (err) {
        console.error("Error BD en getRucSmart:", err);
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (rows.length > 0) {
        console.log("RUC obtenido desde BD");
        return res.status(200).json(rows[0]);
      }

      // 2) Si no está en BD → llamar a la API de Decolecta
      try {
        const response = await axios.get(
          `https://api.decolecta.com/v1/sunat/ruc?numero=${ruc}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.DECOLECTA_API_TOKEN}`,
            },
          }
        );

        const rucData = response.data;
        console.log("Datos de SUNAT (básico) desde API:", rucData);

        if (!rucData) {
          return res.status(404).json({ error: "Datos no encontrados." });
        }

        // Guardar en BD
        createRucSunat(req, rucData);

        // Devolver datos tal cual vienen de la API
        return res.status(200).json(rucData);
      } catch (error) {
        console.error(
          "Error al procesar la solicitud a la API de SUNAT (RUC):",
          error.response?.data || error.message
        );

        return res.status(error.response?.status || 500).json({
          error: "Error al procesar la solicitud a la API de SUNAT (RUC)",
          detail: error.response?.data || error.message,
        });
      }
    }
  );
};

export const getRucFullSmart = (req, res) => {
  const { numero: ruc } = req.body;

  if (!ruc || ruc.length !== 11) {
    return res
      .status(400)
      .json({ error: "El RUC debe tener exactamente 11 dígitos." });
  }

  // 1) Buscar primero en BD
  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc = ?",
    [ruc],
    async (err, rows) => {
      if (err) {
        console.error("Error BD en getRucFullSmart:", err);
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (rows.length > 0) {
        console.log("RUC FULL obtenido desde BD");
        return res.status(200).json(rows[0]);
      }

      // 2) Si no está en BD → llamar a la API de Decolecta (full)
      try {
        const response = await axios.get(
          `https://api.decolecta.com/v1/sunat/ruc/full?numero=${ruc}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer sk_11787.GcOGlULNYudTVOjeqmktrzAmVBYdr2WU", // o process.env.DECOLECTA_TOKEN
            },
          }
        );

        const rucData = response.data;
        console.log("Datos de SUNAT (full) desde API:", rucData);

        if (!rucData) {
          return res.status(404).json({ error: "Datos no encontrados." });
        }

        // Guardar en BD (mismos campos básicos)
        createRucSunat(req, rucData);

        // Devolver datos full
        return res.status(200).json(rucData);
      } catch (error) {
        console.error(
          "Error al procesar la solicitud a la API de SUNAT (RUC full):",
          error.response?.data || error.message
        );

        return res.status(error.response?.status || 500).json({
          error: "Error al procesar la solicitud a la API de SUNAT (RUC full)",
          detail: error.response?.data || error.message,
        });
      }
    }
  );
};
