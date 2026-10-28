import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDrawerNavigator } from './DrawerNavigator';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CustomerMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CustomerMain" component={CustomerDrawerNavigator} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
