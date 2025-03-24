import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí manejaremos el login más adelante
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="w-full lg:w-1/2 h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8 text-primary-500">
          <h2 className="text-3xl font-bold ">Bienvenido</h2>
          <p className="mt-2 text-gray-600">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-primary mt-1"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-primary mt-1"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Crear cuenta
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 