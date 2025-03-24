import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { showToast } from '../../../components/ui/Toast';
import { setInitialPassword } from '../store/authSlice';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetFirstPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, loginStatus, user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Solo redirigir si no estamos en el estado correcto para cambiar la contraseña
    // o si no tenemos el ID del usuario
    if (loginStatus !== 'REQUIRED_PASSWORD_CHANGE' || !user?.id) {
      navigate('/login');
      return;
    }
  }, [loginStatus, user, navigate]);

  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    let isValid = true;

    // Validar contraseña actual
    if (!formData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es requerida';
      isValid = false;
    }

    // Validar nueva contraseña
    if (!formData.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'La confirmación de contraseña es requerida';
      isValid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar el error cuando el usuario empieza a escribir
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showToast('No se pudo identificar el usuario. Por favor, inicia sesión nuevamente.', 'error');
      navigate('/login');
      return;
    }

    if (validateForm()) {
      try {
        const result = await dispatch(setInitialPassword({
          userId: user.id,
          ...formData
        })).unwrap();
        
        showToast('Contraseña actualizada exitosamente', 'success');
        navigate('/login');
      } catch (error: any) {
        showToast(error || 'Error al actualizar la contraseña', 'error');
      }
    } else {
      showToast('Por favor, corrige los errores en el formulario', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cambiar contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por favor, establece una nueva contraseña para tu cuenta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              />
              {formErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              />
              {formErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetFirstPassword; 