import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar la lógica de recuperación de contraseña
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Revisa tu correo</h2>
        <p className="text-gray-600 mb-4">
          Si existe una cuenta asociada a este correo, recibirás instrucciones para restablecer tu contraseña.
        </p>
        <Link to="/login" className="text-primary-600 hover:text-primary-500">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
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
        <button type="submit" className="btn-primary w-full">
          Enviar instrucciones
        </button>
      </div>

      <div className="text-center">
        <Link to="/login" className="text-primary-600 hover:text-primary-500">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm; 