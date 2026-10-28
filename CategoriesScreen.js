import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import { useFinance } from '../context/FinanceContext';

export default function CategoriesScreen({ navigation }) {
  const { categoryStats } = useFinance();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'

  const filteredCategories = useMemo(() => {
    if (filterType === 'all') return categoryStats;
    return categoryStats.filter((c) => c.type === filterType);
  }, [categoryStats, filterType]);

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetails', { categoryId: category.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <Header
        title="Category Budgets"
        subtitle="Spending limits & breakdown"
        navigation={navigation}
        showDrawer={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Filter Pills: All, Expense, Income */}
        <View style={styles.filterContainer}>
          {['all', 'expense', 'income'].map((t) => {
            const active = filterType === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setFilterType(t)}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {t === 'all'
                    ? 'All'
                    : t === 'expense'
                    ? 'Expenses'
                    : 'Incomes'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🌟 2-Column Responsive Categories Grid */}
        <View style={styles.gridContainer}>
          {filteredCategories.map((cat) => (
            <View key={cat.id} style={styles.gridColumn}>
              <CategoryCard category={cat} onPress={handleCategoryPress} />
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8F2DE',
  },
  filterPillActive: {
    backgroundColor: '#00D09E',
    borderColor: '#00D09E',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#093836',
  },
  filterTextActive: {
    color: '#093836',
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48.5%',
  },
});
