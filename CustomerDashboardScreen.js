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
import { DrawerActions } from '@react-navigation/native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import MovingBackground from '../components/MovingBackground';
import { IncomeExpenseLineChart, SpendingDonutChart } from '../components/ReportChart';
import { useFinance } from '../context/FinanceContext';

export default function CustomerDashboardScreen({ navigation }) {
  const {
    userProfile,
    totals,
    dashboardPeriod,
    setDashboardPeriod,
    filteredDashboardTransactions,
    transactions,
    categoryStats,
    deleteTransaction,
  } = useFinance();

  // Always show the latest added transactions immediately at the top
  const displayedTransactions = transactions.slice(0, 6);

  const donutData = categoryStats
    .filter((c) => c.type === 'expense')
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      amount: c.monthAmount || c.totalAmount || 200,
      color: c.color || '#00D09E',
    }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#00D09E" />

      {/* Dynamic Animated Ambient Background */}
      <MovingBackground>
        {/* Top Polished Header with Curve */}
        <View style={styles.topCurvedSection}>
          {/* Status Badge */}
          <View style={styles.statusBarBanner}>
            <Ionicons name="sparkles" size={13} color="#093836" style={{ marginRight: 6 }} />
            <Text style={styles.statusBannerText}>60% Of Your Expenses, Looks Good.</Text>
          </View>

          {/* Navigation Bar */}
          <View style={styles.headerRow}>
            {/* Drawer Menu Icon */}
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => {
                if (navigation?.openDrawer) {
                  navigation.openDrawer();
                } else if (navigation?.dispatch) {
                  navigation.dispatch(DrawerActions.openDrawer());
                }
              }}
              activeOpacity={0.7}
            >
              <Feather name="menu" size={20} color="#093836" />
            </TouchableOpacity>

            {/* Hello Mohana Title */}
            <View style={styles.greetingCol}>
              <Text style={styles.helloTitle}>Hello {userProfile.name} 👋</Text>
              <Text style={styles.welcomeSubtext}>Track your budget with ease</Text>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => Alert.alert('Notifications', `Hello ${userProfile.name}! All your budget goals are on track.`)}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#093836" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Body */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Figma Goal Card & Period Filter [ Daily | Weekly | Monthly ] */}
          <SummaryCard
            income={totals.income}
            expense={totals.expense}
            savings={totals.savings}
            savingsRate={totals.savingsRate}
            period={dashboardPeriod}
            onPeriodChange={setDashboardPeriod}
          />

          {/* 🌟 2x2 FINANCIAL METRICS GRID (Clean, Structured & Beautiful) */}
          <View style={styles.gridSection}>
            <View style={styles.gridRow}>
              {/* Grid 1: Total Inflows */}
              <View style={styles.gridCard}>
                <View style={styles.gridCardHeader}>
                  <View style={[styles.gridIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <Feather name="arrow-down-left" size={18} color="#059669" />
                  </View>
                  <Text style={styles.gridBadgeGreen}>+12.4%</Text>
                </View>
                <Text style={styles.gridLabel}>Total Inflows</Text>
                <Text style={[styles.gridValue, { color: '#059669' }]}>
                  ₹{(totals?.income ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Grid 2: Total Outflows */}
              <View style={styles.gridCard}>
                <View style={styles.gridCardHeader}>
                  <View style={[styles.gridIconWrap, { backgroundColor: '#FFF1F2' }]}>
                    <Feather name="arrow-up-right" size={18} color="#F43F5E" />
                  </View>
                  <Text style={styles.gridBadgeRed}>Controlled</Text>
                </View>
                <Text style={styles.gridLabel}>Total Outflows</Text>
                <Text style={[styles.gridValue, { color: '#F43F5E' }]}>
                  -₹{(totals?.expense ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={[styles.gridRow, { marginTop: 12 }]}>
              {/* Grid 3: Net Savings Rate */}
              <View style={styles.gridCard}>
                <View style={styles.gridCardHeader}>
                  <View style={[styles.gridIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#3B82F6" />
                  </View>
                  <Text style={styles.gridBadgeBlue}>{totals?.savingsRate ?? 60}%</Text>
                </View>
                <Text style={styles.gridLabel}>Savings Rate</Text>
                <Text style={[styles.gridValue, { color: '#0F172A' }]}>
                  ₹{(totals?.savings ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Grid 4: Monthly Budget Target */}
              <View style={styles.gridCard}>
                <View style={styles.gridCardHeader}>
                  <View style={[styles.gridIconWrap, { backgroundColor: '#F5F3FF' }]}>
                    <Feather name="target" size={18} color="#8B5CF6" />
                  </View>
                  <Text style={styles.gridBadgePurple}>Active</Text>
                </View>
                <Text style={styles.gridLabel}>Budget Target</Text>
                <Text style={[styles.gridValue, { color: '#0F172A' }]}>
                  ₹{(userProfile?.monthlyBudget ?? 50000).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>

          {/* 🌟 4-ITEM QUICK ACTIONS GRID */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => navigation.navigate('AddTransaction', { initialType: 'expense' })}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBubble, { backgroundColor: '#FFF1F2' }]}>
                <Feather name="minus" size={20} color="#F43F5E" />
              </View>
              <Text style={styles.actionGridTitle}>Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => navigation.navigate('AddTransaction', { initialType: 'income' })}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBubble, { backgroundColor: '#ECFDF5' }]}>
                <Feather name="plus" size={20} color="#059669" />
              </View>
              <Text style={styles.actionGridTitle}>Add Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => navigation.navigate('Categories')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBubble, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="layers-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.actionGridTitle}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => navigation.navigate('Analysis')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBubble, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="chart-bar" size={20} color="#D97706" />
              </View>
              <Text style={styles.actionGridTitle}>Analytics</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Section Header */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {dashboardPeriod === 'daily'
                ? "Today's Transactions"
                : dashboardPeriod === 'weekly'
                ? "This Week's Transactions"
                : 'Recent Transactions'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsWrapper}>
            {displayedTransactions.map((tx) => (
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
            ))}
          </View>

          {/* Income vs Expense Curves */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Income vs Expense Trend</Text>
            <Text style={styles.subBadge}>Monthly Flow</Text>
          </View>
          <IncomeExpenseLineChart />

          {/* Category Spending Donut Chart */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Category Spending</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAllLink}>View Details</Text>
            </TouchableOpacity>
          </View>
          <SpendingDonutChart data={donutData} totalSpent={totals.expense} />

          {/* Record Transaction Button */}
          <TouchableOpacity
            style={styles.floatingBanner}
            onPress={() => navigation.navigate('AddTransaction')}
            activeOpacity={0.85}
          >
            <View style={styles.bannerIconCircle}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerHeading}>Record New Transaction</Text>
              <Text style={styles.bannerSubheading}>
                Get personalized alert notifications automatically
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color="#0F172A" />
          </TouchableOpacity>
        </ScrollView>
      </MovingBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00D09E',
  },
  topCurvedSection: {
    backgroundColor: '#00D09E',
    paddingTop: 8,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 6,
  },
  statusBarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: 'center',
    marginBottom: 10,
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#093836',
    letterSpacing: 0.2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  greetingCol: {
    flex: 1,
    marginHorizontal: 12,
  },
  helloTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#093836',
  },
  welcomeSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(9, 56, 54, 0.8)',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 50,
    paddingTop: 6,
  },
  // 2x2 Grid Section
  gridSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadgeGreen: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridBadgeRed: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F43F5E',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridBadgeBlue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridBadgePurple: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B5CF6',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  // 4-item Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  actionGridItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionGridTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#093836',
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#093836',
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2F80ED',
  },
  subBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  transactionsWrapper: {
    paddingHorizontal: 16,
  },
  floatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00C48C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bannerSubheading: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
});
