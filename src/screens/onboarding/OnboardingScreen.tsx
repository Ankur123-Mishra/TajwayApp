import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppButton} from '../../components/common';
import {APP_NAME} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {setOnboarded} from '../../redux/slices/authSlice';
import {Colors, Dimensions, Spacing, Typography} from '../../theme';

const SLIDES = [
  {
    title: 'Connect travel demand with fleet supply',
    body: 'Post B2B taxi requirements and receive quotes from verified drivers and fleet owners.',
  },
  {
    title: 'One marketplace for agents, drivers & owners',
    body: 'Role-based workflows keep booking, dispatch, and fleet operations clear and professional.',
  },
  {
    title: 'Built for reliable business travel',
    body: 'Track bookings, manage vehicles, and collaborate without phone-tag chaos.',
  },
];

const OnboardingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    dispatch(setOnboarded(true));
    navigation.replace(ROUTES.ROLE_SELECT);
  };

  const onNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setIndex(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{APP_NAME}</Text>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroMark}>TW</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={`dot-${i}`}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <AppButton title={isLast ? 'Get Started' : 'Continue'} onPress={onNext} />
        {!isLast ? (
          <AppButton
            title="Skip"
            variant="ghost"
            onPress={finish}
            style={styles.skip}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.xl,
  },
  brand: {
    ...Typography.label,
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    width: 96,
    height: 96,
    borderRadius: Dimensions.borderRadius.xl,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  heroMark: {
    ...Typography.h1,
    color: Colors.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderStrong,
    marginRight: Spacing.sm,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
  },
  footer: {
    gap: Spacing.sm,
  },
  skip: {
    marginTop: Spacing.xs,
  },
});

export default OnboardingScreen;
