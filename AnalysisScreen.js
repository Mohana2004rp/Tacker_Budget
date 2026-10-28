import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import { IncomeExpenseLineChart, SpendingDonutChart } from '../components/ReportChart';
import { useFinance } from '../context/FinanceContext';

export default function AnalysisScreen({ navigation }) {
  const { categoryStats, totals, currentUser } = useFinance();
  const [activePeriod, setActivePeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  const isAdmin = currentUser?.role === 'Admin';

  const donutData = categoryStats
    .filter((c) => c.type === 'expense')
    .map((c) => ({
      name: c.name,
      amount: c.monthAmount || c.totalAmount || 500,
      color: c.color || colors.categoryIconColors[c.colorKey] || '#6C63FF',
    }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title={isAdmin ? 'Admin Financial Analytics' : 'Spending & Growth Analysis'}
        subtitle={isAdmin ? 'Platform Cashflow Intelligence' : 'Personal Financial Health'}
        navigation={navigation}
        showDrawer={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector Bar */}
        <View style={styles.periodCard}>
          <Text style={styles.periodHeaderLabel}>REPORTING HORIZON</Text>
          <View style={styles.periodButtonRow}>
            {['daily', 'weekly', 'monthly'].map((p) => {
              const active = activePeriod === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, active && styles.periodBtnActive]}
                  onPress={() => setActivePeriod(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)} Analytics
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Analytics High Level Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.miniMetricCard}>
            <Text style={styles.miniMetricLabel}>Net Savings Rate</Text>
            <Text style={[styles.miniMetricVal, { color: colors.mintGreenDark }]}>
              {totals.savingsRate}%
            </Text>
            <Text style={styles.miniMetricSub}>Target: {'>'}25%</Text>
          </View>

          <View style={styles.miniMetricCard}>
            <Text style={styles.miniMetricLabel}>Burn Rate (Daily)</Text>
            <Text style={[styles.miniMetricVal, { color: colors.expenseRed }]}>
              ₹{Math.round((totals?.expense ?? 0) / 30).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.miniMetricSub}>Avg. per day</Text>
          </View>
        </View>

        {/* Income vs Expense Line Chart */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Income vs Expense Curves</Text>
          <Text style={styles.badgeText}>6-Month Projection</Text>
        </View>
        <IncomeExpenseLineChart />

        {/* Donut Chart Breakdown */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Category Allocation</Text>
          <Text style={styles.badgeText}>Expense Distribution</Text>
        </View>
        <SpendingDonutChart data={donutData} totalSpent={totals?.expense ?? 0} />

        {/* Category Performance Breakdown List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Category Budget Health</Text>
        </View>

        <View style={styles.categoryHealthCard}>
          {categoryStats
            .filter((c) => c.type === 'expense')
            .map((cat, idx) => (
              <View key={`cat-h-${idx}`} style={styles.catHealthRow}>
                <View style={[styles.catIconWrap, { backgroundColor: cat.bgColor }]}>
                  <MaterialCommunityIcons name={cat.icon} size={20} color={cat.color} />
                </View>

                <View style={styles.catDetailsWrap}>
                  <View style={styles.catNameRow}>
                    <Text style={styles.catNameText}>{cat.name}</Text>
                    <Text style={styles.catAmountText}>
                      ₹{((cat?.monthAmount || cat?.totalAmount || 0)).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(100, cat.budgetProgress || 0)}%`,
                          backgroundColor:
                            (cat.budgetProgress || 0) > 90
                              ? colors.expenseRed
                              : (cat.budgetProgress || 0) > 70
                              ? colors.warmCreamDark
                              : colors.primaryLavender,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.budgetFooterRow}>
                    <Text style={styles.budgetFooterText}>
                      Budget: ₹{(cat?.budget ?? 0).toLocaleString('en-IN')}
                    </Text>
                    <Text
                      style={[
                        styles.budgetFooterText,
                        cat.budgetProgress > 85 ? { color: colors.expenseRed } : {},
                      ]}
                    >
                      {cat.budgetProgress}% used
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
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
  periodCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...spacing.shadowSubtle,
  },
  periodHeaderLabel: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  periodButtonRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.radiusLg,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: colors.primaryNavy,
  },
  periodBtnText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  miniMetricCard: {
    width: '48%',
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    ...spacing.shadowSubtle,
  },
  miniMetricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  miniMetricVal: {
    ...typography.h2,
    fontWeight: '800',
    marginVertical: 4,
  },
  miniMetricSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
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
  badgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryHealthCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  catHealthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  catDetailsWrap: {
    flex: 1,
  },
  catNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catNameText: {
    ...typography.subtitle,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catAmountText: {
    ...typography.subtitle,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginVertical: 3,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  budgetFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetFooterText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});
