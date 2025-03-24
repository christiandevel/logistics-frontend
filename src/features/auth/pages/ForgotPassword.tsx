import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import LoginImage from '../../../components/ui/LoginImage';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex">
      <LoginImage />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recuperar contraseña</h2>
            <p className="mt-2 text-gray-600">
              Ingresa tu correo electrónico para recibir instrucciones
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 