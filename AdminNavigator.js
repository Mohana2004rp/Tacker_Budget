import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDrawerNavigator } from './DrawerNavigator';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AdminMain" component={AdminDrawerNavigator} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
    </Stack.Navigator>
  );
}
