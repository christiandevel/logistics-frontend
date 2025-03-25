import React from 'react';

/**
 * Login image component used to show the login image
 * @returns Login image component
 */
const LoginImage: React.FC = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat h-screen relative"
         style={{
           backgroundImage: 'url("https://coordinadora.com/wp-content/uploads/2023/12/servicio-fulfilment.webp")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
         }}>
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Contenido */}
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Logistics App</h1>
          <p className="text-xl drop-shadow-lg">Gestiona tus envíos de manera eficiente</p>
        </div>
      </div>
    </div>
  );
};

export default LoginImage; 