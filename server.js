require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   CONFIG EMAIL
====================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ======================
   ROUTE CONTACT
====================== */

app.post("/contact", async (req, res) => {
  const { nom, email, message } = req.body;

  // validation simple
  if (!nom || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Email invalide",
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Message de ${nom}`,
      text: `
Nom: ${nom}
Email: ${email}

Message:
${message}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

/* ====================== */

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
