import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

import { CustomerTabNavigator, AdminTabNavigator } from './TabNavigator';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useFinance } from '../context/FinanceContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { userProfile, currentUser, logout } = useFinance();
  const isAdmin = currentUser?.role === 'Admin';

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm
          ? window.confirm('Are you sure you want to log out?')
          : true;
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cardWhite }}>
      {/* Drawer Header with User Profile */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {isAdmin
              ? 'AD'
              : userProfile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
          </Text>
        </View>

        <Text style={styles.drawerUserName}>
          {isAdmin ? 'System Administrator' : userProfile.name}
        </Text>
        <Text style={styles.drawerUserEmail}>
          {isAdmin ? 'admin@financeapp.com' : userProfile.email}
        </Text>

        <View
          style={[
            styles.roleBadge,
            isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeCustomer,
          ]}
        >
          <Feather
            name={isAdmin ? 'shield' : 'user'}
            size={11}
            color={isAdmin ? colors.primaryNavy : colors.mintGreenDark}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.roleBadgeText,
              isAdmin ? { color: colors.primaryNavy } : { color: colors.mintGreenDark },
            ]}
          >
            {isAdmin ? 'Admin Portal' : 'Customer Account'}
          </Text>
        </View>
      </View>

      {/* Nav Items List */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Bottom Logout Item */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={18} color={colors.expenseRed} style={{ marginRight: 12 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CustomerDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#D3F8EE',
        drawerActiveTintColor: '#00A87D',
        drawerInactiveTintColor: '#557B72',
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
          marginLeft: -8,
        },
        drawerItemStyle: {
          borderRadius: 16,
          marginHorizontal: 12,
          marginVertical: 3,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={CustomerTabNavigator}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color }) => <Feather name="home" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          drawerLabel: 'Analysis',
          drawerIcon: ({ color }) => <Feather name="pie-chart" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          drawerLabel: 'Transactions',
          drawerIcon: ({ color }) => <Feather name="list" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          drawerLabel: 'Categories',
          drawerIcon: ({ color }) => <Feather name="grid" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'My Profile',
          drawerIcon: ({ color }) => <Feather name="user" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          drawerLabel: 'Reports',
          drawerIcon: ({ color }) => <Feather name="file-text" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => <Feather name="settings" size={18} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.lavenderLight,
        drawerActiveTintColor: colors.primaryNavy,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          ...typography.subtitle,
          fontSize: 14,
          fontWeight: '600',
          marginLeft: -8,
        },
        drawerItemStyle: {
          borderRadius: spacing.radiusMd,
          marginHorizontal: spacing.md,
          marginVertical: 3,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={AdminTabNavigator}
        options={{
          drawerLabel: 'Admin Dashboard',
          drawerIcon: ({ color }) => <Feather name="home" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          drawerLabel: 'Platform Analytics',
          drawerIcon: ({ color }) => <Feather name="pie-chart" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          drawerLabel: 'Audit Reports',
          drawerIcon: ({ color }) => <Feather name="file-text" size={18} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Admin Settings',
          drawerIcon: ({ color }) => <Feather name="settings" size={18} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: '#00D09E',
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 22,
    color: '#00A87D',
    fontWeight: '800',
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E3E3E',
  },
  drawerUserEmail: {
    fontSize: 12,
    color: 'rgba(14, 62, 62, 0.75)',
    fontWeight: '600',
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.radiusPill,
    marginTop: 8,
  },
  roleBadgeCustomer: {
    backgroundColor: 'rgba(185, 243, 208, 0.3)',
  },
  roleBadgeAdmin: {
    backgroundColor: colors.primaryLavender,
  },
  roleBadgeText: {
    ...typography.badge,
    fontSize: 10,
    fontWeight: '700',
  },
  drawerFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    ...typography.subtitle,
    fontWeight: '600',
    color: colors.expenseRed,
  },
});
