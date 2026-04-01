//Primer endpoint

import { Router, Request, Response } from 'express';
import pool from '../db';
import authMiddleware, { authRequest } from '../middleware/auth';

const router = Router();

//Protege todas las rutas de tasks con el middleware
router.use(authMiddleware);

//GET para todas las áreas
/*router.get('/', async (req: Request, res: Response) =>{
    try {
        const [rows] = await pool.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas'});
    }
})
*/

//GET actualizado con el middleware para que solo muestre las tareas del usuario ya logueado
router.get('/', async (req: authRequest, res: Response) =>{
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE user_id = ?',
            [req.user?.id] //Solo tareas del usuario autenticado
        )
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
})

//POST crear una tarea
router.post('/', async (req: authRequest, res: Response) => {
    const { title, description } = req.body;
    const user_id = req.user?.id;
    try {
        await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
            [title, description, user_id]
        );
        res.status(201).json({ message: 'Tarea creada' })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
})

//GET una sola tarea por id
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [rows]: any = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
})

//PUT editar una tarea
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
            [title, description, status, id]
        );
        if(result.affecterdRows === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
})

//DELETE eliminar una tarea
router.delete('/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const [result]: any = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        console.log('Result:', result);
        if (result.affecterdRows === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada'});
            }
            res.json({ message: 'Tarea eliminada correctamente' });
        } catch (error) {
            console.error(error);  
            res.status(500).json({ error: 'Error al actualizar la tarea' });
        }
 })        

export default router;