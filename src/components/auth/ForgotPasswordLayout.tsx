import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import AuthBackLink from './AuthBackLink';
import AuthIconBadge from './AuthIconBadge';
import ForgotPasswordStepper from './ForgotPasswordStepper';
import { IconName } from '../Icon';

type ForgotPasswordStep = 1 | 2 | 3;

type ForgotPasswordLayoutProps = {
  step: ForgotPasswordStep;
  icon: IconName;
  iconVariant?: 'gold' | 'blue';
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({
  step,
  icon,
  iconVariant = 'gold',
  title,
  description,
  children,
  footer,
  contentStyle,
}) => (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthBackLink />
        <AuthIconBadge icon={icon} variant={iconVariant} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.description}>{description}</View>
        <ForgotPasswordStepper currentStep={step} />
        {children}
        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    ...textFont.boldXXL,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    ...textFont.regularM,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
});

export default ForgotPasswordLayout;
