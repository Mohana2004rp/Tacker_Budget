import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useFinance } from '../context/FinanceContext';

export default function EditProfileScreen({ navigation }) {
  const { userProfile, updateProfile } = useFinance();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [monthlyBudget, setMonthlyBudget] = useState(String(userProfile.monthlyBudget));
  const [preferredCurrency, setPreferredCurrency] = useState(userProfile.preferredCurrency);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      const success = updateProfile({
        name,
        email,
        phone,
        monthlyBudget: parseFloat(monthlyBudget) || userProfile.monthlyBudget,
        preferredCurrency,
      });
      setLoading(false);
      if (success) {
        navigation.goBack();
      }
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundLight} />
      <Header
        title="Edit Profile"
        subtitle="Update personal information"
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
          <View style={styles.card}>
            <CustomInput
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Mohana"
              icon="person-outline"
              autoCapitalize="words"
            />

            <CustomInput
              label="Email Address *"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. mohana@financeapp.com"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <CustomInput
              label="Phone Number *"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              icon="call-outline"
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Personal Monthly Budget Target (₹)"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              placeholder="50000"
              prefix="₹"
              keyboardType="numeric"
            />

            <CustomInput
              label="Preferred Currency"
              value={preferredCurrency}
              onChangeText={setPreferredCurrency}
              placeholder="₹"
              icon="cash-outline"
            />

            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                size="medium"
                style={styles.cancelBtn}
              />

              <CustomButton
                title="Save Changes"
                onPress={handleSave}
                variant="primary"
                size="medium"
                loading={loading}
                style={styles.saveBtn}
              />
            </View>
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
  card: {
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusXl,
    padding: spacing.lg,
    ...spacing.shadowCard,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});
