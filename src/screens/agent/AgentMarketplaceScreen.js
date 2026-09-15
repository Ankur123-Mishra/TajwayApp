import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DriverCard, FilterSheet} from '../../components/booking';
import {
  AppTextInput,
  EmptyState,
  ScreenHeader,
} from '../../components/common';
import {mockDrivers} from '../../mockData';
import {Colors, Spacing} from '../../theme';

/**
 * Placeholder marketplace — browse available drivers.
 */
const AgentMarketplaceScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const drivers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockDrivers.filter(d => {
      if (q) {
        const hay = `${d.name} ${d.vehicle} ${d.city}`.toLowerCase();
        if (!hay.includes(q)) {
          return false;
        }
      }
      if (
        filters.vehicleType &&
        !(
          `${d.vehicle || ''} ${d.vehicleType || ''} ${d.vehicleModel || ''}`
        )
          .toLowerCase()
          .includes(String(filters.vehicleType).toLowerCase())
      ) {
        return false;
      }
      if (
        filters.city &&
        !(d.city || '')
          .toLowerCase()
          .includes(String(filters.city).toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [search, filters]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScreenHeader
        title="Find Drivers"
        subtitle="Marketplace"
        showBack={!!navigation.canGoBack?.()}
        onBack={() => navigation.goBack()}
        right={null}
      />

      <View style={styles.searchWrap}>
        <AppTextInput
          placeholder="Search drivers, vehicle, city…"
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.search}
        />
      </View>

      <FlatList
        data={drivers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No drivers found"
            description="Try adjusting your search or filters."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setFilters({});
            }}
          />
        }
        renderItem={({item}) => (
          <DriverCard
            driver={item}
            onViewProfile={() => {}}
            onChat={() => {}}
            onCall={() => {}}
          />
        )}
      />

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        initial={filters}
        onApply={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screenPadding,
  },
  search: {
    marginBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
});

export default AgentMarketplaceScreen;
