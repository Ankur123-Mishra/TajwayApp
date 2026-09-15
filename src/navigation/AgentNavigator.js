import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/Routes';
import AgentMessagesScreen from '../screens/agent/AgentMessagesScreen';
import AgentProfileScreen from '../screens/agent/AgentProfileScreen';
import MyBookingsScreen from '../screens/agent/MyBookingsScreen';
import MarketHomeScreen from '../screens/marketplace/MarketHomeScreen';
import AadhaarVerifyScreen from '../screens/profile/AadhaarVerifyScreen';
import ManageDriversScreen from '../screens/profile/ManageDriversScreen';
import ManageVehiclesScreen from '../screens/profile/ManageVehiclesScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import {Colors, Typography} from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({label, focused, isCenter}) => {
  if (isCenter) {
    return (
      <View style={styles.plusOuter}>
        <Text style={styles.plus}>+</Text>
      </View>
    );
  }

  const icons = {
    Market: '⌂',
    'My Bookings': '▦',
    Chat: '💬',
    Profile: '👤',
  };

  return (
    <View style={styles.tabItem}>
      {focused ? (
        <View style={styles.activeLine} />
      ) : (
        <View style={styles.lineSpacer} />
      )}
      <Text style={[styles.icon, focused && styles.iconOn]}>
        {icons[label] || '•'}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelOn]}>{label}</Text>
    </View>
  );
};

const marketTabIcon = ({focused}) => (
  <TabIcon label="Market" focused={focused} />
);
const bookingsTabIcon = ({focused}) => (
  <TabIcon label="My Bookings" focused={focused} />
);
const addTabIcon = () => <TabIcon label="Add" isCenter />;
const chatTabIcon = ({focused}) => <TabIcon label="Chat" focused={focused} />;
const profileTabIcon = ({focused}) => (
  <TabIcon label="Profile" focused={focused} />
);

const PlaceholderAdd = ({navigation}) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderTitle}>Create Booking</Text>
    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AGENT_HOME)}>
      <Text style={styles.placeholderLink}>Close</Text>
    </TouchableOpacity>
  </View>
);

const AgentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name={ROUTES.AGENT_HOME}
        component={MarketHomeScreen}
        options={{tabBarIcon: marketTabIcon}}
      />
      <Tab.Screen
        name={ROUTES.AGENT_BOOKINGS}
        component={MyBookingsScreen}
        options={{tabBarIcon: bookingsTabIcon}}
      />
      <Tab.Screen
        name={ROUTES.AGENT_CREATE_BOOKING}
        component={PlaceholderAdd}
        options={{tabBarIcon: addTabIcon}}
      />
      <Tab.Screen
        name={ROUTES.AGENT_MESSAGES}
        component={AgentMessagesScreen}
        options={{tabBarIcon: chatTabIcon}}
      />
      <Tab.Screen
        name={ROUTES.AGENT_PROFILE}
        component={AgentProfileScreen}
        options={{tabBarIcon: profileTabIcon}}
      />
    </Tab.Navigator>
  );
};

/**
 * Agent stack — tabs + profile setup screens.
 */
const AgentNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ROUTES.AGENT_TABS} component={AgentTabs} />
      <Stack.Screen name={ROUTES.PERSONAL_INFO} component={PersonalInfoScreen} />
      <Stack.Screen
        name={ROUTES.AADHAAR_VERIFY}
        component={AadhaarVerifyScreen}
      />
      <Stack.Screen
        name={ROUTES.MANAGE_VEHICLES}
        component={ManageVehiclesScreen}
      />
      <Stack.Screen
        name={ROUTES.MANAGE_DRIVERS}
        component={ManageDriversScreen}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderLight,
    borderTopWidth: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  activeLine: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: 4,
  },
  lineSpacer: {
    height: 7,
  },
  icon: {
    fontSize: 18,
    color: Colors.tabInactive,
  },
  iconOn: {
    color: Colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: Colors.tabInactive,
    fontWeight: Typography.fontWeights.medium,
  },
  tabLabelOn: {
    color: Colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  plusOuter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.plusButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 4,
    borderColor: Colors.surface,
  },
  plus: {
    color: Colors.textInverse,
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textNavy,
    marginBottom: 12,
  },
  placeholderLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default AgentNavigator;
