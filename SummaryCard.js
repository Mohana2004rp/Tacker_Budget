import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SummaryCard({
  balance = 0,
  income = 4000,
  expense = 100,
  savings = 3900,
  savingsRate = 60,
  period = 'monthly',
  onPeriodChange,
}) {
  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  const formatAmount = (val, isNegative = false) => {
    const num = Math.abs(val || 0);
    const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${isNegative ? '-' : ''}₹${formatted}`;
  };

  const revenuePeriodLabel =
    period === 'daily' ? 'Revenue Today' : period === 'weekly' ? 'Revenue Last Week' : 'Revenue This Month';
  const expensePeriodLabel =
    period === 'daily' ? 'Food Today' : period === 'weekly' ? 'Food Last Week' : 'Food This Month';

  return (
    <View style={styles.wrapper}>
      {/* Figma Signature Emerald Hero Goal Card */}
      <View style={styles.tealCard}>
        {/* Left Section: Savings on Goals */}
        <View style={styles.leftCol}>
          <View style={styles.carRingContainer}>
            <View style={styles.carIconBubble}>
              <Ionicons name="car-outline" size={26} color="#093836" />
            </View>
          </View>
          <Text style={styles.goalTitle}>Savings</Text>
          <Text style={styles.goalSubtitle}>On Goals</Text>
        </View>

        {/* Center Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Section: Revenue & Food stats */}
        <View style={styles.rightCol}>
          {/* Top Row: Revenue */}
          <View style={styles.statRow}>
            <View style={styles.statIconBadge}>
              <MaterialCommunityIcons name="cash-multiple" size={22} color="#093836" />
            </View>
            <View style={styles.statTextGroup}>
              <Text style={styles.statLabel}>{revenuePeriodLabel}</Text>
              <Text style={styles.statAmount}>{formatAmount(income)}</Text>
            </View>
          </View>

          {/* Horizontal Line */}
          <View style={styles.horizontalDivider} />

          {/* Bottom Row: Food / Expenses */}
          <View style={styles.statRow}>
            <View style={styles.statIconBadge}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#093836" />
            </View>
            <View style={styles.statTextGroup}>
              <Text style={styles.statLabel}>{expensePeriodLabel}</Text>
              <Text style={[styles.statAmount, styles.expenseAmount]}>
                {formatAmount(expense, true)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pill Filter Container [ Daily ] [ Weekly ] [ Monthly ] */}
      {onPeriodChange && (
        <View style={styles.pillContainer}>
          {periods.map((p) => {
            const active = period === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => onPeriodChange(p.key)}
                style={[styles.pillBtn, active && styles.pillBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillBtnText, active && styles.pillBtnTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tealCard: {
    backgroundColor: '#00D09E',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  leftCol: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carRingContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: '#00D09E',
    borderRightColor: '#2F80ED',
    borderBottomColor: '#2F80ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  carIconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#093836',
    textAlign: 'center',
  },
  goalSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#093836',
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1.5,
    height: '78%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 12,
  },
  rightCol: {
    flex: 1.9,
    justifyContent: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  statTextGroup: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#093836',
    fontWeight: '600',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#093836',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  expenseAmount: {
    color: '#2F80ED',
  },
  horizontalDivider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginVertical: 8,
    marginRight: 4,
  },
  // Clean Modern Pill Selector
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0F8EC',
    borderRadius: 22,
    padding: 4,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnActive: {
    backgroundColor: '#00D09E',
    shadowColor: '#00D09E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  pillBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#093836',
  },
  pillBtnTextActive: {
    color: '#093836',
    fontWeight: '800',
  },
});
