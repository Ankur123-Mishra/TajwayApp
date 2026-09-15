import {Dimensions as RNDimensions, Platform} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = RNDimensions.get('window');

const Dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },

  iconSize: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  },

  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },

  inputHeight: 48,
  headerHeight: Platform.OS === 'ios' ? 56 : 56,
  tabBarHeight: Platform.OS === 'ios' ? 84 : 64,
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 88,
  },

  shadow: {
    soft: {
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export default Dimensions;
