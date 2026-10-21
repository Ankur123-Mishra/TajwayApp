import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import BannerHeader from '../../components/common/BannerHeader';
import Images from '../../constants/Images';
import {Colors, Spacing, Typography} from '../../theme';
import {useResponsiveStyles} from '../../hooks';

const ONGOING_CONTESTS = [
  {
    id: 'ongoing-1',
    title: 'Weekend Ride Bonanza',
    description: 'Complete 20 rides this weekend and get an extra ₹1,000 bonus!',
    reward: '₹1,000',
    timingLabel: 'Ends in',
    timingValue: '2d 14h 30m',
    targetRides: 20,
  },
  {
    id: 'ongoing-2',
    title: 'City Ride Challenge',
    description: 'Complete 20 rides this weekend and get an extra ₹1,000 bonus!',
    reward: '₹4,000',
    timingLabel: 'Ends in',
    timingValue: '2d 14h 30m',
    targetRides: 15,
  },
];

const UPCOMING_CONTESTS = [
  {
    id: 'upcoming-1',
    title: 'Long Ride Champion',
    description: 'Complete 20 rides this weekend and get an extra ₹1,000 bonus!',
    reward: 'Special',
    timingLabel: 'Starts in',
    timingValue: '2d 14h 30m',
    targetRides: 20,
  },
  {
    id: 'upcoming-2',
    title: 'Night Ride Special',
    description: 'Complete 20 rides this weekend and get an extra ₹1,000 bonus!',
    reward: '₹1,200',
    timingLabel: 'Starts in',
    timingValue: '2d 14h 30m',
    targetRides: 20,
  },
];

const ContestCard = ({item, status, statusTone}) => {
  const styles = useResponsiveStyles(baseStyles);
  const isUpcoming = statusTone === 'upcoming';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.cardCopy}>
          <View
            style={[
              styles.statusChip,
              isUpcoming ? styles.statusChipUpcoming : styles.statusChipOngoing,
            ]}>
            <Text
              style={[
                styles.statusText,
                isUpcoming
                  ? styles.statusTextUpcoming
                  : styles.statusTextOngoing,
              ]}>
              {status}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <View style={styles.rewardBox}>
          <Text style={styles.rewardLabel}>Reward</Text>
          <View style={styles.rewardValueRow}>
            <Text style={styles.rewardValue} numberOfLines={1}>
              {item.reward}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={Colors.textPrimary}
            />
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.metaBlock}>
          <View style={styles.metaIconWrap}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
          </View>
          <View style={styles.metaCopy}>
            <Text style={styles.metaLabel}>{item.timingLabel}</Text>
            <Text style={styles.metaValue}>{item.timingValue}</Text>
          </View>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaBlock}>
          <View style={styles.metaIconWrap}>
            <MaterialDesignIcons
              name="bullseye-arrow"
              size={16}
              color={Colors.primary}
            />
          </View>
          <View style={styles.metaCopy}>
            <Text style={styles.metaLabel}>Target Rides</Text>
            <Text style={styles.metaValue}>{item.targetRides}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Offers & Contest — promo banner, ongoing / upcoming contest cards.
 */
const OffersContestScreen = ({navigation}) => {
  const styles = useResponsiveStyles(baseStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BannerHeader
        title="Offers & Contest"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.bannerWrap}>
          <Image
            source={Images.offerContest}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.sectionTitle}>Ongoing Contests</Text>
        {ONGOING_CONTESTS.map(item => (
          <ContestCard
            key={item.id}
            item={item}
            status="Ongoing"
            statusTone="ongoing"
          />
        ))}

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Upcoming Contests
        </Text>
        {UPCOMING_CONTESTS.map(item => (
          <ContestCard
            key={item.id}
            item={item}
            status="Ongoing"
            statusTone="upcoming"
          />
        ))}

        <View style={styles.stayTuned}>
          <View style={styles.megaphoneWrap}>
            <MaterialDesignIcons
              name="bullhorn-outline"
              size={22}
              color={Colors.primaryDark}
            />
          </View>
          <View style={styles.stayTunedCopy}>
            <Text style={styles.stayTunedTitle}>Stay Tuned!</Text>
            <Text style={styles.stayTunedText}>
              More contests and rewards are coming your way.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 12,
  },
  bannerWrap: {
    width: '100%',
    aspectRatio: 512 / 219,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  statusChip: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  statusChipOngoing: {
    backgroundColor: '#E5F6EA',
  },
  statusChipUpcoming: {
    backgroundColor: '#E7F0FF',
  },
  statusText: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.semibold,
  },
  statusTextOngoing: {
    color: '#3EAE62',
  },
  statusTextUpcoming: {
    color: '#4C8DFF',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
  rewardBox: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 86,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rewardLabel: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  rewardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F3',
  },
  metaBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metaCopy: {
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
  metaValue: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E6E8EC',
    marginHorizontal: 10,
  },
  stayTuned: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  megaphoneWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stayTunedCopy: {
    flex: 1,
    minWidth: 0,
  },
  stayTunedTitle: {
    fontSize: 14,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  stayTunedText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: Typography.fontWeights.regular,
    color: Colors.textMuted,
  },
};

export default OffersContestScreen;
