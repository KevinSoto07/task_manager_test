import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import type { JSX } from "react";




//Ruta protegida: redirige al login si no hay token
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/Login"/>;  
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to= "/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;