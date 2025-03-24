import React from 'react';
import RegisterForm from '../components/RegisterForm';
import LoginImage from '../../../components/ui/LoginImage';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex">
      <LoginImage />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Crear cuenta</h2>
            <p className="mt-2 text-gray-600">
              Ingresa tus datos para crear una nueva cuenta
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register; 