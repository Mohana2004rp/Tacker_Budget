import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

export default function ProfileScreen({ navigation }) {
  const { userProfile, logout } = useFinance();
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm
          ? window.confirm(`Hey ${userProfile.name || 'User'}, are you sure you want to log out of your session?`)
          : true;
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        `Hey ${userProfile.name}, are you sure you want to log out of your session?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => logout(),
          },
        ]
      );
    }
  };

  const menuItems = [
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield-checkmark-outline',
      onPress: () => setSecurityModalVisible(true),
    },
    {
      id: 'setting',
      title: 'Setting',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Help',
      icon: 'help-buoy-outline',
      onPress: () => setHelpModalVisible(true),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'exit-outline',
      onPress: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00D09E" />

      {/* Top Green Curved Header */}
      <View style={styles.topGreenHeader}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else if (navigation.openDrawer) {
                navigation.openDrawer();
              } else {
                navigation.dispatch(DrawerActions.openDrawer());
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0E3E3E" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => Alert.alert('Notifications', `Hello ${userProfile.name}! No unread notifications.`)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#0E3E3E" />
          </TouchableOpacity>
        </View>

        {/* Circular Avatar placed in center */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {/* Styled Avatar Graphic */}
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={54} color="#00D09E" />
            </View>
          </View>
        </View>
      </View>

      {/* White / Soft Mint Card Content with Rounded Top */}
      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Name & ID from Figma */}
          <View style={styles.userInfoBlock}>
            <Text style={styles.userName}>{userProfile.name || 'Mohana'}</Text>
            <Text style={styles.userIdText}>ID: {userProfile.id || '25030024'}</Text>
          </View>

          {/* Menu Options matching Figma */}
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuRow}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                {/* Circular Royal Blue Icon Badge matching Figma */}
                <View style={[styles.menuIconBadge, item.isLogout && styles.logoutIconBadge]}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                {/* Menu Title */}
                <Text
                  style={[
                    styles.menuTitle,
                    item.isLogout && { color: '#093836' },
                  ]}
                >
                  {item.title}
                </Text>

                <Feather
                  name="chevron-right"
                  size={20}
                  color="#C8F2DE"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Account Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Target</Text>
              <Text style={styles.summaryValue}>₹{(userProfile?.monthlyBudget ?? 50000).toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Account</Text>
              <Text style={styles.summaryValue}>{userProfile.accountNumber}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Security Modal */}
      <Modal visible={securityModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="shield-checkmark" size={32} color="#00D09E" />
            </View>
            <Text style={styles.modalTitle}>Security & Privacy</Text>
            <Text style={styles.modalBody}>
              Biometric Authentication & PIN lock are enabled for customer {userProfile.name}. Your financial records are encrypted with 256-bit encryption.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSecurityModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal visible={helpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconWrap, { backgroundColor: '#EBF3FE' }]}>
              <Ionicons name="help-buoy" size={32} color="#3B9BF8" />
            </View>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <Text style={styles.modalBody}>
              Need assistance with your budget or transactions? Contact customer support anytime at support@financeapp.com or call 1800-FIN-BUDGET.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00C48C',
  },
  topGreenHeader: {
    backgroundColor: '#00C48C',
    height: 170,
    paddingHorizontal: 20,
    paddingTop: 8,
    position: 'relative',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#093836',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -46,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    padding: 3,
    shadowColor: '#093836',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 47,
    backgroundColor: '#E0F8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#F1FFF8',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 34,
    paddingTop: 52,
    shadowColor: '#093836',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  userInfoBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#093836',
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#093836',
  },
  menuList: {
    marginTop: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F8EC',
  },
  menuIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2F80ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutIconBadge: {
    backgroundColor: '#2F80ED',
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#093836',
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 26,
    borderWidth: 1,
    borderColor: '#E0EFE8',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#658A82',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E3E3E',
  },
  summaryDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0EFE8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    elevation: 8,
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D3F8EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0E3E3E',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 14,
    color: '#557B72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#00D09E',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 20,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
