import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthGateProvider } from './app/router/AuthGate';
import { router } from './app/router/routes';

function App() {
  return (
    <AuthGateProvider>
      <RouterProvider router={router} />
    </AuthGateProvider>
  );
}

export default App;