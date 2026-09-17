import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/brand/BackButton';
import {mockTransactions} from '../../mockData';
import {Colors, Spacing, Typography} from '../../theme';

const DATE_BOX_WIDTH = 58;
const DATE_OVERHANG = 22;

const STATUS_THEME = {
  SUCCESS: {
    dateBg: '#43A047',
    badgeBg: '#E8F5E9',
    badgeText: '#2E7D32',
  },
  FAILED: {
    dateBg: '#EF9A9A',
    badgeBg: '#FFEBEE',
    badgeText: '#C62828',
  },
  REFUNDED: {
    dateBg: '#AF9B2E',
    badgeBg: '#FFF8E1',
    badgeText: '#827717',
  },
};

const formatRupee = value => `₹${Number(value).toFixed(1)}`;

const AmountRow = ({label, value, emphasize}) => (
  <View style={styles.amountRow}>
    <Text style={[styles.amountLabel, emphasize && styles.amountLabelBold]}>
      {label}
    </Text>
    <Text style={[styles.amountValue, emphasize && styles.amountValueBold]}>
      {formatRupee(value)}
    </Text>
  </View>
);

const TransactionCard = ({item}) => {
  const theme = STATUS_THEME[item.status] || STATUS_THEME.SUCCESS;

  return (
    <View style={styles.cardOuter}>
      <View style={styles.card}>
        <View style={styles.dateAnchor}>
          <View style={[styles.dateBox, {backgroundColor: theme.dateBg}]}>
            <Text style={styles.dateDay}>{item.day}</Text>
            <Text style={styles.dateMonth}>{item.monthYear}</Text>
            <Text style={styles.dateTime}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.cardTop}>
            <Text style={styles.idLine} numberOfLines={1}>
              <Text style={styles.idText}>ID : {item.id} </Text>
              <Text style={styles.typeText}>[{item.type}]</Text>
            </Text>
            <View style={[styles.badge, {backgroundColor: theme.badgeBg}]}>
              <Text style={[styles.badgeText, {color: theme.badgeText}]}>
                {item.status}
              </Text>
            </View>
          </View>

          <AmountRow label="Booking Amount:" value={item.bookingAmount} />
          <AmountRow
            label="Commission paid by Driver:"
            value={item.commission}
          />
          <AmountRow label="Platform Charges:" value={item.platformCharges} />
          <AmountRow label="Your Earning:" value={item.earning} emphasize />
        </View>
      </View>
    </View>
  );
};

/**
 * Transactions — overlapping date ribbon matches production screenshot.
 */
const TransactionsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Transaction</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={mockTransactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TransactionCard item={item} />}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.base,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textNavy,
  },
  headerSpacer: {
    width: 40,
  },
  list: {
    paddingLeft: Spacing.screenPadding + DATE_OVERHANG,
    paddingRight: Spacing.screenPadding,
    paddingTop: 8,
  },
  cardOuter: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: DATE_BOX_WIDTH - DATE_OVERHANG + 12,
    overflow: 'visible',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateAnchor: {
    position: 'absolute',
    left: -DATE_OVERHANG,
    top: 0,
    bottom: 0,
    width: DATE_BOX_WIDTH,
    justifyContent: 'center',
    zIndex: 2,
  },
  dateBox: {
    width: DATE_BOX_WIDTH,
    borderRadius: 10,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textInverse,
    lineHeight: 24,
  },
  dateMonth: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
  dateTime: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textInverse,
  },
  details: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 6,
  },
  idLine: {
    flex: 1,
    flexShrink: 1,
  },
  idText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primary,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 0.4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  amountLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textMuted,
    paddingRight: 8,
  },
  amountLabelBold: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: 12,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textPrimary,
  },
  amountValueBold: {
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
});

export default TransactionsScreen;
