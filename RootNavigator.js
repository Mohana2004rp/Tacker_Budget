import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFinance } from '../context/FinanceContext';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import AdminNavigator from './AdminNavigator';

export default function RootNavigator() {
  const { currentUser } = useFinance();

  return (
    <NavigationContainer>
      {!currentUser ? (
        <AuthNavigator />
      ) : currentUser.role === 'Admin' ? (
        <AdminNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
}
