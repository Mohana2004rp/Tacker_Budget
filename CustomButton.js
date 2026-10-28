import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'navy' | 'mint' | 'outline' | 'danger'
  size = 'medium', // 'small' | 'medium' | 'large'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'navy':
        return styles.btnNavy;
      case 'mint':
        return styles.btnMint;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'navy':
        return styles.textWhite;
      case 'mint':
        return styles.textMintDark;
      case 'outline':
        return styles.textPrimary;
      case 'danger':
        return styles.textWhite;
      case 'primary':
      default:
        return styles.textNavy;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'large':
        return styles.sizeLarge;
      case 'medium':
      default:
        return styles.sizeMedium;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'navy' || variant === 'danger' ? '#FFFFFF' : colors.primaryNavy}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextStyle().color}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={18}
              color={getTextStyle().color}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    ...typography.subtitle,
    fontWeight: '600',
  },
  sizeSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: spacing.radiusMd,
  },
  sizeMedium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: spacing.radiusLg,
  },
  sizeLarge: {
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: spacing.radiusXl,
  },
  // Variants
  btnPrimary: {
    backgroundColor: colors.primaryLavender,
    ...spacing.shadowSubtle,
  },
  btnNavy: {
    backgroundColor: colors.primaryNavy,
    ...spacing.shadowSubtle,
  },
  btnMint: {
    backgroundColor: colors.mintGreen,
    ...spacing.shadowSubtle,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  btnDanger: {
    backgroundColor: colors.expenseRed,
    ...spacing.shadowSubtle,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text colors
  textNavy: {
    color: colors.primaryNavy,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textMintDark: {
    color: colors.mintGreenDark,
  },
  textPrimary: {
    color: colors.textPrimary,
  },
});
