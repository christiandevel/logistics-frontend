import React from 'react';

const LoginImage: React.FC = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat h-screen"
         style={{
           backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
         }}>
      <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Logistics App</h1>
          <p className="text-xl">Gestiona tus envíos de manera eficiente</p>
        </div>
      </div>
    </div>
  );
};

export default LoginImage; 