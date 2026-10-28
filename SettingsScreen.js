import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function SettingsScreen({ navigation }) {
  const { currentUser, logout } = useFinance();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleResetData = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm
          ? window.confirm('This will restore all default transactions and categories to their initial state. Continue?')
          : true;
      if (confirmed && typeof window !== 'undefined' && window.alert) {
        window.alert('Sample data restored successfully.');
      }
    } else {
      Alert.alert(
        'Reset Sample Data',
        'This will restore all default transactions and categories to their initial state.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Data Reset', 'Sample data restored successfully.');
            },
          },
        ]
      );
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm
          ? window.confirm('Do you wish to log out from Finance Budget Tracker?')
          : true;
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Do you wish to log out from Finance Budget Tracker?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Settings & Preferences"
        subtitle="Application controls & security"
        navigation={navigation}
        showDrawer={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Role & Session Information */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionLeft}>
            <View style={styles.sessionAvatar}>
              <Feather
                name={currentUser?.role === 'Admin' ? 'shield' : 'user'}
                size={22}
                color={colors.primaryNavy}
              />
            </View>
            <View>
              <Text style={styles.sessionName}>
                {currentUser?.name || 'Active Session'}
              </Text>
              <Text style={styles.sessionRole}>
                Role: {currentUser?.role || 'Customer'}
              </Text>
            </View>
          </View>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>Active</Text>
          </View>
        </View>

        {/* Notifications & Alerts */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>Push Notifications</Text>
              <Text style={styles.switchSubtitle}>Daily spending reminders & balance digests</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: colors.borderSubtle, true: colors.primaryLavender }}
              thumbColor={pushNotifs ? colors.primaryNavy : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>Budget Threshold Alerts</Text>
              <Text style={styles.switchSubtitle}>Alert when category spending exceeds 85%</Text>
            </View>
            <Switch
              value={budgetAlerts}
              onValueChange={setBudgetAlerts}
              trackColor={{ false: colors.borderSubtle, true: colors.primaryLavender }}
              thumbColor={budgetAlerts ? colors.primaryNavy : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Security & Authentication */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>Biometric Authentication</Text>
              <Text style={styles.switchSubtitle}>Unlock using Face ID / Fingerprint</Text>
            </View>
            <Switch
              value={biometricAuth}
              onValueChange={setBiometricAuth}
              trackColor={{ false: colors.borderSubtle, true: colors.primaryLavender }}
              thumbColor={biometricAuth ? colors.primaryNavy : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Demo Tools */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Demo Tools</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Feather name="refresh-cw" size={18} color={colors.primaryNavy} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.actionTitle}>Reset Demo Data</Text>
                <Text style={styles.actionSub}>Restore sample transactions and categories</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About App */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutAppName}>Finance Budget Tracker</Text>
          <Text style={styles.aboutTagline}>"Make Every Rupee Count."</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0 (Expo SDK 58)</Text>
          <Text style={styles.aboutCredit}>Engineered with React Native, Soft Lavender & Midnight Navy Theme</Text>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="medium"
          icon="log-out-outline"
          textStyle={{ color: colors.expenseRed }}
          style={{ borderColor: colors.expenseRedLight, marginTop: spacing.md }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sessionName: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sessionRole: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sessionBadge: {
    backgroundColor: 'rgba(185, 243, 208, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
  },
  sessionBadgeText: {
    ...typography.badge,
    fontSize: 10,
    fontWeight: '700',
    color: colors.mintGreenDark,
  },
  sectionHeaderRow: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchTextWrap: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchTitle: {
    ...typography.subtitle,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  switchSubtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    ...typography.subtitle,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  aboutAppName: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  aboutTagline: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  aboutVersion: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  aboutCredit: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
