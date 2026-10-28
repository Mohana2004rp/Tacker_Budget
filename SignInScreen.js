import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function SignInScreen({ navigation, route }) {
  const initialRole = route.params?.initialRole || 'Customer';
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useFinance();

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password, role);
      setLoading(false);
      // RootNavigator handles switching to Customer or Admin flow based on currentUser
    }, 400);
  };

  const fillDemoAdmin = () => {
    setRole('Admin');
    setEmail('admin@financeapp.com');
    setPassword('Admin123');
  };

  const fillDemoCustomer = () => {
    setRole('Customer');
    setEmail('mohana@financeapp.com');
    setPassword('User123');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Back Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign In</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.introBlock}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Access your personal finance dashboards, charts, and budget analytics.
            </Text>
          </View>

          {/* Role Selector Tabs */}
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'Customer' && styles.roleTabActive]}
              onPress={() => setRole('Customer')}
              activeOpacity={0.8}
            >
              <Feather
                name="user"
                size={16}
                color={role === 'Customer' ? colors.primaryNavy : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  role === 'Customer' && styles.roleTabTextActive,
                ]}
              >
                Customer Role
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'Admin' && styles.roleTabActive]}
              onPress={() => setRole('Admin')}
              activeOpacity={0.8}
            >
              <Feather
                name="shield"
                size={16}
                color={role === 'Admin' ? colors.primaryNavy : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  role === 'Admin' && styles.roleTabTextActive,
                ]}
              >
                Admin Role
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials Quick Fill Badges */}
          <View style={styles.demoBox}>
            <Text style={styles.demoBoxTitle}>DEMO CREDENTIALS QUICK FILL</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[styles.demoPill, role === 'Customer' && styles.demoPillHighlighted]}
                onPress={fillDemoCustomer}
                activeOpacity={0.7}
              >
                <Feather name="user-check" size={13} color={colors.primaryNavy} style={{ marginRight: 4 }} />
                <Text style={styles.demoPillText}>Mohana (Customer)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoPill, role === 'Admin' && styles.demoPillHighlighted]}
                onPress={fillDemoAdmin}
                activeOpacity={0.7}
              >
                <Feather name="shield" size={13} color={colors.primaryNavy} style={{ marginRight: 4 }} />
                <Text style={styles.demoPillText}>Demo Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. customer@financeapp.com"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secureTextEntry={true}
            />

            <CustomButton
              title={`Sign In as ${role}`}
              onPress={handleSignIn}
              variant="primary"
              size="large"
              loading={loading}
              style={{ marginTop: spacing.sm }}
            />
          </View>

          {/* Sign Up Redirect */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account yet? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp', { initialRole: role })}
            >
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.shadowSubtle,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  introBlock: {
    marginVertical: spacing.md,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.radiusLg,
    padding: 4,
    marginBottom: spacing.md,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: spacing.radiusMd,
  },
  roleTabActive: {
    backgroundColor: colors.cardWhite,
    ...spacing.shadowSubtle,
  },
  roleTabText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    fontSize: 13,
  },
  roleTabTextActive: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  demoBox: {
    backgroundColor: colors.lavenderLight,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(185, 167, 255, 0.4)',
  },
  demoBoxTitle: {
    ...typography.badge,
    fontSize: 10,
    color: colors.primaryNavy,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: spacing.radiusPill,
    ...spacing.shadowSubtle,
  },
  demoPillHighlighted: {
    borderWidth: 1.5,
    borderColor: colors.primaryLavender,
  },
  demoPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  formCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    ...spacing.shadowCard,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.body,
    color: colors.primaryNavy,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
