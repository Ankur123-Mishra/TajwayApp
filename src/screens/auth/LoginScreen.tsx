import React, {useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppButton, AppTextInput, ScreenHeader} from '../../components/common';
import {ROLE_LABELS, USER_ROLES} from '../../constants/AppConstants';
import {ROUTES} from '../../constants/Routes';
import {loginSuccess} from '../../redux/slices/authSlice';
import {AuthService} from '../../services';
import {Colors, Spacing, Typography} from '../../theme';

const LoginScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const role = route?.params?.role || USER_ROLES.AGENT;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => ROLE_LABELS[role] || 'User', [role]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const result = await AuthService.login({role, email, password});
      dispatch(loginSuccess(result));

      if (result.role === USER_ROLES.DRIVER) {
        navigation.reset({index: 0, routes: [{name: ROUTES.DRIVER_ROOT}]});
      } else if (result.role === USER_ROLES.OWNER) {
        navigation.reset({index: 0, routes: [{name: ROUTES.OWNER_ROOT}]});
      } else {
        navigation.reset({index: 0, routes: [{name: ROUTES.AGENT_ROOT}]});
      }
    } catch (error) {
      Alert.alert('Login failed', 'Unable to sign in with mock credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Sign in"
        subtitle={`${roleLabel} access`}
      />
      <View style={styles.form}>
        <Text style={styles.hint}>
          Frontend-only demo — any credentials work. Tap Continue to enter the{' '}
          {roleLabel} workspace.
        </Text>
        <AppTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@company.com"
        />
        <AppTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
        <AppButton title="Continue" onPress={onLogin} loading={loading} />
        <AppButton
          title="Back to roles"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    padding: Spacing.screenPadding,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  back: {
    marginTop: Spacing.sm,
  },
});

export default LoginScreen;
