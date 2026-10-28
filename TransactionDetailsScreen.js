import React from 'react';
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
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function TransactionDetailsScreen({ navigation, route }) {
  const { transactionId } = route.params || {};
  const { transactions, deleteTransaction } = useFinance();

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Transaction" showBack={true} showDrawer={false} navigation={navigation} />
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundText}>Transaction not found or has been deleted.</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(`Are you sure you want to delete "${transaction.title}"?`) : true;
      if (confirmed) {
        deleteTransaction(transaction.id);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to delete "${transaction.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteTransaction(transaction.id);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Transaction Details"
        subtitle="Receipt & Audit Information"
        navigation={navigation}
        showBack={true}
        showDrawer={false}
        rightIcon="create-outline"
        onRightPress={() =>
          navigation.navigate('AddTransaction', { editingTransaction: transaction })
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: isIncome
                  ? 'rgba(185, 243, 208, 0.35)'
                  : 'rgba(255, 124, 134, 0.2)',
              },
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                { color: isIncome ? colors.mintGreenDark : colors.expenseRed },
              ]}
            >
              {isIncome ? 'Income Credited' : 'Expense Debited'}
            </Text>
          </View>

          <Text style={styles.titleText}>{transaction.title}</Text>
          <Text
            style={[
              styles.amountText,
              { color: isIncome ? colors.mintGreenDark : colors.expenseRed },
            ]}
          >
            {isIncome ? '+' : '-'}₹{(transaction?.amount ?? 0).toLocaleString('en-IN')}
          </Text>

          <View style={styles.receiptDivider} />

          {/* Details Rows */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.categoryName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>{transaction.formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{transaction.paymentMethod || 'UPI Transfer'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference ID</Text>
            <Text style={[styles.detailValue, { fontFamily: 'monospace', fontSize: 12 }]}>
              {transaction.id}
            </Text>
          </View>

          {transaction.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>REMARKS & NOTE</Text>
              <Text style={styles.noteText}>{transaction.note}</Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons */}
        <CustomButton
          title="Edit This Transaction"
          onPress={() =>
            navigation.navigate('AddTransaction', { editingTransaction: transaction })
          }
          variant="primary"
          size="medium"
          icon="create-outline"
          style={styles.actionBtn}
        />

        <CustomButton
          title="Delete Transaction"
          onPress={handleDelete}
          variant="outline"
          size="medium"
          icon="trash-outline"
          textStyle={{ color: colors.expenseRed }}
          style={[styles.actionBtn, { borderColor: colors.expenseRedLight }]}
        />
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
  notFoundWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  receiptCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...spacing.shadowCard,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: spacing.radiusPill,
    marginBottom: spacing.md,
  },
  typeBadgeText: {
    ...typography.badge,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  titleText: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  amountText: {
    ...typography.amountLarge,
    fontSize: 34,
    marginVertical: spacing.sm,
  },
  receiptDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  noteBox: {
    width: '100%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  noteLabel: {
    ...typography.badge,
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  noteText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 13,
  },
  actionBtn: {
    marginBottom: spacing.md,
  },
});
