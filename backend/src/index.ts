import express, { Request, Response } from 'express';
import cors from 'cors';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

const app = express();
const port = 3000;

app.use(cors({ origin: 'https://task-manager-test-phi.vercel.app'}));
app.use(express.json()); //Para leer JSON en las peticiones

app.get('/', (req: Request, res: Response) => {
    res.json({message: 'Servidor Funcionando'})
})

app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`);  
})

app.use('/tasks', taskRoutes);

app.use('/auth', authRoutes)
