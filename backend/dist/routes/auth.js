"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
// POST /auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //Verificar si el email existe
        const [existing] = await db_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        //Encriptar la contraseña
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        //Guardar el usuario
        await db_1.default.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});
//POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        //Buscar al usuario por email
        const [rows] = await db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        const user = rows[0];
        //Verificar la contraseña
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }
        //Generar token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login exitoso', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
//token que acabo de generar:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0aWxpbjc3N0BnbWFpbC5jb20iLCJpYXQiOjE3NzQ5MzEyMzYsImV4cCI6MTc3NTAxNzYzNn0.5l3QQ9GfRFErT10c4pCBOlSFn5Dt5fl0DBNq2lnprW4
exports.default = router;
