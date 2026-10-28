import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import TransactionItem from '../components/TransactionItem';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function CategoryDetailsScreen({ navigation, route }) {
  const categoryId = route.params?.categoryId || 'food';

  const {
    categories,
    categoryStats,
    transactions,
    selectedMonth,
    setSelectedMonth,
    updateCategoryBudget,
    deleteTransaction,
  } = useFinance();

  const [modalVisible, setModalVisible] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState('');

  // Find category details
  const category = categoryStats.find((c) => c.id === categoryId) || categories[0];
  const isIncome = category.type === 'income';

  // Filter transactions for this category
  const categoryTransactions = useMemo(() => {
    return transactions.filter((t) => t.categoryId === categoryId);
  }, [transactions, categoryId]);

  const monthCategoryTransactions = useMemo(() => {
    return categoryTransactions.filter((t) => t.month === selectedMonth);
  }, [categoryTransactions, selectedMonth]);

  const openBudgetModal = () => {
    setNewBudgetValue(String(category.budget || 10000));
    setModalVisible(true);
  };

  const handleSaveBudget = () => {
    const success = updateCategoryBudget(categoryId, newBudgetValue);
    if (success) {
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title={category.name}
        subtitle={isIncome ? 'Income Source Details' : 'Category Budget & Expenses'}
        navigation={navigation}
        showBack={true}
        showDrawer={false}
        rightIcon={isIncome ? undefined : 'options-outline'}
        onRightPress={openBudgetModal}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Category Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroIconWrap, { backgroundColor: category.bgColor }]}>
              <MaterialCommunityIcons name={category.icon} size={30} color={category.color} />
            </View>
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroName}>{category.name}</Text>
              <Text style={styles.heroType}>
                {isIncome ? 'Recurring Income Stream' : 'Controlled Expense Category'}
              </Text>
            </View>
          </View>

          {/* Amount Display */}
          <View style={styles.heroAmountRow}>
            <View>
              <Text style={styles.amountLabel}>
                {isIncome ? 'TOTAL EARNED THIS MONTH' : 'TOTAL SPENT THIS MONTH'}
              </Text>
              <Text
                style={[
                  styles.amountValue,
                  { color: isIncome ? colors.mintGreenDark : colors.textPrimary },
                ]}
              >
                ₹{(category.monthAmount || category.totalAmount || 0).toLocaleString('en-IN')}
              </Text>
            </View>

            {!isIncome && (
              <TouchableOpacity
                style={styles.editBudgetPill}
                onPress={openBudgetModal}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={12} color={colors.primaryNavy} style={{ marginRight: 4 }} />
                <Text style={styles.editBudgetText}>Edit Budget</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Budget & Remaining Card (For Expenses) */}
          {!isIncome && (
            <View style={styles.budgetOverview}>
              <View style={styles.budgetRow}>
                <View>
                  <Text style={styles.budgetSub}>Allocated Budget</Text>
                  <Text style={styles.budgetBold}>₹{(category?.budget ?? 0).toLocaleString('en-IN')}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.budgetSub}>Remaining Balance</Text>
                  <Text
                    style={[
                      styles.budgetBold,
                      {
                        color:
                          (category?.remainingBudget ?? 0) === 0 ? colors.expenseRed : colors.mintGreenDark,
                      },
                    ]}
                  >
                    ₹{(category?.remainingBudget ?? 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(100, category.budgetProgress)}%`,
                      backgroundColor:
                        category.budgetProgress > 90
                          ? colors.expenseRed
                          : category.budgetProgress > 70
                          ? colors.warmCreamDark
                          : colors.primaryLavender,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressNote}>
                {category.budgetProgress}% of monthly allocation used
              </Text>
            </View>
          )}
        </View>

        {/* Month Selector Pills */}
        <View style={styles.monthSelectorRow}>
          {['2026-10', '2026-09'].map((m) => {
            const active = selectedMonth === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setSelectedMonth(m)}
                style={[styles.monthPill, active && styles.monthPillActive]}
              >
                <Text style={[styles.monthPillText, active && styles.monthPillTextActive]}>
                  {m === '2026-10' ? 'October 2026' : 'September 2026'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transactions under this Category */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Category Transactions</Text>
          <Text style={styles.countBadge}>
            {monthCategoryTransactions.length} entries
          </Text>
        </View>

        {monthCategoryTransactions.length > 0 ? (
          monthCategoryTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() =>
                navigation.navigate('TransactionDetails', { transactionId: tx.id })
              }
              onEdit={(item) =>
                navigation.navigate('AddTransaction', { editingTransaction: item })
              }
              onDelete={deleteTransaction}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Feather name="folder" size={32} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Transactions for {selectedMonth}</Text>
            <Text style={styles.emptySub}>
              You haven't logged any transactions under {category.name} for this month.
            </Text>
          </View>
        )}

        {/* Add Transaction Button */}
        <CustomButton
          title={`Add ${category.name} Transaction`}
          onPress={() =>
            navigation.navigate('AddTransaction', {
              initialType: category.type,
              editingTransaction: null,
            })
          }
          variant="primary"
          size="medium"
          icon="add-outline"
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Monthly Budget</Text>
            <Text style={styles.modalSubtitle}>
              Update your monthly spending ceiling for {category.name}.
            </Text>

            <View style={styles.modalInputWrapper}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                value={newBudgetValue}
                onChangeText={setNewBudgetValue}
                keyboardType="numeric"
                style={styles.modalInput}
                placeholder="10000"
              />
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.modalBtnSaveText}>Save Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...spacing.shadowCard,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  heroTitleWrap: {
    flex: 1,
  },
  heroName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  heroType: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  amountLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  amountValue: {
    ...typography.amountLarge,
    fontSize: 28,
    marginTop: 2,
  },
  editBudgetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lavenderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.radiusPill,
  },
  editBudgetText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  budgetOverview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  budgetBold: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E2EC',
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressNote: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
  },
  monthSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.cardWhite,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  countBadge: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusLg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...spacing.shadowSubtle,
  },
  emptyTitle: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 28, 53, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    ...spacing.shadowHeavy,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLavender,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.lg,
  },
  currencyPrefix: {
    ...typography.h3,
    color: colors.primaryNavy,
    marginRight: 6,
  },
  modalInput: {
    flex: 1,
    ...typography.amountMedium,
    color: colors.textPrimary,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.radiusMd,
  },
  modalBtnCancel: {
    backgroundColor: colors.surfaceMuted,
  },
  modalBtnCancelText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalBtnSave: {
    backgroundColor: colors.primaryLavender,
  },
  modalBtnSaveText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryNavy,
  },
});
