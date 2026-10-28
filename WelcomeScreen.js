import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Admin'

  const handleSignIn = () => {
    navigation.navigate('SignIn', { initialRole: selectedRole });
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp', { initialRole: selectedRole });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryNavy} />
      <View style={styles.container}>
        {/* Top Header / App Badge */}
        <View style={styles.topHeader}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="wallet-outline" size={32} color={colors.primaryLavender} />
          </View>
          <Text style={styles.appName}>FINANCE TRACKER</Text>
          <View style={styles.taglinePill}>
            <Text style={styles.tagline}>Make Every Rupee Count.</Text>
          </View>
        </View>

        {/* Finance Visual Illustration Card */}
        <View style={styles.illustrationCard}>
          <View style={styles.decorCircleLarge} />
          <View style={styles.decorCircleSmall} />

          {/* Floating Fintech Elements */}
          <View style={styles.visualCardInner}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardChip}>
                <Feather name="shield" size={14} color={colors.mintGreen} />
                <Text style={styles.chipText}>Smart Rupee Shield</Text>
              </View>
              <MaterialCommunityIcons name="contactless-payment" size={26} color="rgba(255,255,255,0.4)" />
            </View>

            <Text style={styles.visualCardLabel}>Monthly Savings Pool</Text>
            <Text style={styles.visualCardAmount}>₹53,350</Text>

            <View style={styles.visualMetricsRow}>
              <View style={styles.visualMetric}>
                <Text style={styles.visualMetricLabel}>Inflows</Text>
                <Text style={[styles.visualMetricVal, { color: colors.mintGreen }]}>+₹95,000</Text>
              </View>
              <View style={styles.visualMetricDivider} />
              <View style={styles.visualMetric}>
                <Text style={styles.visualMetricLabel}>Outflows</Text>
                <Text style={[styles.visualMetricVal, { color: colors.warmCream }]}>-₹41,650</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Role Selection Tabs */}
        <View style={styles.roleSelectionContainer}>
          <Text style={styles.roleHeaderTitle}>CONTINUE AS</Text>
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'Customer' && styles.roleTabActive,
              ]}
              onPress={() => setSelectedRole('Customer')}
              activeOpacity={0.8}
            >
              <Feather
                name="user"
                size={18}
                color={selectedRole === 'Customer' ? colors.primaryNavy : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Customer' && styles.roleTabTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                selectedRole === 'Admin' && styles.roleTabActive,
              ]}
              onPress={() => setSelectedRole('Admin')}
              activeOpacity={0.8}
            >
              <Feather
                name="shield"
                size={18}
                color={selectedRole === 'Admin' ? colors.primaryNavy : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleTabText,
                  selectedRole === 'Admin' && styles.roleTabTextActive,
                ]}
              >
                Administrator
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={`Sign In as ${selectedRole}`}
            onPress={handleSignIn}
            variant="primary"
            size="large"
            icon="log-in-outline"
            style={styles.signInButton}
          />

          <CustomButton
            title="Create New Account (Sign Up)"
            onPress={handleSignUp}
            variant="outline"
            size="medium"
            textStyle={{ color: colors.lavenderLight }}
            style={styles.signUpButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryNavy,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  topHeader: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: spacing.radiusLg,
    backgroundColor: 'rgba(185, 167, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(185, 167, 255, 0.3)',
  },
  appName: {
    ...typography.h2,
    color: '#FFFFFF',
    letterSpacing: 2,
    fontWeight: '800',
  },
  taglinePill: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
    backgroundColor: 'rgba(185, 243, 208, 0.15)',
  },
  tagline: {
    ...typography.subtitle,
    color: colors.mintGreen,
    fontWeight: '600',
    fontSize: 13,
  },
  illustrationCard: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.radiusXl,
    padding: spacing.xl,
    marginVertical: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(185, 167, 255, 0.12)',
  },
  decorCircleSmall: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(185, 243, 208, 0.08)',
  },
  visualCardInner: {
    zIndex: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(185, 243, 208, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
  },
  chipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.mintGreen,
    marginLeft: 4,
    fontWeight: '600',
  },
  visualCardLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  visualCardAmount: {
    ...typography.amountLarge,
    color: '#FFFFFF',
    fontSize: 32,
    marginVertical: 4,
  },
  visualMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  visualMetric: {
    flex: 1,
  },
  visualMetricLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  visualMetricVal: {
    ...typography.subtitle,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 2,
  },
  visualMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: spacing.md,
  },
  roleSelectionContainer: {
    marginBottom: spacing.md,
  },
  roleHeaderTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.radiusLg,
    padding: 4,
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
    backgroundColor: colors.primaryLavender,
  },
  roleTabText: {
    ...typography.subtitle,
    color: colors.textMuted,
    fontSize: 14,
  },
  roleTabTextActive: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
  },
  signInButton: {
    marginBottom: spacing.md,
  },
  signUpButton: {
    borderColor: 'rgba(185, 167, 255, 0.4)',
  },
});
