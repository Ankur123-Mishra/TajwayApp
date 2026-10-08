import {useMemo} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {scaleStyleSheet} from '../utils/responsive';

/**
 * Scales a static style object from the live window.
 * `scale` (pixel density) is not used for layout, so it is not read here.
 * Font scaling uses `fontScale`; size uses `width` and `height`.
 */
export function useResponsiveStyles(baseStyles) {
  const {width, height, fontScale} = useWindowDimensions();

  return useMemo(
    () => StyleSheet.create(scaleStyleSheet(baseStyles, {width, height, fontScale})),
    [baseStyles, width, height, fontScale],
  );
}
