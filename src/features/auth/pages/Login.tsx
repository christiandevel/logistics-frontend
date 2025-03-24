import React from 'react';
import LoginImage from '../../../components/ui/LoginImage';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex h-screen">
      <LoginImage />
      <LoginForm />
    </div>
  );
};

export default Login; 