import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, resetForgotPasswordState } from '../store/authSlice';
import { RootState, AppDispatch } from '../../../app/store';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { forgotPassword: forgotPasswordState } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (forgotPasswordState.isSuccess) {
      if (forgotPasswordState.userExists) {
        toast.success('Se ha enviado un correo con las instrucciones para recuperar tu contraseña', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('No existe una cuenta asociada a este correo electrónico', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [forgotPasswordState.isSuccess, forgotPasswordState.userExists, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {forgotPasswordState.error && (
            <div className="text-red-500 text-sm text-center">{forgotPasswordState.error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={forgotPasswordState.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {forgotPasswordState.isLoading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 