import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  prefix,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  autoCapitalize = 'none',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          isFocused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? colors.primaryNavy : colors.textSecondary}
            style={styles.icon}
          />
        )}

        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            multiline && { minHeight: 80, textAlignVertical: 'top' },
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardWhite,
    borderRadius: spacing.radiusLg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    height: 52,
    ...spacing.shadowSubtle,
  },
  multilineWrapper: {
    height: 'auto',
    paddingVertical: spacing.sm,
  },
  inputWrapperFocused: {
    borderColor: colors.primaryLavender,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: colors.expenseRed,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.7,
  },
  icon: {
    marginRight: 10,
  },
  prefixText: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.primaryNavy,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 15,
  },
  eyeButton: {
    padding: 6,
  },
  errorText: {
    ...typography.caption,
    color: colors.expenseRed,
    marginTop: 4,
    marginLeft: 4,
  },
});
