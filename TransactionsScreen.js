import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import TransactionItem from '../components/TransactionItem';
import { useFinance } from '../context/FinanceContext';

export default function TransactionsScreen({ navigation }) {
  const {
    transactions,
    selectedMonth,
    setSelectedMonth,
    monthWiseTotals,
    deleteTransaction,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'

  // Dynamically extract all months from transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set(['2026-10', '2026-09', '2026-08']);
    transactions.forEach((t) => {
      if (t.month) monthsSet.add(t.month);
    });
    return Array.from(monthsSet)
      .sort()
      .reverse()
      .map((m) => {
        const parts = m.split('-');
        const y = parts[0];
        const mo = parseInt(parts[1], 10);
        const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          key: m,
          label: `${names[mo - 1] || mo} ${y}`,
        };
      });
  }, [transactions]);

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Month match (shows selected month and any newly added transactions)
      const matchesMonth = t.month === selectedMonth || t.id.startsWith('tx-');
      if (!matchesMonth) return false;

      // Type match
      const matchesType = filterType === 'all' || t.type === filterType;
      if (!matchesType) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    });
  }, [transactions, selectedMonth, filterType, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Month-Wise Transactions"
        subtitle="Manage Inflows & Outflows"
        navigation={navigation}
        showDrawer={true}
        rightIcon="add-circle"
        onRightPress={() => navigation.navigate('AddTransaction')}
      />

      <View style={styles.container}>
        {/* Month Selector Pills */}
        <View style={styles.monthSelectorRow}>
          {availableMonths.map((m) => {
            const active = selectedMonth === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setSelectedMonth(m.key)}
                style={[styles.monthPill, active && styles.monthPillActive]}
                activeOpacity={0.8}
              >
                <Feather
                  name="calendar"
                  size={13}
                  color={active ? '#FFFFFF' : colors.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.monthPillText, active && styles.monthPillTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Monthly Summary Banner: Income, Expense, Net Balance */}
        <View style={styles.monthlySummaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Income</Text>
            <Text style={[styles.summaryItemValue, { color: '#059669' }]}>
              +₹{(monthWiseTotals?.income ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Expense</Text>
            <Text style={[styles.summaryItemValue, { color: '#F43F5E' }]}>
              -₹{(monthWiseTotals?.expense ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Net</Text>
            <Text
              style={[
                styles.summaryItemValue,
                {
                  color:
                    (monthWiseTotals?.netBalance ?? 0) >= 0 ? '#059669' : '#F43F5E',
                },
              ]}
            >
              ₹{(monthWiseTotals?.netBalance ?? 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Search Bar & Type Filter Row */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, note, or category..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills: All / Income / Expense */}
          <View style={styles.typeFilterRow}>
            {['all', 'income', 'expense'].map((t) => {
              const active = filterType === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setFilterType(t)}
                  style={[styles.typeFilterPill, active && styles.typeFilterPillActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeFilterText,
                      active && styles.typeFilterTextActive,
                    ]}
                  >
                    {t === 'all' ? 'All' : t === 'income' ? '+ Income' : '- Expense'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transactions FlatList */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Feather name="inbox" size={36} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                No entries match the selected filters for this month.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => navigation.navigate('AddTransaction')}
              >
                <Feather name="plus" size={16} color={colors.primaryNavy} style={{ marginRight: 6 }} />
                <Text style={styles.emptyAddBtnText}>Add a Transaction</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={() =>
                navigation.navigate('TransactionDetails', { transactionId: item.id })
              }
              onEdit={(tx) =>
                navigation.navigate('AddTransaction', { editingTransaction: tx })
              }
              onDelete={deleteTransaction}
            />
          )}
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddTransaction')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={colors.primaryNavy} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  monthSelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: 8,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardWhite,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: spacing.radiusPill,
    ...spacing.shadowSubtle,
  },
  monthPillActive: {
    backgroundColor: colors.primaryNavy,
  },
  monthPillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  monthlySummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '500',
  },
  summaryItemValue: {
    ...typography.subtitle,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  searchFilterContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
  },
  typeFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceMuted,
  },
  typeFilterPillActive: {
    backgroundColor: colors.primaryLavender,
  },
  typeFilterText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeFilterTextActive: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.radiusLg,
    marginTop: spacing.md,
  },
  emptyAddBtnText: {
    ...typography.subtitle,
    fontSize: 13,
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
    ...spacing.shadowHeavy,
  },
});
