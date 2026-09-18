import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Typography} from '../../theme';

const VEHICLE_IMAGES = {
  innova: require('../../assets/images/car_innova.png'),
  ertiga: require('../../assets/images/car_innova.png'),
  sedan: require('../../assets/images/car_innova.png'),
};

const VEHICLE_SPECS = {
  innova: 'AC • 7 Seater • Diesel',
  ertiga: 'AC • 6 Seater • Petrol',
  sedan: 'AC • 4 Seater • Petrol',
};

const formatInr = value => `₹${Number(value).toLocaleString('en-IN')}`;

const DottedLine = ({withArrow}) => (
  <View style={styles.dotLine}>
    {Array.from({length: 7}).map((_, i) => (
      <View key={i} style={styles.dot} />
    ))}
    {withArrow ? <View style={styles.arrow} /> : null}
  </View>
);

const MapPin = ({size = 14}) => (
  <View style={[styles.pinWrap, {width: size, height: size + 4}]}>
    <View
      style={[
        styles.pinHead,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <View style={styles.pinInner} />
    </View>
    <View style={styles.pinTip} />
  </View>
);

const VehicleThumb = ({type = 'sedan'}) => (
  <Image
    source={VEHICLE_IMAGES[type] || VEHICLE_IMAGES.sedan}
    style={styles.carImage}
    resizeMode="contain"
  />
);

const StarRow = ({rating = 5}) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    stars.push(
      <View key={i} style={styles.starSlot}>
        <Text style={styles.starEmpty}>★</Text>
        {filled ? (
          <Text style={styles.starFill}>★</Text>
        ) : half ? (
          <View style={styles.starHalfClip}>
            <Text style={styles.starFill}>★</Text>
          </View>
        ) : null}
      </View>,
    );
  }
  return <View style={styles.starRow}>{stars}</View>;
};

const PriceBox = ({amount, label, hint, amountColor}) => (
  <View style={styles.priceBox}>
    <Text style={[styles.priceAmt, amountColor && {color: amountColor}]}>
      {formatInr(amount)}
    </Text>
    <Text style={styles.priceLabel}>{label}</Text>
    {hint ? <Text style={styles.priceHint}>{hint}</Text> : null}
  </View>
);

/**
 * Market trip request card — matches Tajway marketplace booking card.
 */
const MarketBookingCard = ({
  name = 'Travel Partner',
  company,
  when = 'Tomorrow',
  time = '07:00 AM',
  from = 'Gurugram',
  to,
  tripType = 'Round Trip',
  vehicle = 'Sedan',
  vehicleType = 'sedan',
  vehicleSpecs,
  notes,
  extras,
  extrasChecked = false,
  totalAmount,
  driverEarning,
  commission,
  negotiable = false,
  reviews = 0,
  rating = 5,
  partnerHidden = false,
  secured = true,
  avatarInitials,
  avatarSource,
  onPress,
  onQuote,
  onChat,
  onContact,
  onMenu,
}) => {
  const isOneWay = String(tripType).toLowerCase().includes('one');
  const initials =
    avatarInitials ||
    String(name)
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  const hasQuote = totalAmount == null || totalAmount === '';
  const specs = vehicleSpecs || VEHICLE_SPECS[vehicleType] || VEHICLE_SPECS.sedan;
  const handleContact = onContact || onChat;

  const stopAndRun = handler => e => {
    e?.stopPropagation?.();
    handler?.();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel="Open booking details">
      <View style={styles.topRow}>
        <Text style={styles.bagIcon}>💼</Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {secured ? (
          <View style={styles.secured}>
            <View style={styles.shield}>
              <Text style={styles.shieldTick}>✓</Text>
            </View>
            <Text style={styles.securedText}>Secured</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.menuBtn}
          hitSlop={8}
          activeOpacity={0.7}
          onPress={stopAndRun(onMenu)}
          accessibilityRole="button"
          accessibilityLabel="More options">
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.when}>
        {when} @ <Text style={styles.time}>{time}</Text>
      </Text>

      {isOneWay ? (
        <View style={styles.routeRow}>
          <MapPin />
          <Text style={[styles.city, styles.cityPad]} numberOfLines={1}>
            {from}
          </Text>
          <DottedLine withArrow />
          <MapPin />
          <Text style={[styles.city, styles.cityPad]} numberOfLines={1}>
            {to}
          </Text>
        </View>
      ) : (
        <View style={styles.routeRow}>
          <MapPin />
          <Text style={[styles.city, styles.cityPad]}>{from}</Text>
          <View style={styles.roundPill}>
            <Text style={styles.roundText}>{tripType}</Text>
          </View>
        </View>
      )}

      <View style={styles.vehicleRow}>
        <VehicleThumb type={vehicleType} />
        <View style={styles.vehicleCopy}>
          <Text style={styles.vehicle}>{vehicle}</Text>
          <Text style={styles.vehicleSpecs}>{specs}</Text>
        </View>
      </View>

      {notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.metaLine}>
            <Text style={styles.metaLabel}>Trip Notes </Text>
            <Text style={styles.metaValue}>{notes}</Text>
          </Text>
        </View>
      ) : null}

      {extras ? (
        <Text style={styles.metaLine}>
          <Text style={styles.metaLabel}>Extra Requirements </Text>
          <Text style={styles.metaValue}>{extras}</Text>
          {extrasChecked ? <Text style={styles.check}> ✓</Text> : null}
        </Text>
      ) : null}

      {hasQuote ? (
        <>
          <View style={styles.dash} />
          <TouchableOpacity
            onPress={stopAndRun(onQuote)}
            activeOpacity={0.8}
            style={styles.quoteWrap}>
            <Text style={styles.quote}>Quote Best Price</Text>
            <Text style={styles.totalHint}>Total Amount</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.priceRow}>
          <PriceBox
            amount={totalAmount}
            label="Total Amount"
            hint={negotiable ? '(Negotiable)' : undefined}
          />
          <PriceBox
            amount={driverEarning}
            label="Driver's Earning"
            amountColor={Colors.success}
          />
          <PriceBox
            amount={commission}
            label="Commission"
            amountColor={Colors.info}
          />
        </View>
      )}

      <View style={styles.footer}>
        {partnerHidden ? (
          <View style={styles.hiddenCol}>
            <Text style={styles.lock}>🔒</Text>
            <Text style={styles.hiddenText}>Hidden</Text>
          </View>
        ) : avatarSource ? (
          <Image source={avatarSource} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}

        <View style={styles.partnerInfo}>
          {partnerHidden ? (
            <View style={styles.blurBar} />
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

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={stopAndRun(handleContact)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Contact">
          <Text style={styles.contactIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bagIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  name: {
    flex: 1,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textPrimary,
    fontSize: 14,
    marginRight: 8,
  },
  secured: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  shield: {
    width: 16,
    height: 18,
    backgroundColor: Colors.secured,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  shieldTick: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
  },
  securedText: {
    color: Colors.secured,
    fontSize: 13,
    fontWeight: '600',
  },
  menuBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  menuDots: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '700',
    lineHeight: 20,
  },
  when: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 12,
  },
  time: {
    color: Colors.filterRed,
    fontWeight: '600',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  city: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  cityPad: {
    marginLeft: 4,
  },
  dotLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
    marginHorizontal: 1.5,
  },
  arrow: {
    width: 0,
    height: 0,
    marginLeft: 2,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.primary,
  },
  pinWrap: {
    alignItems: 'center',
  },
  pinHead: {
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  pinTip: {
    width: 0,
    height: 0,
    marginTop: -2,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E53935',
  },
  roundPill: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C5C5C5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  roundText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  carImage: {
    width: 100,
    height: 56,
    marginRight: 12,
  },
  vehicleCopy: {
    flex: 1,
  },
  vehicle: {
    fontWeight: '700',
    color: Colors.textPrimary,
    fontSize: 15,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
  metaLabel: {
    color: Colors.textMuted,
    fontWeight: '400',
  },
  metaValue: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  check: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  dash: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    marginTop: 8,
    marginBottom: 10,
  },
  quoteWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  quote: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  totalHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
    gap: 8,
  },
  priceBox: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  priceAmt: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  priceHint: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  hiddenCol: {
    alignItems: 'center',
    width: 48,
  },
  lock: {
    fontSize: 18,
  },
  hiddenText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3E4A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  blurBar: {
    height: 12,
    width: '72%',
    borderRadius: 6,
    backgroundColor: '#E8DCC4',
    marginBottom: 6,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  partnerCompany: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starSlot: {
    width: 12,
    height: 12,
    marginRight: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmpty: {
    position: 'absolute',
    color: '#D5D5D5',
    fontSize: 11,
  },
  starFill: {
    color: Colors.star,
    fontSize: 11,
  },
  starHalfClip: {
    width: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  contactBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIcon: {
    fontSize: 13,
  },
});

export default MarketBookingCard;
