import React from 'react';
import LoginImage from '../../../components/ui/LoginImage';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full">
      <LoginImage />
      <LoginForm />
    </div>
  );
};

export default Login; 