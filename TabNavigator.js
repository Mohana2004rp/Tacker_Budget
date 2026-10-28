import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import CustomerDashboardScreen from '../screens/CustomerDashboardScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Tab = createBottomTabNavigator();

const figmaTabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: false, // Figma bottom bar shows only elegant icons
  tabBarStyle: {
    backgroundColor: '#EAF8F2',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 84 : 70,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
};

export function CustomerTabNavigator() {
  return (
    <Tab.Navigator screenOptions={figmaTabScreenOptions}>
      {/* 1. Home Tab */}
      <Tab.Screen
        name="CustomerHomeTab"
        component={CustomerDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Feather
                name="home"
                size={22}
                color="#093836"
              />
            </View>
          ),
        }}
      />

      {/* 2. Analysis Tab */}
      <Tab.Screen
        name="CustomerAnalysisTab"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color="#093836"
              />
            </View>
          ),
        }}
      />

      {/* 3. Transactions Tab */}
      <Tab.Screen
        name="CustomerTransactionsTab"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={26}
                color="#093836"
              />
            </View>
          ),
        }}
      />

      {/* 4. Categories Tab */}
      <Tab.Screen
        name="CustomerCategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={24}
                color="#093836"
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile Tab */}
      <Tab.Screen
        name="CustomerProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#093836"
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AdminTabNavigator() {
  return (
    <Tab.Navigator screenOptions={figmaTabScreenOptions}>
      <Tab.Screen
        name="AdminHomeTab"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Feather name="home" size={22} color="#093836" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdminAnalysisTab"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <MaterialCommunityIcons name="chart-bar" size={24} color="#093836" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdminReportsTab"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Feather name="file-text" size={22} color="#093836" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#00D09E',
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
});
