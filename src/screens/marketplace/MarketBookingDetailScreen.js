import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import BackButton from '../../components/brand/BackButton';
import {ROUTES} from '../../constants/Routes';
import {Colors, Spacing, Typography} from '../../theme';

const VEHICLE_IMAGES = {
  innova: require('../../assets/images/car_innova.png'),
  ertiga: require('../../assets/images/car_innova.png'),
  sedan: require('../../assets/images/car_innova.png'),
};

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}`;

const DashedDivider = () => (
  <View style={styles.dashRow}>
    {Array.from({length: 28}).map((_, i) => (
      <View key={i} style={styles.dashSeg} />
    ))}
  </View>
);

const DetailField = ({label, value}) => {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
};

const PriceCard = ({amount, label, amountColor}) => (
  <View style={styles.priceCard}>
    <Text style={[styles.priceAmt, amountColor ? {color: amountColor} : null]}>
      {formatInr(amount)}
    </Text>
    <Text style={styles.priceLabel}>{label}</Text>
  </View>
);

const StarRow = ({rating = 5}) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const filled = rating >= i;
    stars.push(
      <Text
        key={i}
        style={[styles.star, filled ? styles.starOn : styles.starOff]}>
        ★
      </Text>,
    );
  }
  return <View style={styles.starRow}>{stars}</View>;
};

/**
 * Market booking detail — matches Tajway trip detail screenshots.
 */
const MarketBookingDetailScreen = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const booking = route?.params?.booking || {};

  const {
    when = 'Today',
    time = '10:00 AM',
    duration,
    from = '',
    to,
    pickupFrom,
    dropTo,
    tripType = 'One Way',
    vehicle = 'Sedan',
    vehicleType = 'sedan',
    notes,
    extras,
    bookingType = 'Public Booking',
    secured = true,
    totalAmount,
    driverEarning,
    commission,
    reviews = 0,
    rating = 5,
    partnerHidden = true,
    name = 'Travel Partner',
    company,
  } = booking;

  const isOneWay = String(tripType).toLowerCase().includes('one');
  const hasQuote = totalAmount == null || totalAmount === '';
  const schedule = duration
    ? `${when} @ ${time} (${duration})`
    : `${when} @ ${time}`;
  const routeTitle = isOneWay && to ? `${from} - ${to}` : from;
  const pickupValue = pickupFrom || from;
  const dropValue = dropTo || to;
  const carImage = VEHICLE_IMAGES[vehicleType] || VEHICLE_IMAGES.sedan;

  const handleChat = () => {
    navigation.navigate(ROUTES.CHAT, {chatId: 'chat-001'});
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 4}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerCenter} pointerEvents="none">
          <Text style={styles.tripType}>{tripType}</Text>
          <Text style={styles.schedule}>{schedule}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}>
        {secured ? (
          <View style={styles.securedRow}>
            <View style={styles.securedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={styles.securedText}>Secured</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.vehicleRow}>
          <Image source={carImage} style={styles.carImage} resizeMode="contain" />
          <View style={styles.vehiclePill}>
            <Text style={styles.vehiclePillText}>{vehicle}</Text>
          </View>
        </View>

        <View style={styles.routeTitleRow}>
          <Text style={styles.routeTitle}>{routeTitle}</Text>
          {/* <View style={styles.navIcon}>
            <Ionicons name="navigate" size={12} color="#fff" />
          </View> */}
        </View>

        <DetailField label="Pick Up from" value={pickupValue} />
        {isOneWay ? (
          <DetailField label="Drop To" value={dropValue} />
        ) : (
          <DetailField label="Trip Details" value={notes} />
        )}
        {isOneWay && notes ? (
          <DetailField label="Trip Details" value={notes} />
        ) : null}
        <DetailField label="Extra Requirements" value={extras} />
        <DetailField label="Type" value={bookingType} />

        <DashedDivider />

        {hasQuote ? (
          <View style={styles.quoteBlock}>
            <Text style={styles.quoteText}>Quote Best Price</Text>
            <Text style={styles.quoteHint}>Total Amount</Text>
          </View>
        ) : (
          <View style={styles.priceRow}>
            <PriceCard amount={totalAmount} label="Total Amount" />
            <PriceCard
              amount={driverEarning}
              label="Driver's Earning"
              amountColor={Colors.error}
            />
            <PriceCard amount={commission} label="Commission" />
          </View>
        )}

        <DashedDivider />

        <View style={styles.footerCard}>
          <View style={styles.partnerRow}>
            {partnerHidden ? (
              <View style={styles.hiddenCol}>
                <Ionicons
                  name="lock-closed"
                  size={22}
                  color={Colors.textPrimary}
                />
                <Text style={styles.hiddenText}>Hidden</Text>
              </View>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {String(name)
                    .split(' ')
                    .slice(0, 2)
                    .map(p => p[0])
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.partnerInfo}>
              {partnerHidden ? (
                <View style={styles.blurCol}>
                  <View style={[styles.blurBar, styles.blurWide]} />
                  <View style={[styles.blurBar, styles.blurNarrow]} />
                </View>
              ) : (
                <>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {name}
                  </Text>
                  {company ? (
                    <Text style={styles.partnerCompany} numberOfLines={1}>
                      {company}
                    </Text>
                  ) : null}
                </>
              )}
              <View style={styles.reviewRow}>
                <StarRow rating={rating} />
                <Text style={styles.reviewCount}>({reviews} Reviews)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.chatBtn}
            activeOpacity={0.85}
            onPress={handleChat}
            accessibilityRole="button"
            accessibilityLabel="Chat">
            <Ionicons name="chatbubble" size={18} color="#fff" />
            <Text style={styles.chatBtnText}>CHAT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  headerSpacer: {
    width: 40,
  },
  tripType: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeights.regular,
  },
  schedule: {
    marginTop: 4,
    fontSize: 15,
    color: Colors.textNavy,
    fontWeight: Typography.fontWeights.semibold,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
  },
  securedRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  securedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secured,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  securedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: Typography.fontWeights.medium,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  carImage: {
    width: 118,
    height: 70,
  },
  vehiclePill: {
    marginLeft: -6,
    backgroundColor: '#EEF0F3',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  vehiclePillText: {
    fontSize: 13,
    color: Colors.textSlate,
    fontWeight: Typography.fontWeights.medium,
  },
  routeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    flex: 1,
    fontSize: 17,
    color: Colors.textNavy,
    fontWeight: Typography.fontWeights.semibold,
    marginRight: 10,
  },
  navIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.dashedRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 13,
    color: Colors.textNavy,
    fontWeight: Typography.fontWeights.medium,
    lineHeight: 20,
  },
  dashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    overflow: 'hidden',
  },
  dashSeg: {
    width: 6,
    height: 1.5,
    backgroundColor: Colors.borderStrong,
    borderRadius: 1,
  },
  quoteBlock: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  quoteText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  quoteHint: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priceCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  priceAmt: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeights.semibold,
  },
  priceLabel: {
    marginTop: 6,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  hiddenCol: {
    width: 52,
    alignItems: 'center',
    marginRight: 10,
  },
  hiddenText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeights.medium,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textNavy,
  },
  partnerInfo: {
    flex: 1,
  },
  blurCol: {
    marginBottom: 6,
  },
  blurBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D8DCE3',
    marginBottom: 6,
  },
  blurWide: {
    width: '78%',
  },
  blurNarrow: {
    width: '52%',
  },
  partnerName: {
    fontSize: 13,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textPrimary,
  },
  partnerCompany: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    fontSize: 14,
    marginRight: 1,
  },
  starOn: {
    color: Colors.star,
  },
  starOff: {
    color: Colors.borderStrong,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: Typography.fontWeights.semibold,
    letterSpacing: 0.6,
  },
});

export default MarketBookingDetailScreen;
