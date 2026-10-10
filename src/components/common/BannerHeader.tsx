import React, {useState} from 'react';
import {Image, StatusBar, Text, View, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../brand/BackButton';
import Images from '../../constants/Images';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

/** HeaderBanner2.png is 512×106. Height follows this ratio so the art is not stretched. */
const BANNER_WIDTH = 512;
const BANNER_HEIGHT = 106;

/**
 * Yellow banner header (HeaderBanner2).
 * The image itself sits behind the status bar and spans the full screen width.
 */

const BannerHeader = ({
  title,
  onBack,
  right,
  raised = false,
  style,
  contentStyle,
  children,
}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();
  const {width: windowWidth} = useWindowDimensions();
  const [barWidth, setBarWidth] = useState(windowWidth);
  const imageWidth = barWidth || windowWidth;
  const imageHeight = (imageWidth * BANNER_HEIGHT) / BANNER_WIDTH;

  return (
    <View
      style={[styles.wrap, {height: imageHeight}, raised && styles.raised, style]}
      onLayout={event => {
        const nextWidth = event.nativeEvent.layout.width;
        if (nextWidth > 0 && nextWidth !== barWidth) {
          setBarWidth(nextWidth);
        }
      }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image
        source={Images.headerBanner2}
        style={styles.image}
        resizeMode="cover"
      />
      <View
        style={[
          styles.content,
          imageHeight > insets.top + 36 ? {top: insets.top} : null,
          children == null && styles.centered,
          contentStyle,
        ]}>
        {children != null ? (
          children
        ) : (
          <View style={styles.row}>
            <View style={styles.side}>
              {onBack ? (
                <BackButton onPress={onBack} color={Colors.textPrimary} />
              ) : null}
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.sideRight}>{right}</View>
          </View>
        )}
      </View>
    </View>
  );
};

const baseStyles = {
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },

  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  
  raised: {
    zIndex: 30,
    elevation: 30,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.screenPadding,
    justifyContent: 'center',
  },
  centered: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginHorizontal: 8,
  },
};

export default BannerHeader;
