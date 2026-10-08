import {Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const Typography = {
  fontFamily,

  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  sizes: {
    xs: 12,
    sm: 13,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 32,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
};

export default Typography;
