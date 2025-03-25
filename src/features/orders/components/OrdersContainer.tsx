import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import UserOrders from './UserOrders';
import DriverOrders from './DriverOrders';

const OrdersContainer: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user?.role === 'driver' ? <DriverOrders /> : <UserOrders />;
};

export default OrdersContainer; 