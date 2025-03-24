import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import orderReducer from '../features/orders/slices/orderSlice';
import userReducer from '../features/users/slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desactivamos la verificación de serialización para fechas
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 