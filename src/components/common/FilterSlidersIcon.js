import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../theme';

const FilterSlidersIcon = () => (
  <>
    <View style={styles.sliderLine}>
      <View style={[styles.sliderKnob, styles.sliderKnobRight]} />
    </View>
    <View style={styles.sliderLineSecond}>
      <View style={[styles.sliderKnob, styles.sliderKnobLeft]} />
    </View>
  </>
);

const styles = StyleSheet.create({
  sliderLine: {
    width: 18,
    height: 2,
    backgroundColor: Colors.filterRed,
    borderRadius: 1,
    justifyContent: 'center',
  },
  sliderLineSecond: {
    width: 18,
    height: 2,
    backgroundColor: Colors.filterRed,
    borderRadius: 1,
    justifyContent: 'center',
    marginTop: 6,
  },
  sliderKnob: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.filterRed,
    position: 'absolute',
    top: -2.5,
  },
  sliderKnobRight: {
    right: 1,
  },
  sliderKnobLeft: {
    left: 1,
  },
});

export default FilterSlidersIcon;
