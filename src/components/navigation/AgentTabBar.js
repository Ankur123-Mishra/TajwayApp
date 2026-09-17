import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

const TabGlyph = ({config, focused}) => {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  const name = focused ? config.filled : config.outline;
  const IconSet = config.library === 'mdi' ? MaterialDesignIcons : Ionicons;
  return <IconSet name={name} size={22} color={color} />;
};

/**
 * Bottom tab bar matching the product screenshot:
 * rounded white bar, gold active indicator, outline → filled icons.
 */
const AgentTabBar = ({state, descriptors, navigation, onCreatePress}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrap, {paddingBottom: bottomPad}]}>
      {state.routes.map((route, index) => {
        const config = TABS[route.name] || {};
        const isFocused = state.index === index;
        const {options} = descriptors[route.key];

        const onPress = () => {
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
              onPress={() => onCreatePress?.()}
              style={styles.centerItem}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Create booking">
              <View style={styles.plusBtn}>
                <Ionicons name="add" size={30} color={Colors.textInverse} />
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
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 56,
    paddingTop: 4,
  },
  centerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginTop: -10,
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
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.surface,
  },
});

export default AgentTabBar;
