import React, {useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {AppCard, ScreenHeader} from '../../components/common';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Driver availability — today / tomorrow toggles + weekly row.
 * Local state until driverSlice availability actions exist.
 */
const AvailabilityScreen = ({navigation}) => {
  // TODO: persist via driverSlice when available
  const [availableToday, setAvailableToday] = useState(true);
  const [availableTomorrow, setAvailableTomorrow] = useState(false);
  const [week, setWeek] = useState(() =>
    WEEK_DAYS.reduce((acc, day, index) => {
      acc[day] = index < 5;
      return acc;
    }, {}),
  );

  const toggleDay = day => {
    setWeek(prev => ({...prev, [day]: !prev[day]}));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Availability"
        subtitle="When you can take trips"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppCard style={styles.card}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Available Today</Text>
              <Text style={styles.toggleHint}>Accept leads for today</Text>
            </View>
            <Switch
              value={availableToday}
              onValueChange={setAvailableToday}
              trackColor={{false: Colors.borderStrong, true: Colors.primaryLight}}
              thumbColor={availableToday ? Colors.primary : Colors.surface}
            />
          </View>
          <View style={[styles.toggleRow, styles.toggleDivider]}>
            <View>
              <Text style={styles.toggleTitle}>Available Tomorrow</Text>
              <Text style={styles.toggleHint}>Plan ahead for tomorrow</Text>
            </View>
            <Switch
              value={availableTomorrow}
              onValueChange={setAvailableTomorrow}
              trackColor={{false: Colors.borderStrong, true: Colors.primaryLight}}
              thumbColor={availableTomorrow ? Colors.primary : Colors.surface}
            />
          </View>
        </AppCard>

        <Text style={styles.weekLabel}>This week</Text>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map(day => {
            const on = week[day];
            return (
              <Text
                key={day}
                onPress={() => toggleDay(day)}
                style={[styles.dayChip, on && styles.dayChipOn]}>
                {day}
              </Text>
            );
          })}
        </View>
        <Text style={styles.footnote}>
          Tap a day to mark yourself available. Sync with dispatch when
          driverSlice is connected.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.screenPadding,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleDivider: {
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  toggleTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  toggleHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  weekLabel: {
    ...Typography.h4,
    color: Colors.textNavy,
    marginBottom: Spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dayChip: {
    minWidth: 40,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Dimensions.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textSecondary,
    ...Typography.caption,
    fontWeight: '700',
  },
  dayChipOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    color: Colors.textInverse,
  },
  footnote: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.base,
  },
});

export default AvailabilityScreen;
