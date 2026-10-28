import React, { useState, useEffect } from 'react';
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
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function AddTransactionScreen({ navigation, route }) {
  const editingTransaction = route.params?.editingTransaction;
  const initialType = route.params?.initialType || 'expense';

  const { categories, addTransaction, editTransaction, selectedMonth } = useFinance();

  const isEditing = !!editingTransaction;

  const [title, setTitle] = useState(editingTransaction ? editingTransaction.title : '');
  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : ''
  );
  const [type, setType] = useState(
    editingTransaction ? editingTransaction.type : initialType
  );
  const [categoryId, setCategoryId] = useState(
    editingTransaction
      ? editingTransaction.categoryId
      : initialType === 'income'
      ? 'salary'
      : 'food'
  );
  const [date, setDate] = useState(
    editingTransaction
      ? editingTransaction.date
      : `${selectedMonth || '2026-10'}-28`
  );
  const [note, setNote] = useState(editingTransaction ? editingTransaction.note : '');
  const [paymentMethod, setPaymentMethod] = useState(
    editingTransaction ? editingTransaction.paymentMethod : 'UPI Payment'
  );

  const availableCategories = categories.filter((c) => c.type === type);

  // If type switched, ensure selected category matches
  useEffect(() => {
    const currentCat = categories.find((c) => c.id === categoryId);
    if (!currentCat || currentCat.type !== type) {
      const firstMatching = categories.find((c) => c.type === type);
      if (firstMatching) setCategoryId(firstMatching.id);
    }
  }, [type]);

  const handleSubmit = () => {
    if (isEditing) {
      const success = editTransaction(editingTransaction.id, {
        title,
        amount,
        type,
        categoryId,
        date: (date && date.trim()) || `${selectedMonth || '2026-10'}-28`,
        month: selectedMonth || '2026-10',
        note,
        paymentMethod,
      });
      if (success) navigation.goBack();
    } else {
      const success = addTransaction({
        title,
        amount,
        type,
        categoryId,
        date: (date && date.trim()) || `${selectedMonth || '2026-10'}-28`,
        month: selectedMonth || '2026-10',
        note,
        paymentMethod,
      });
      if (success) navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title={isEditing ? 'Edit Transaction' : 'New Transaction'}
        subtitle={isEditing ? 'Update transaction details' : 'Record financial inflow or outflow'}
        navigation={navigation}
        showBack={true}
        showDrawer={false}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Income vs Expense Selector */}
          <View style={styles.typeSelectorRow}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === 'expense' && styles.typeBtnExpenseActive,
              ]}
              onPress={() => setType('expense')}
              activeOpacity={0.8}
            >
              <Feather
                name="arrow-up-right"
                size={18}
                color={type === 'expense' ? '#FFFFFF' : colors.expenseRed}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  type === 'expense' && styles.typeBtnTextActive,
                ]}
              >
                Expense Outflow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === 'income' && styles.typeBtnIncomeActive,
              ]}
              onPress={() => setType('income')}
              activeOpacity={0.8}
            >
              <Feather
                name="arrow-down-left"
                size={18}
                color={type === 'income' ? colors.primaryNavy : colors.mintGreenDark}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  type === 'income' && styles.typeBtnTextIncomeActive,
                ]}
              >
                Income Inflow
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields Card */}
          <View style={styles.card}>
            <CustomInput
              label="Transaction Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Grocery Haul, Freelance Payout, Dining"
              icon="receipt-outline"
            />

            <CustomInput
              label="Amount in Rupees (₹) *"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 2450"
              prefix="₹"
              keyboardType="numeric"
            />

            {/* Category Picker Badges */}
            <View style={styles.categoryPickerSection}>
              <Text style={styles.sectionLabel}>CHOOSE CATEGORY *</Text>
              <View style={styles.categoryGrid}>
                {availableCategories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        { backgroundColor: cat.bgColor },
                        isSelected && styles.catPillSelected,
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={cat.icon}
                        size={18}
                        color={cat.color}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={colors.primaryNavy}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date Input */}
            <CustomInput
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              placeholder="2026-10-28"
              icon="calendar-outline"
            />

            {/* Payment Method / Account */}
            <View style={styles.paymentMethodSection}>
              <Text style={styles.sectionLabel}>PAYMENT METHOD / ACCOUNT</Text>
              <View style={styles.paymentMethodRow}>
                {['UPI Payment', 'HDFC Card', 'Bank Transfer', 'Cash'].map((m) => {
                  const active = paymentMethod === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.pmPill, active && styles.pmPillActive]}
                      onPress={() => setPaymentMethod(m)}
                    >
                      <Text style={[styles.pmText, active && styles.pmTextActive]}>{m}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional Note */}
            <CustomInput
              label="Optional Note / Remarks"
              value={note}
              onChangeText={setNote}
              placeholder="Add specific notes, receipt memo, or purpose"
              icon="document-text-outline"
              multiline={true}
              numberOfLines={3}
            />

            {/* Submit Button */}
            <CustomButton
              title={isEditing ? 'Save Changes' : 'Confirm & Save Transaction'}
              onPress={handleSubmit}
              variant="primary"
              size="large"
              style={{ marginTop: spacing.md }}
            />
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
    paddingBottom: spacing.xxxl,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: spacing.radiusLg,
    backgroundColor: colors.cardWhite,
    ...spacing.shadowSubtle,
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.expenseRed,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.mintGreen,
  },
  typeBtnText: {
    ...typography.subtitle,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  typeBtnTextIncomeActive: {
    color: colors.primaryNavy,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    ...spacing.shadowCard,
  },
  categoryPickerSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: spacing.radiusLg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catPillSelected: {
    borderColor: colors.primaryNavy,
  },
  catPillText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  catPillTextSelected: {
    fontWeight: '700',
    color: colors.primaryNavy,
  },
  paymentMethodSection: {
    marginBottom: spacing.md,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pmPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceMuted,
  },
  pmPillActive: {
    backgroundColor: colors.primaryNavy,
  },
  pmText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pmTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
