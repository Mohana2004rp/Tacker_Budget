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
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import { IncomeExpenseLineChart, SpendingDonutChart } from '../components/ReportChart';
import TransactionItem from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';

export default function AdminDashboardScreen({ navigation }) {
  const { adminMetrics, categoryStats, deleteTransaction, logout } = useFinance();
  const [reportFilter, setReportFilter] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm
          ? window.confirm('Are you sure you want to sign out as Admin?')
          : true;
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to log out as Admin?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ]);
    }
  };

  // Admin sample platform charts
  const adminDonutData = categoryStats
    .filter((c) => c.type === 'expense')
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      amount: c.totalAmount * 12,
      color: c.color || colors.categoryIconColors[c.colorKey] || '#6C63FF',
    }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Admin Control Center"
        subtitle="Platform Oversight & Metrics"
        navigation={navigation}
        showDrawer={true}
        rightAction={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.adminBadge}>
              <Feather name="shield" size={14} color={colors.primaryNavy} />
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
            <TouchableOpacity
              style={styles.adminLogoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}
              accessibilityLabel="Sign out"
            >
              <Feather name="log-out" size={16} color={colors.expenseRed} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sample Data Disclaimer Banner */}
        <View style={styles.disclaimerBanner}>
          <Feather name="info" size={16} color={colors.primaryNavy} style={{ marginRight: 8 }} />
          <Text style={styles.disclaimerText}>
            Showing mock aggregated sample platform statistics for demonstration purposes.
          </Text>
        </View>

        {/* Top KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          {/* Total Registered Users */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: colors.lavenderLight }]}>
              <Feather name="users" size={20} color={colors.primaryNavy} />
            </View>
            <Text style={styles.kpiValue}>
              {(adminMetrics?.totalUsers ?? 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.kpiLabel}>Total Demo Users</Text>
            <View style={styles.kpiGrowthTag}>
              <Feather name="trending-up" size={12} color={colors.mintGreenDark} />
              <Text style={styles.kpiGrowthText}>+12% this month</Text>
            </View>
          </View>

          {/* Active Users Today */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: 'rgba(185, 243, 208, 0.4)' }]}>
              <Feather name="activity" size={20} color={colors.mintGreenDark} />
            </View>
            <Text style={styles.kpiValue}>
              {(adminMetrics?.activeToday ?? 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.kpiLabel}>Active Today</Text>
            <View style={styles.kpiGrowthTag}>
              <Text style={[styles.kpiGrowthText, { color: colors.textSecondary }]}>
                Real-time sessions
              </Text>
            </View>
          </View>

          {/* Platform Total Inflows */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: 'rgba(185, 243, 208, 0.4)' }]}>
              <Feather name="arrow-down-left" size={20} color={colors.mintGreenDark} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.mintGreenDark }]}>
              ₹{(((adminMetrics?.totalInflows ?? 0) / 100000)).toFixed(1)}L
            </Text>
            <Text style={styles.kpiLabel}>Platform Inflows</Text>
            <Text style={styles.kpiSub}>₹{(adminMetrics?.totalInflows ?? 0).toLocaleString('en-IN')}</Text>
          </View>

          {/* Platform Total Outflows */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: colors.expenseRedLight }]}>
              <Feather name="arrow-up-right" size={20} color={colors.expenseRed} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.expenseRed }]}>
              ₹{(((adminMetrics?.totalOutflows ?? 0) / 100000)).toFixed(1)}L
            </Text>
            <Text style={styles.kpiLabel}>Platform Outflows</Text>
            <Text style={styles.kpiSub}>₹{(adminMetrics?.totalOutflows ?? 0).toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Overall Platform Financial Summary Card */}
        <View style={styles.platformSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL PLATFORM VOLUME</Text>
              <Text style={styles.summaryAmount}>
                ₹{(adminMetrics?.totalVolume ?? 0).toLocaleString('en-IN')}
              </Text>
            </View>
            {/* Period Filter Tabs */}
            <View style={styles.periodPillGroup}>
              {['daily', 'weekly', 'monthly'].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setReportFilter(p)}
                  style={[styles.periodPill, reportFilter === p && styles.periodPillActive]}
                >
                  <Text
                    style={[
                      styles.periodPillText,
                      reportFilter === p && styles.periodPillTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.netBalanceRow}>
            <Text style={styles.netBalanceLabel}>Net Platform Reserve:</Text>
            <Text style={styles.netBalanceVal}>
              ₹{(adminMetrics?.netPlatformBalance ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* System Inflow vs Outflow Chart */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Inflow vs Outflow Analytics</Text>
          <Text style={styles.subtextBadge}>Platform-wide</Text>
        </View>
        <IncomeExpenseLineChart
          incomeData={[180000, 220000, 260000, 290000, 310000, 350000]}
          expenseData={[110000, 135000, 145000, 160000, 180000, 195000]}
          labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']}
        />

        {/* Category-wise Spending Analysis */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Category-Wise Spend Breakdown</Text>
          <Text style={styles.subtextBadge}>Aggregated</Text>
        </View>
        <SpendingDonutChart
          data={adminDonutData}
          totalSpent={adminMetrics?.totalOutflows ?? 0}
        />

        {/* Registered Users Quick Audit List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Registered Demo Accounts</Text>
          <Text style={styles.subtextBadge}>
            {(adminMetrics?.registeredDemoList || []).length} Accounts
          </Text>
        </View>

        <View style={styles.usersCard}>
          {(adminMetrics?.registeredDemoList || []).map((user, idx) => (
            <View key={`user-${idx}`} style={styles.userAuditRow}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {(user.name || 'User').charAt(0)}
                </Text>
              </View>
              <View style={styles.userInfoWrap}>
                <Text style={styles.userNameText}>{user.name || 'User'}</Text>
                <Text style={styles.userEmailText}>{user.email}</Text>
              </View>
              <View
                style={[
                  styles.userRoleTag,
                  user.role === 'Admin' ? styles.userRoleTagAdmin : styles.userRoleTagCustomer,
                ]}
              >
                <Text
                  style={[
                    styles.userRoleTagText,
                    user.role === 'Admin'
                      ? { color: colors.primaryNavy }
                      : { color: colors.mintGreenDark },
                  ]}
                >
                  {user.role}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Sample Activity */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Sample Activity</Text>
          <Text style={styles.subtextBadge}>Live Stream</Text>
        </View>

        {(adminMetrics?.recentActivity || []).map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            showActions={false}
          />
        ))}
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
    paddingBottom: spacing.xxxl,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: spacing.radiusPill,
    gap: 4,
  },
  adminBadgeText: {
    ...typography.badge,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.warmCreamDark,
    fontWeight: '600',
    flex: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...spacing.shadowSubtle,
  },
  kpiIconWrap: {
    width: 38,
    height: 38,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    ...typography.h3,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  kpiGrowthTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  kpiGrowthText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.mintGreenDark,
  },
  kpiSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  platformSummaryCard: {
    backgroundColor: colors.primaryNavy,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...spacing.shadowHeavy,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.lavenderLight,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  summaryAmount: {
    ...typography.amountLarge,
    color: '#FFFFFF',
    fontSize: 26,
    marginTop: 4,
  },
  periodPillGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: spacing.radiusPill,
    padding: 2,
  },
  periodPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
  },
  periodPillActive: {
    backgroundColor: colors.primaryLavender,
  },
  periodPillText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.lavenderLight,
  },
  periodPillTextActive: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  netBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  netBalanceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  netBalanceVal: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.mintGreen,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtextBadge: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  usersCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  userAuditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userAvatarText: {
    ...typography.subtitle,
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  userInfoWrap: {
    flex: 1,
  },
  userNameText: {
    ...typography.subtitle,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  userEmailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  userRoleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.radiusPill,
  },
  userRoleTagAdmin: {
    backgroundColor: colors.lavenderLight,
  },
  userRoleTagCustomer: {
    backgroundColor: 'rgba(185, 243, 208, 0.4)',
  },
  userRoleTagText: {
    ...typography.badge,
    fontSize: 10,
    fontWeight: '700',
  },
  adminLogoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
