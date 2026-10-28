import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TransactionItem({
  transaction,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const { title, amount, type, categoryName, formattedDate, tag } = transaction;
  const isIncome = type === 'income';

  // Format currency with Rupees symbol
  const formatAmount = (val, isInc) => {
    const num = Math.abs(val || 0);
    const parts = num.toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1];
    const sign = isInc ? '' : '-';
    return `${sign}₹${integerPart}.${decimalPart}`;
  };

  const getFigmaIcon = () => {
    const t = (title || '').toLowerCase();
    const c = (categoryName || '').toLowerCase();
    if (t.includes('salary') || c.includes('salary')) {
      return <MaterialCommunityIcons name="cash-multiple" size={22} color="#FFFFFF" />;
    }
    if (t.includes('groc') || c.includes('pantry') || c.includes('food')) {
      return <MaterialCommunityIcons name="shopping" size={20} color="#FFFFFF" />;
    }
    if (t.includes('rent') || c.includes('rent') || c.includes('bill')) {
      return <MaterialCommunityIcons name="key-variant" size={20} color="#FFFFFF" />;
    }
    if (t.includes('transport') || c.includes('transport')) {
      return <MaterialCommunityIcons name="car-outline" size={20} color="#FFFFFF" />;
    }
    if (t.includes('freelance') || isIncome) {
      return <MaterialCommunityIcons name="laptop" size={20} color="#FFFFFF" />;
    }
    return <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FFFFFF" />;
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(`Are you sure you want to delete "${title}"?`) : true;
      if (confirmed) {
        onDelete && onDelete(transaction.id);
      }
    } else {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to delete "${title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete && onDelete(transaction.id),
          },
        ]
      );
    }
  };

  const displayTag = tag || categoryName || (isIncome ? 'Income' : 'Expense');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Modern Blue Circular Badge from Figma */}
      <View style={styles.blueBadge}>
        {getFigmaIcon()}
      </View>

      {/* Title & Time */}
      <View style={styles.titleCol}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.timeText} numberOfLines={1}>
          {formattedDate || '18:27 - April 30'}
        </Text>
      </View>

      {/* Vertical Divider */}
      <View style={styles.colDivider} />

      {/* Category Tag */}
      <View style={styles.tagCol}>
        <Text style={styles.tagText} numberOfLines={1}>
          {displayTag}
        </Text>
      </View>

      {/* Vertical Divider */}
      <View style={styles.colDivider} />

      {/* Amount Column */}
      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amountText,
            isIncome ? styles.incomeText : styles.expenseText,
          ]}
          numberOfLines={1}
        >
          {formatAmount(amount, isIncome)}
        </Text>

        {showActions && (
          <View style={styles.miniActionRow}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(transaction)}
                style={styles.miniBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="edit-2" size={12} color="#64748B" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.miniBtn, { marginLeft: 6 }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={12} color="#F43F5E" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  blueBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2F80ED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  titleCol: {
    flex: 1.4,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#093836',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F80ED',
  },
  colDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#C8F2DE',
    marginHorizontal: 8,
  },
  tagCol: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#093836',
    textAlign: 'center',
  },
  amountCol: {
    flex: 1.3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  incomeText: {
    color: '#093836',
  },
  expenseText: {
    color: '#2F80ED',
  },
  miniActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  miniBtn: {
    padding: 2,
  },
});
