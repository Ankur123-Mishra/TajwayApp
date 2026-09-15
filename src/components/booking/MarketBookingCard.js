import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

/**
 * Market trip request card — matches Taxi Sanchalak booking card UI.
 */
const MarketBookingCard = ({
  name = 'Travel Partner',
  when = 'Tomorrow',
  time = '07:00 AM',
  from = 'Gurugram',
  tripType = 'Round Trip',
  vehicle = 'Sedan',
  notes = 'up khatouli ke ke aage 25 km aage tahsil me jana ha kam krke baps gurugram',
  extras = 'with carrier, All inclusive, Inc AC in plains, toll tax sath me',
  reviews = 333,
  secured = true,
  onQuote,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {secured ? (
          <View style={styles.secured}>
            <Text style={styles.securedIcon}>🛡</Text>
            <Text style={styles.securedText}>Secured</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.when}>
        {when} @ <Text style={styles.time}>{time}</Text>
      </Text>

      <View style={styles.routeRow}>
        <Text style={styles.city}>{from}</Text>
        <View style={styles.tripType}>
          <Text style={styles.tripIcon}>↻</Text>
          <Text style={styles.tripText}>{tripType}</Text>
        </View>
      </View>

      <View style={styles.vehicleRow}>
        <View style={styles.carThumb} />
        <Text style={styles.vehicle}>{vehicle}</Text>
      </View>

      <View style={styles.dash} />
      <Text style={styles.label}>Trip Notes</Text>
      <Text style={styles.body}>{notes}</Text>

      <View style={styles.dash} />
      <Text style={styles.label}>Extra Requirements</Text>
      <Text style={styles.body}>{extras}</Text>

      <TouchableOpacity onPress={onQuote} style={styles.quoteWrap}>
        <Text style={styles.quote}>Quote Best Price</Text>
        <Text style={styles.total}>Total Amount</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.hidden}>
          <Text style={styles.lock}>🔒</Text>
          <Text style={styles.hiddenText}>Hidden</Text>
        </View>
        <View style={styles.reviews}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.reviewCount}>({reviews} Reviews)</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Dimensions.shadow.soft,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  secured: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secured,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  securedIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  securedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  when: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  time: {
    color: Colors.filterRed,
    fontWeight: '700',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  city: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tripType: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderStrong,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tripIcon: {
    color: Colors.primary,
    marginRight: 4,
    fontWeight: '700',
  },
  tripText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  carThumb: {
    width: 48,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
    marginRight: 10,
  },
  vehicle: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dash: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  quoteWrap: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 12,
  },
  quote: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  total: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  hidden: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lock: {
    fontSize: 12,
    marginRight: 4,
  },
  hiddenText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reviews: {
    flex: 1,
    alignItems: 'center',
  },
  stars: {
    color: Colors.star,
    fontSize: 12,
    letterSpacing: 1,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  chatBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: {
    fontSize: 14,
  },
});

export default MarketBookingCard;
