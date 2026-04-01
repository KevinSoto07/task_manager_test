"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
//Un middleware es una función que se ejecuta entre que llega la peticion y que llega al endpoint. Si el token es valido deja pasar, si no, rechaza la petición ahí mismo
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Formato: "bearer TOKEN"
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, se requiere el token' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // Guardamos el usuario en el request
        next(); //Continuamos con el endpoint
    }
    catch (error) {
        res.status(401).json({ error: 'Token invalido o expirado' });
    }
};
exports.default = authMiddleware;
