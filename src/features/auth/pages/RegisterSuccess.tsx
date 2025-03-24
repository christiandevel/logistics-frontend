import React from 'react';
import { Link } from 'react-router-dom';
import LoginImage from '../../../components/ui/LoginImage';

const RegisterSuccess: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">¡Registro exitoso!</h2>
            <p className="mt-2 text-gray-600">
              Hemos enviado un correo electrónico a tu dirección para confirmar tu cuenta.
              Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
      <LoginImage />
    </div>
  );
};

export default RegisterSuccess; 