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
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import { useFinance } from '../context/FinanceContext';

export default function ReportsScreen({ navigation }) {
  const { totals, monthWiseTotals, selectedMonth, currentUser, categoryStats } = useFinance();
  const [reportType, setReportType] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  const handleExport = (format) => {
    Alert.alert(
      'Export Successful',
      `Your Financial Report for ${selectedMonth} has been compiled and saved as ${format}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Financial Statements & Reports"
        subtitle="Exportable summaries & audit trails"
        navigation={navigation}
        showDrawer={true}
        rightIcon="download-outline"
        onRightPress={() => handleExport('PDF')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Switcher */}
        <View style={styles.filterCard}>
          <Text style={styles.filterCardLabel}>SELECT REPORT TIMEFRAME</Text>
          <View style={styles.filterButtonsRow}>
            {['daily', 'weekly', 'monthly'].map((t) => {
              const active = reportType === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.filterBtn, active && styles.filterBtnActive]}
                  onPress={() => setReportType(t)}
                >
                  <Text style={[styles.filterBtnText, active && styles.filterBtnTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Statement
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Executive Summary Card */}
        <View style={styles.summaryStatementCard}>
          <View style={styles.statementHeader}>
            <View>
              <Text style={styles.statementTitle}>EXECUTIVE SUMMARY</Text>
              <Text style={styles.statementPeriod}>Accounting Period: {selectedMonth}</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Feather name="check-circle" size={12} color={colors.mintGreenDark} style={{ marginRight: 4 }} />
              <Text style={styles.verifiedText}>Audited</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Gross Inflows (Income)</Text>
            <Text style={[styles.tableVal, { color: colors.mintGreenDark }]}>
              +₹{(monthWiseTotals?.income ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Gross Outflows (Expenses)</Text>
            <Text style={[styles.tableVal, { color: colors.expenseRed }]}>
              -₹{(monthWiseTotals?.expense ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.tableRow}>
            <Text style={[styles.tableLabel, { fontWeight: '700', color: colors.textPrimary }]}>
              Net Surplus / Savings
            </Text>
            <Text style={[styles.tableVal, { fontWeight: '800', color: colors.primaryNavy, fontSize: 16 }]}>
              ₹{(monthWiseTotals?.netBalance ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Savings Efficiency Ratio</Text>
            <Text style={[styles.tableVal, { color: colors.primaryNavy }]}>
              {totals?.savingsRate ?? 60}%
            </Text>
          </View>
        </View>

        {/* Category Spending Breakdown Table */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Category-wise Statement</Text>
        </View>

        <View style={styles.categoryTableCard}>
          {categoryStats.map((cat, idx) => (
            <View key={`rep-cat-${idx}`} style={styles.catTableRow}>
              <View style={styles.catLeftCol}>
                <Text style={styles.catTableName}>{cat.name}</Text>
                <Text style={styles.catTableType}>
                  {cat.type === 'income' ? 'Income' : 'Expense'} • {cat.transactionCount} transactions
                </Text>
              </View>

              <View style={styles.catRightCol}>
                <Text
                  style={[
                    styles.catTableAmount,
                    { color: cat.type === 'income' ? colors.mintGreenDark : colors.textPrimary },
                  ]}
                >
                  ₹{((cat?.monthAmount || cat?.totalAmount || 0)).toLocaleString('en-IN')}
                </Text>
                {cat.type === 'expense' && (
                  <Text style={styles.catTableShare}>{cat.percentageOfExpenses}% share</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Export Actions Card */}
        <View style={styles.exportCard}>
          <Text style={styles.exportCardTitle}>EXPORT REPORT</Text>
          <Text style={styles.exportCardSub}>
            Generate high-resolution statements for taxation, budget planning, or records.
          </Text>

          <View style={styles.exportButtonsRow}>
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={() => handleExport('PDF Format')}
              activeOpacity={0.8}
            >
              <Feather name="file-text" size={16} color={colors.primaryNavy} style={{ marginRight: 6 }} />
              <Text style={styles.exportBtnText}>Download PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportBtn}
              onPress={() => handleExport('Excel / CSV Format')}
              activeOpacity={0.8}
            >
              <Feather name="grid" size={16} color={colors.primaryNavy} style={{ marginRight: 6 }} />
              <Text style={styles.exportBtnText}>Export CSV</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  filterCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...spacing.shadowSubtle,
  },
  filterCardLabel: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.radiusLg,
    padding: 3,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primaryNavy,
  },
  filterBtnText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryStatementCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...spacing.shadowCard,
  },
  statementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  statementTitle: {
    ...typography.subtitle,
    fontWeight: '800',
    color: colors.primaryNavy,
  },
  statementPeriod: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(185, 243, 208, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: spacing.radiusPill,
  },
  verifiedText: {
    ...typography.badge,
    fontSize: 10,
    color: colors.mintGreenDark,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  tableLabel: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tableVal: {
    ...typography.subtitle,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.sm,
  },
  sectionHeaderRow: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  categoryTableCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...spacing.shadowSubtle,
  },
  catTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  catLeftCol: {
    flex: 1,
  },
  catTableName: {
    ...typography.subtitle,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catTableType: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  catRightCol: {
    alignItems: 'flex-end',
  },
  catTableAmount: {
    ...typography.subtitle,
    fontSize: 14,
    fontWeight: '700',
  },
  catTableShare: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  exportCard: {
    backgroundColor: colors.lavenderLight,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  exportCardTitle: {
    ...typography.badge,
    fontSize: 11,
    color: colors.primaryNavy,
    marginBottom: 4,
  },
  exportCardSub: {
    ...typography.caption,
    color: colors.primaryNavy,
    opacity: 0.8,
    marginBottom: spacing.md,
  },
  exportButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: spacing.radiusLg,
    ...spacing.shadowSubtle,
  },
  exportBtnText: {
    ...typography.subtitle,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
});
