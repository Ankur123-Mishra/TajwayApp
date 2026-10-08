/** Design size used by the current screens (iPhone 11 / common Android width). */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const MIN_RATIO = 0.78;
const MAX_RATIO = 1.2;
const SCALE_FACTOR = 0.85;
const MAX_FONT_SCALE = 1.25;

const FONT_KEYS = new Set(['fontSize', 'lineHeight']);

const SPATIAL_KEYS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'top',
  'bottom',
  'left',
  'right',
  'gap',
  'rowGap',
  'columnGap',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderTopStartRadius',
  'borderTopEndRadius',
  'borderBottomStartRadius',
  'borderBottomEndRadius',
  'flexBasis',
]);

export const layoutRatio = (width, height) => {
  const raw = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.min(Math.max(raw, MIN_RATIO), MAX_RATIO);
};

export const layoutMultiplier = (width, height) =>
  1 + (layoutRatio(width, height) - 1) * SCALE_FACTOR;

/** Same factor for width and height so circles stay circles. */
export const moderateScale = (size, width, height) =>
  Math.round(size * layoutMultiplier(width, height) * 10) / 10;

/**
 * Screen-scaled font size.
 * React Native multiplies `fontSize` by `fontScale` again, so this caps
 * extreme system text sizes without ignoring them.
 */
export const responsiveFont = (size, width, height, fontScale) => {
  const safeFontScale = fontScale > 0 ? fontScale : 1;
  const capped = Math.min(safeFontScale, MAX_FONT_SCALE);
  return (
    Math.round(size * layoutMultiplier(width, height) * (capped / safeFontScale) * 10) /
    10
  );
};

const scaleNumber = (value, key, metrics) => {
  if (!Number.isFinite(value) || Math.abs(value) < 1) {
    return value;
  }
  const {width, height, fontScale} = metrics;
  if (FONT_KEYS.has(key)) {
    return responsiveFont(value, width, height, fontScale);
  }
  if (SPATIAL_KEYS.has(key)) {
    return moderateScale(value, width, height);
  }
  return value;
};

export const scaleStyleSheet = (styles, metrics) => {
  const walk = (value, key) => {
    if (Array.isArray(value)) {
      return value.map(item => walk(item, key));
    }
    if (value && typeof value === 'object') {
      const next = {};
      Object.keys(value).forEach(childKey => {
        next[childKey] = walk(value[childKey], childKey);
      });
      return next;
    }
    if (typeof value === 'number') {
      return scaleNumber(value, key, metrics);
    }
    return value;
  };

  return walk(styles, null);
};
