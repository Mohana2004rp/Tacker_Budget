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

export default function SignUpScreen({ navigation, route }) {
  const initialRole = route.params?.initialRole || 'Customer';
  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useFinance();

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      const success = signup(fullName, email, password, confirmPassword, role);
      setLoading(false);
      // If success, currentUser is set in context, and RootNavigator will automatically transition!
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.introBlock}>
            <Text style={styles.welcomeTitle}>Join Finance Tracker</Text>
            <Text style={styles.welcomeSubtitle}>
              Take control of your cashflow with smart category budgets and reports.
            </Text>
          </View>

          {/* Role Selection */}
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
                Customer
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
                Administrator
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            <CustomInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Aditya Sharma"
              icon="person-outline"
              autoCapitalize="words"
            />

            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. aditya@example.com"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <CustomInput
              label="Password (min. 6 characters)"
              value={password}
              onChangeText={setPassword}
              placeholder="Create strong password"
              icon="lock-closed-outline"
              secureTextEntry={true}
            />

            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              icon="shield-checkmark-outline"
              secureTextEntry={true}
            />

            <CustomButton
              title={`Sign Up as ${role}`}
              onPress={handleSignUp}
              variant="primary"
              size="large"
              loading={loading}
              style={{ marginTop: spacing.sm }}
            />
          </View>

          {/* Sign In Redirect */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn', { initialRole: role })}>
              <Text style={styles.footerLink}>Sign In</Text>
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
    marginBottom: spacing.lg,
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
