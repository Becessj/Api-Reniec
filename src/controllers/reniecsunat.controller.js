import { dbConnection } from "../database";

export const getAllReniecSunat = (req, res) => {
  dbConnection.query("SELECT * FROM documento_identidad", (err, rows) => {
    if (!err) {
      return res.status(200).json({
        documentos: rows,
      });
    } else {
      console.error(err);
      return res.status(400).json({
        message: "Error at get reniec sunat",
        error: err,
      });
    }
  });
};

export const getReniecSunatById = (req, res) => {
  const { id } = req.body;

  dbConnection.query(
    "SELECT * FROM documento_identidad WHERE nro_doc=?",
    [id],
    (err, rows, fields) => {
      if (rows.length <= 0)
          return res.status(200).json({
          message: "Documento not found",
        });
      if (!err) {
        // console.log(rows[0]['nombres']);
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

export const createReniecSunat = (req, res) => {
  const {
    nro_doc,
    tipo_doc,
    nro_doc_txt,
    nombres,
    ap,
    am,
    razon_s,
    estado,
    condicion,
    direccion,
    departamento,
    provincia,
    distrito,
    fecharegistro,
  } = req.body;
  dbConnection.query(
    "INSERT INTO documento_identidad (nro_doc,tipo_doc, nro_doc_txt, nombres, ap, am, razon_s, estado, condicion,direccion,departamento,provincia,distrito,fecharegistro) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      nro_doc,
      tipo_doc,
      nro_doc_txt,
      nombres,
      ap,
      am,
      razon_s,
      estado,
      condicion,
      direccion,
      departamento,
      provincia,
      distrito,
      fecharegistro,
    ],
    (err, rows) => {
      if (!err) {
        return res.status(201).json({
          message: "Document saved"
        });
      } else {
        console.error(err);
        return (
          res.status(400),
          json({
            message: "Error at save document",
            error: err,
          })
        );
      }
    }
  );
};
