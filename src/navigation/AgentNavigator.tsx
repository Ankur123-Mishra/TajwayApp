import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AgentTabBar from '../components/navigation/AgentTabBar';
import {ROUTES} from '../constants/Routes';
import AgentMessagesScreen from '../screens/agent/AgentMessagesScreen';
import AgentProfileScreen from '../screens/agent/AgentProfileScreen';
import ChatDetailsScreen from '../screens/agent/ChatDetailsScreen';
import MyBookingsScreen from '../screens/agent/MyBookingsScreen';
import LocationSelectScreen from '../screens/agent/LocationSelectScreen';
import PostBookingScreen from '../screens/agent/PostBookingScreen';
import PostFreeVehicleScreen from '../screens/agent/PostFreeVehicleScreen';
import MarketBookingDetailScreen from '../screens/marketplace/MarketBookingDetailScreen';
import MarketHomeScreen from '../screens/marketplace/MarketHomeScreen';
import RouteAlertSetupScreen from '../screens/marketplace/RouteAlertSetupScreen';
import AadhaarVerifyScreen from '../screens/profile/AadhaarVerifyScreen';
import ManageDriversScreen from '../screens/profile/ManageDriversScreen';
import ManageVehiclesScreen from '../screens/profile/ManageVehiclesScreen';
import MyNetworkScreen from '../screens/profile/MyNetworkScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import TransactionsScreen from '../screens/profile/TransactionsScreen';
import BecomeVerifiedSupplierScreen from '../screens/profile/BecomeVerifiedSupplierScreen';
import VerifiedSupplierScreen from '../screens/profile/VerifiedSupplierScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const EmptyTab = () => <View />;

const renderAgentTabBar = (onNewBooking, onFreeVehicle, props) => (
  <AgentTabBar
    {...props}
    onNewBooking={onNewBooking}
    onFreeVehicle={onFreeVehicle}
  />
);

const AgentTabs = ({navigation}) => {
  const goToPostBooking = () => navigation.navigate(ROUTES.POST_BOOKING);
  const goToFreeVehicle = () => navigation.navigate(ROUTES.POST_FREE_VEHICLE);

  return (
    <Tab.Navigator
      tabBar={props =>
        renderAgentTabBar(goToPostBooking, goToFreeVehicle, props)
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name={ROUTES.AGENT_HOME} component={MarketHomeScreen} />
      <Tab.Screen name={ROUTES.AGENT_BOOKINGS} component={MyBookingsScreen} />
      <Tab.Screen
        name={ROUTES.AGENT_CREATE_BOOKING}
        component={EmptyTab}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name={ROUTES.AGENT_MESSAGES}
        component={AgentMessagesScreen}
      />
      <Tab.Screen name={ROUTES.AGENT_PROFILE} component={AgentProfileScreen} />
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
      <Stack.Screen name={ROUTES.POST_BOOKING} component={PostBookingScreen} />
      <Stack.Screen
        name={ROUTES.POST_FREE_VEHICLE}
        component={PostFreeVehicleScreen}
      />
      <Stack.Screen
        name={ROUTES.LOCATION_SELECT}
        component={LocationSelectScreen}
      />
      <Stack.Screen
        name={ROUTES.ROUTE_ALERT_SETUP}
        component={RouteAlertSetupScreen}
      />
      <Stack.Screen
        name={ROUTES.MARKET_BOOKING_DETAIL}
        component={MarketBookingDetailScreen}
      />
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
      <Stack.Screen name={ROUTES.MY_NETWORK} component={MyNetworkScreen} />
      <Stack.Screen
        name={ROUTES.PAYMENT_METHODS}
        component={PaymentMethodsScreen}
      />
      <Stack.Screen
        name={ROUTES.TRANSACTIONS}
        component={TransactionsScreen}
      />
      <Stack.Screen
        name={ROUTES.VERIFIED_SUPPLIER}
        component={VerifiedSupplierScreen}
      />
      <Stack.Screen
        name={ROUTES.BECOME_VERIFIED_SUPPLIER}
        component={BecomeVerifiedSupplierScreen}
      />
      <Stack.Screen name={ROUTES.CHAT} component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AgentNavigator;
