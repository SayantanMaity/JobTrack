require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const authenticateToken = require("./authMiddleware");

const app = express();

const PORT = 5000;

// ===============================
// JWT SECRET FROM .ENV
// ===============================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing in .env file.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.send("JobTrack Backend is running!");
});

// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend can connect to JobTrack Backend!",
  });
});

// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const checkSql = "SELECT id FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error("MySQL User Check Error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error.",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("MySQL Register Error:", err);

          return res.status(500).json({
            success: false,
            message: "Failed to create account.",
          });
        }

        res.status(201).json({
          success: true,
          message: "Account created successfully!",
          user: {
            id: result.insertId,
            name,
            email,
          },
        });
      });
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("MySQL Login Error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // ===============================
      // CREATE JWT TOKEN
      // ===============================

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      res.json({
        success: true,
        message: "Login successful!",

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Password Check Error:", error);

      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  });
});

// ===============================
// GET APPLICATIONS
// ===============================

app.get("/api/applications", authenticateToken, (req, res) => {
  // User ID comes from JWT
  const userId = req.user.id;

  const sql = `
      SELECT *
      FROM applications
      WHERE user_id = ?
      ORDER BY id DESC
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("MySQL Query Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications.",
      });
    }

    res.json(results);
  });
});

// ===============================
// ADD APPLICATION
// ===============================

app.post("/api/applications", authenticateToken, (req, res) => {
  const { company, position, date, status } = req.body;

  if (!company || !position || !date || !status) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // User ID comes from JWT
  const userId = req.user.id;

  const sql = `
      INSERT INTO applications
      (user_id, company, position, date_applied, status)
      VALUES (?, ?, ?, ?, ?)
    `;

  db.query(sql, [userId, company, position, date, status], (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to add application.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Application added successfully.",

      application: {
        id: result.insertId,
        user_id: userId,
        company,
        position,
        date_applied: date,
        status,
      },
    });
  });
});

// ===============================
// UPDATE APPLICATION
// ===============================

app.put("/api/applications/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const { company, position, date, status } = req.body;

  if (!company || !position || !date || !status) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // User ID comes from JWT
  const userId = req.user.id;

  const sql = `
      UPDATE applications
      SET
        company = ?,
        position = ?,
        date_applied = ?,
        status = ?
      WHERE id = ?
        AND user_id = ?
    `;

  db.query(
    sql,
    [company, position, date, status, id, userId],
    (err, result) => {
      if (err) {
        console.error("MySQL Update Error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to update application.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found or you do not have permission to update it.",
        });
      }

      res.json({
        success: true,
        message: "Application updated successfully.",
      });
    },
  );
});

// ===============================
// DELETE APPLICATION
// ===============================

app.delete("/api/applications/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // User ID comes from JWT
  const userId = req.user.id;

  const sql = `
      DELETE FROM applications
      WHERE id = ?
        AND user_id = ?
    `;

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error("MySQL Delete Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete application.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found or you do not have permission to delete it.",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
