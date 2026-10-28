import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'sans-serif',
});

export const typography = {
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500',
  },
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
  },
  badge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  amountLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  amountMedium: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
  },
  amountSmall: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
};
