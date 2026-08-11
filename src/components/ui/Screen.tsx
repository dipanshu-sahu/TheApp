import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import AmbientBackground from './AmbientBackground';

export interface ScreenProps {
  children?: React.ReactNode;
  edges?: Edge[];
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  /** Apply standard horizontal padding to content. Default true. */
  padded?: boolean;
  /** Render the decorative ambient glow background. Default true. */
  ambient?: boolean;
  ambientTint?: string;
  ambientTintSecondary?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: ScrollViewProps;
}

/**
 * Standard screen shell: safe-area handling, ambient background, consistent
 * padding, and optional scroll + keyboard avoidance.
 */
const Screen: React.FC<ScreenProps> = ({
  children,
  edges = ['top'],
  scroll = false,
  keyboardAvoiding = false,
  padded = true,
  ambient = true,
  ambientTint,
  ambientTintSecondary,
  background,
  style,
  contentContainerStyle,
  scrollProps,
}) => {
  const paddingStyle = padded ? styles.padded : null;

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.scrollContent, paddingStyle, contentContainerStyle]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, paddingStyle, contentContainerStyle]}>{children}</View>
  );

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: background ?? colors.bgBase }, style]}
    >
      {ambient ? (
        <AmbientBackground tint={ambientTint} tintSecondary={ambientTintSecondary} />
      ) : null}
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
});

export default Screen;
