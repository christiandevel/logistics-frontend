import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { router } from './app/router';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
}

export default App;
