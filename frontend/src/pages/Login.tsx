import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token); //Guarda el token
            navigate('/tasks');
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div style = {{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: 10}}
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: 10}}
                    />
                </div>
                <button type="submit">Ingresar</button>
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Registrate Aquí</Link></p>
        </div>
    )
}

export default Login;