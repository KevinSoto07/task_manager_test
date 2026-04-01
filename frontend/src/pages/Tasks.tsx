import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'en_progreso' | 'completado'
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    //Cargar tareas al entrar a la página
    useEffect(() =>{
        fetchTasks();
    }, [])

    const fetchTasks = async () =>{
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            setError('Error al cargar las tareas');
        }
    }
    
    //Crear nueva tarea
    const handleCreate = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            fetchTasks(); //Recarga la lista
        } catch (err) {
            setError('Error al crear la tarea');
        }
    }

    //Eliminar tarea
    const handleDelete = async (id:number) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError('Error al eliminar la tarea');
        }
    }

    //Actualizar estatus de la tarea
    const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
        try {
            await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: newStatus,
            });
            fetchTasks();
        } catch (err) {
            setError('Error al actualizar la tarea');
        }
    }

    //cerrar sesión
    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div style={{ maxWidth: 800, margin: '50px auto', padding: 20}}>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <h2>Mis Tareas</h2>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/*Formulario para crear tarea*/}
            <form onSubmit={handleCreate} style={{ marginBottom: 30 }}>
                <h3>Nueva Tarea</h3>
                <input
                type="text"
                placeholder="Titulo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ display: 'block', width: '100%', marginBottom: 10 }}
                />
                <input
                type="text"
                placeholder="Descripcion"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ display: 'block', width: '100%', marginBottom: 10}}
                />
                <button type="submit">Agregar Tarea</button>
            </form>

            {/* Lista de tareas */}
            {tasks.length === 0 ? (
                <p>Aún no se han agregado tareas</p>
            ) : (
                tasks.map((task) => (
                    <div
                    key={task.id}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 15,
                        marginBottom: 10,
                    }}
                    >
                        <h4 style={{ margin: 0 }}>{task.title}</h4>
                        <p style={{ margin: '5px 0'}}>{task.description}</p>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <select
                            value={task.status}
                            onChange={(e) =>
                                handleStatusChange(task, e.target.value as Task['status'])
                                }
                            >
                                <option value="pending">Pendiente</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="completed">Completada</option>
                            </select>
                            <button
                            onClick={() => handleDelete(task.id)}
                            style={{ color: 'red' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))
            )
            }
        </div>
    )
}

export default Tasks;