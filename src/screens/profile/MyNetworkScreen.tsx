import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import AddNetworkContactModal from '../../components/profile/AddNetworkContactModal';
import {mockNetworkContacts} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatInviteStatus = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  return `Invitation Sent On ${MONTHS[now.getMonth()]} ${day}, ${now.getFullYear()}`;
};

const NetworkSlidersIcon = () => (
  <View style={styles.sliders}>
    <View style={styles.sliderLine}>
      <View style={[styles.sliderKnob, styles.sliderKnobRight]} />
    </View>
    <View style={styles.sliderLineSecond}>
      <View style={[styles.sliderKnob, styles.sliderKnobLeft]} />
    </View>
    <View style={styles.sliderLineThird}>
      <View style={[styles.sliderKnob, styles.sliderKnobMid]} />
    </View>
  </View>
);

const NetworkRow = ({item}) => (
  <View style={styles.row}>
    <View style={styles.rowContent}>
      {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
      {item.phones.map(phone => (
        <Text key={phone} style={styles.phone}>
          {phone}
        </Text>
      ))}
      <Text style={styles.status}>{item.status}</Text>
    </View>
    <TouchableOpacity
      style={styles.actionBtn}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Manage ${item.name || 'contact'}`}>
      <NetworkSlidersIcon />
    </TouchableOpacity>
  </View>
);

/**
 * My Network — contact list with FAB (screenshot match).
 */
const MyNetworkScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState(mockNetworkContacts);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddContact = contact => {
    const nextContact = {
      id: `net-${Date.now()}`,
      name: contact.name,
      phones: contact.phone ? [contact.phone] : [],
      status: formatInviteStatus(),
      company: contact.company,
      tripType: contact.tripType,
      vehicleType: contact.vehicleType,
    };
    setContacts(prev => [nextContact, ...prev]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={Colors.textNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Network</Text>
        <View style={styles.headerBtn} />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({item}) => <NetworkRow item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 88},
        ]}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 20}]}
        activeOpacity={0.9}
        onPress={() => setSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Add to network">
        <Ionicons name="add" size={32} color={Colors.onPrimary} />
      </TouchableOpacity>

      <AddNetworkContactModal
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAddContact}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  list: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  rowContent: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  phone: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  status: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliders: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLine: {
    width: 18,
    height: 2,
    backgroundColor: Colors.textSlate,
    borderRadius: 1,
    justifyContent: 'center',
  },
  sliderLineSecond: {
    width: 18,
    height: 2,
    backgroundColor: Colors.textSlate,
    borderRadius: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  sliderLineThird: {
    width: 18,
    height: 2,
    backgroundColor: Colors.textSlate,
    borderRadius: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  sliderKnob: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSlate,
    position: 'absolute',
    top: -2,
  },
  sliderKnobRight: {
    right: 1,
  },
  sliderKnobLeft: {
    left: 1,
  },
  sliderKnobMid: {
    left: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.screenPadding,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MyNetworkScreen;
