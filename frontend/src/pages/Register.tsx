import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSucces] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password });
            setSucces('Se ha registrado correctamente');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Error al registrarse')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
            <h2>Crear Cuenta</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
    )
}

export default Register;