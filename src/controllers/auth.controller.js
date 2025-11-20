import { dbConnection } from "../database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = (req, res) => {
  const { username, password } = req.body;
  if (username && password && username !== "" && password !== "") {
    dbConnection.query(
      "SELECT * FROM users WHERE username=?",
      [username],
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            bcrypt.compare(password, rows[0].password, (err, result) => {
              if (err) {
                return res.status(500).json({
                  message: "Error in server while comparing passwords",
                });
              }

              if (result) {
                const token = jwt.sign(
                  { id: rows[0].id, tipo: rows[0].tipo },
                  process.env.JWT_SECRET,
                  { expiresIn: 86400 }
                );
                return res.status(200).json({
                  message: "Logged",
                  token,
                  user: {
                    id: rows[0].id,
                    nombre: rows[0].nombre,
                    tipo: rows[0].tipo,
                  },
                }); 
              } else {
                return res.status(401).json({
                  message: "Incorrect password",
                });
              }
            });
          } else {
            return res.status(400).json({
              message: "Incorrect data or user does not exist. Please sign up.",
              token: null,
            });
          }
        } else {
          console.error(err);
          return res.status(500).json({
            message: "Server error",
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      message: "Missing username or password. Please provide them and try again.",
    });
  }
};




export const signup = (req, res) => {
  const { username, password, nombre, tipo } = req.body;

  if (username && password && nombre && tipo) {
    dbConnection.query(
      "SELECT * FROM users WHERE username=?",
      [username],
      (err, rows, fields) => {
        if (!err) {
          if (!rows.length > 0) {
            const passEncryptd = bcrypt.hashSync(password, 10);
            dbConnection.query(
              "INSERT INTO users (username, password, nombre, tipo) VALUES (?, ?, ?, ?)",
              [username, passEncryptd, nombre, tipo],
              (err) => {
                if (!err) {
                  return res.status(200).json({
                    message: "Signup successfully. Login now3...",
                  });
                } else {
                  console.error(err);
                  return res.status(400).json({
                    message: "Error at signup",
                    error: err,
                  });
                }
              }
            );
          } else {
            res.status(400).json({
              message: "User exists",
            });
          }
        } else {
          console.error(err);
          return res.status(500).json({
            message: "Error in the server",
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      message: "Missing values. Please complete all fields and try again.",
    });
  }
};

