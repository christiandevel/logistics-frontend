import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { forgotPassword, resetForgotPasswordState } from '../store/authSlice';
import { RootState, AppDispatch } from '../../../app/store';

const ForgotPasswordForm: React.FC = () => {
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
      // Error handling is done by the reducer
    }
  };

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

      {forgotPasswordState.error && (
        <div className="text-red-500 text-sm text-center">{forgotPasswordState.error}</div>
      )}

      <div>
        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={forgotPasswordState.isLoading}
        >
          {forgotPasswordState.isLoading ? 'Enviando...' : 'Enviar instrucciones'}
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