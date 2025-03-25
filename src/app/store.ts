import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import orderReducer from '../features/orders/slices/orderSlice';
import userReducer from '../features/users/slices/userSlice';

// Store - Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

// Root state
export type RootState = ReturnType<typeof store.getState>;

// App dispatch
export type AppDispatch = typeof store.dispatch; 