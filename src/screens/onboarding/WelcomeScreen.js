import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import BrandHeader from '../../components/brand/BrandHeader';
import PrimaryButton from '../../components/brand/PrimaryButton';
import LanguageSelectModal from '../../components/profile/LanguageSelectModal';
import {ROUTES} from '../../constants/Routes';
import {setOnboarded} from '../../redux/slices/authSlice';
import {Colors, Spacing} from '../../theme';

/**
 * Welcome — Login / Sign Up / Change Language (screenshot 2).
 */
const WelcomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('en');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const goPhone = mode => {
    dispatch(setOnboarded(true));
    navigation.navigate(ROUTES.PHONE_LOGIN, {mode});
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16},
      ]}>
      <BrandHeader />

      <View style={styles.heroWrap}>
        <View style={styles.heroCircle}>
          <View style={styles.heroHead} />
          <View style={styles.heroBody}>
            <View style={styles.tie} />
          </View>
          <View style={styles.arms}>
            <View style={styles.arm} />
            <View style={styles.arm} />
          </View>
        </View>
        <Text style={styles.heroCaption}>Trusted B2B partners</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.row}>
          <PrimaryButton
            title="Log in"
            variant="secondary"
            fullWidth={false}
            style={styles.halfBtn}
            onPress={() => goPhone('login')}
          />
          <PrimaryButton
            title="Sign Up"
            fullWidth={false}
            style={styles.halfBtn}
            onPress={() => goPhone('signup')}
          />
        </View>
        <PrimaryButton
          title="Change Language"
          onPress={() => setLanguageModalVisible(true)}
          style={styles.langBtn}
        />
      </View>

      <LanguageSelectModal
        visible={languageModalVisible}
        selected={language}
        onClose={() => setLanguageModalVisible(false)}
        onSave={setLanguage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCircle: {
    width: 220,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroHead: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#C68642',
    marginBottom: 8,
  },
  heroBody: {
    width: 140,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    ...{
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
  },
  tie: {
    marginTop: 16,
    width: 18,
    height: 70,
    backgroundColor: '#8B1E2D',
    borderRadius: 4,
  },
  arms: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: 190,
    justifyContent: 'space-between',
  },
  arm: {
    width: 36,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  heroCaption: {
    marginTop: Spacing.base,
    color: Colors.textMuted,
    fontSize: 13,
  },
  actions: {
    paddingHorizontal: Spacing.screenPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  halfBtn: {
    width: '48%',
  },
  langBtn: {
    marginTop: 0,
  },
});

export default WelcomeScreen;
