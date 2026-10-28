import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CategoryCard({ category, onPress }) {
  const {
    name,
    icon,
    color,
    bgColor,
    totalAmount,
    monthAmount,
    percentageOfExpenses,
    budgetProgress,
    budget,
    transactionCount,
    type,
  } = category;

  const isIncome = type === 'income';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(category)}
      activeOpacity={0.8}
    >
      {/* Top Header: Icon & Type Tag */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: bgColor || '#EFF6FF' }]}>
          <MaterialCommunityIcons name={icon} size={22} color={color || '#00C48C'} />
        </View>
        <View
          style={[
            styles.typePill,
            {
              backgroundColor: isIncome ? '#ECFDF5' : '#FFF1F2',
            },
          ]}
        >
          <Text
            style={[
              styles.typePillText,
              { color: isIncome ? '#059669' : '#F43F5E' },
            ]}
          >
            {isIncome ? 'Income' : 'Expense'}
          </Text>
        </View>
      </View>

      {/* Category Name & Count */}
      <View style={styles.infoWrapper}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.countText}>
          {transactionCount || 0} {transactionCount === 1 ? 'transaction' : 'transactions'}
        </Text>
      </View>

      {/* Amount & Percentage */}
      <View style={styles.amountRow}>
        <Text
          style={[
            styles.amountText,
            { color: isIncome ? '#059669' : '#0F172A' },
          ]}
        >
          ₹{(monthAmount || totalAmount || 0).toLocaleString('en-IN')}
        </Text>
        {!isIncome && percentageOfExpenses > 0 && (
          <Text style={styles.percentageText}>{percentageOfExpenses}% of spend</Text>
        )}
      </View>

      {/* Budget Progress Bar (for Expenses) */}
      {!isIncome && budget > 0 && (
        <View style={styles.budgetProgressSection}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Budget: ₹{budget.toLocaleString('en-IN')}</Text>
            <Text
              style={[
                styles.budgetPercent,
                budgetProgress > 85 ? { color: '#F43F5E' } : { color: '#0F172A' },
              ]}
            >
              {budgetProgress}%
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, budgetProgress)}%`,
                  backgroundColor:
                    budgetProgress > 90
                      ? '#F43F5E'
                      : budgetProgress > 70
                      ? '#F59E0B'
                      : '#00C48C',
                },
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoWrapper: {
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  countText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
  },
  percentageText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  budgetProgressSection: {
    marginTop: 4,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  budgetPercent: {
    fontSize: 10,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
