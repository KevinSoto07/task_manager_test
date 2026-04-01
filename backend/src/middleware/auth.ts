import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

//Extendemos el request para agregarle al usuario autenticado

export interface authRequest extends Request {
    user?: { id:number; email: string };
}

//Un middleware es una función que se ejecuta entre que llega la peticion y que llega al endpoint. Si el token es valido deja pasar, si no, rechaza la petición ahí mismo

const authMiddleware = (req:authRequest, res: Response, next:NextFunction) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Formato: "bearer TOKEN"

    if(!token){
        return res.status(401).json({ error: 'Acceso denegado, se requiere el token'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email:string }
        req.user = decoded; // Guardamos el usuario en el request
        next(); //Continuamos con el endpoint
    } catch (error) {
        res.status(401).json({ error: 'Token invalido o expirado'})
    }
}

export default authMiddleware;