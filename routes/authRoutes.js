const express = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config(); // Charge les variables d'environnement

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Inscription (Register)
router.post(
  "/register",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password that is greater than 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send("Email already in use");

      // Hash le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créez un nouvel utilisateur
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      res.status(201).send("User created");
    } catch (error) {
      console.error("Error creating user:", error); // Affiche l'erreur dans la console
      res.status(500).send(`Error creating user: ${error.message}`);
    }
  }
);

// Connexion (Login)
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password that is greater than 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      // Trouvez l'utilisateur par email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send("Invalid credentials");

      // Comparez le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send("Invalid credentials");

      // Créez un token JWT
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });

      res.json({ token });
    } catch (error) {
      res.status(500).send("Error logging in");
    }
  }
);

// Récupérer tous les utilisateurs (protégé par JWT)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
});

module.exports = router;
