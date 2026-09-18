import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {ROUTES} from '../../constants/Routes';
import {Colors, Typography} from '../../theme';

const TABS = {
  [ROUTES.AGENT_HOME]: {
    label: 'Market',
    outline: 'home-outline',
    filled: 'home',
    library: 'ion',
  },
  [ROUTES.AGENT_BOOKINGS]: {
    label: 'My Bookings',
    outline: 'calendar-clock-outline',
    filled: 'calendar-clock',
    library: 'mdi',
  },
  [ROUTES.AGENT_CREATE_BOOKING]: {
    isCenter: true,
  },
  [ROUTES.AGENT_MESSAGES]: {
    label: 'Chat',
    outline: 'chatbubbles-outline',
    filled: 'chatbubbles',
    library: 'ion',
  },
  [ROUTES.AGENT_PROFILE]: {
    label: 'Profile',
    outline: 'person-outline',
    filled: 'person',
    library: 'ion',
  },
};

const SCREEN_H = Dimensions.get('window').height;

const TabGlyph = ({config, focused}) => {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  const name = focused ? config.filled : config.outline;
  const IconSet = config.library === 'mdi' ? MaterialDesignIcons : Ionicons;
  return <IconSet name={name} size={22} color={color} />;
};

/**
 * Bottom tab bar — center + expands into a speed-dial (no modal).
 */
const AgentTabBar = ({
  state,
  descriptors,
  navigation,
  onNewBooking,
  onFreeVehicle,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const closingRef = useRef(false);

  const openMenu = () => {
    closingRef.current = false;
    setMenuMounted(true);
    setMenuOpen(true);
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    if (closingRef.current || !menuMounted) {
      return;
    }
    closingRef.current = true;
    setMenuOpen(false);
    Animated.timing(anim, {
      toValue: 0,
      duration: 150,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setMenuMounted(false);
        anim.setValue(0);
        closingRef.current = false;
      }
    });
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleNewBooking = () => {
    closeMenu();
    onNewBooking?.();
  };

  const handleFreeVehicle = () => {
    closeMenu();
    onFreeVehicle?.();
  };

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const menuOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const menuTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
    extrapolate: 'clamp',
  });

  const menuScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
    extrapolate: 'clamp',
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.wrap, {paddingBottom: bottomPad}]}>
      {menuMounted ? (
        <>
          <Animated.View
            pointerEvents={menuOpen ? 'auto' : 'none'}
            style={[styles.backdrop, {opacity: backdropOpacity}]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeMenu}
              accessibilityLabel="Dismiss create menu"
            />
          </Animated.View>

          <Animated.View
            pointerEvents={menuOpen ? 'auto' : 'none'}
            style={[
              styles.speedDial,
              {
                opacity: menuOpacity,
                transform: [
                  {translateY: menuTranslateY},
                  {scale: menuScale},
                ],
              },
            ]}>
            <TouchableOpacity
              style={styles.actionChip}
              activeOpacity={0.85}
              onPress={handleNewBooking}
              accessibilityRole="button"
              accessibilityLabel="New Booking">
              <View style={[styles.actionIcon, styles.bookingIcon]}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Colors.onPrimary}
                />
              </View>
              <Text style={styles.actionText}>New Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionChip}
              activeOpacity={0.85}
              onPress={handleFreeVehicle}
              accessibilityRole="button"
              accessibilityLabel="Free Vehicle">
              <View style={[styles.actionIcon, styles.vehicleIcon]}>
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={Colors.textInverse}
                />
              </View>
              <Text style={styles.actionText}>Free Vehicle</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : null}

      {state.routes.map((route, index) => {
        const config = TABS[route.name] || {};
        const isFocused = state.index === index;
        const {options} = descriptors[route.key];

        const onPress = () => {
          if (menuOpen || menuMounted) {
            closeMenu();
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        if (config.isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={toggleMenu}
              style={styles.centerItem}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Close create menu' : 'Create'}
              accessibilityState={{expanded: menuOpen}}>
              <View style={[styles.plusBtn, menuOpen && styles.plusBtnOpen]}>
                <Animated.View style={{transform: [{rotate}]}}>
                  <Ionicons name="add" size={30} color={Colors.onPrimary} />
                </Animated.View>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={() =>
              navigation.emit({type: 'tabLongPress', target: route.key})
            }
            style={styles.item}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{selected: isFocused}}
            accessibilityLabel={config.label || options.title}>
            {isFocused ? (
              <View style={styles.activeLine} />
            ) : (
              <View style={styles.lineSpacer} />
            )}
            <TabGlyph config={config} focused={isFocused} />
            <Text
              style={[styles.label, isFocused && styles.labelOn]}
              numberOfLines={1}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 4,
    zIndex: 20,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_H,
    backgroundColor: 'rgba(26, 26, 27, 0.28)',
    zIndex: 1,
  },
  speedDial: {
    position: 'absolute',
    alignSelf: 'center',
    marginLeft: 28,
    bottom: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    zIndex: 2,
    paddingHorizontal: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingIcon: {
    backgroundColor: Colors.primary,
  },
  vehicleIcon: {
    backgroundColor: Colors.secondary,
  },
  actionText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textNavy,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 56,
    paddingTop: 4,
    zIndex: 3,
  },
  centerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginTop: -10,
    zIndex: 3,
  },
  activeLine: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.tabActive,
    marginBottom: 6,
  },
  lineSpacer: {
    height: 9,
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    color: Colors.tabInactive,
    fontWeight: Typography.fontWeights.medium,
  },
  labelOn: {
    color: Colors.tabActive,
    fontWeight: Typography.fontWeights.semibold,
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.surface,
  },
  plusBtnOpen: {
    backgroundColor: Colors.primaryDark,
  },
});

export default AgentTabBar;
