import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AppText from '../ui/AppText';
import TextField from '../ui/TextField';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { durations, easings } from '../../themes/motion';

type EditNameModalProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const EditNameModal: React.FC<EditNameModalProps> = ({
  visible,
  value,
  onChangeText,
  onCancel,
  onConfirm,
}) => (
  <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
    <Animated.View
      entering={FadeIn.duration(durations.fast)}
      exiting={FadeOut.duration(durations.fast)}
      style={styles.backdropFill}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Animated.View entering={FadeIn.duration(durations.base).easing(easings.decelerate)}>
          <Pressable style={[styles.card, shadows.lg]} onPress={() => {}}>
            <AppText variant="title" align="center" style={styles.title}>
              Edit
            </AppText>
            <View style={styles.inputWrap}>
              <TextField
                value={value}
                onChangeText={onChangeText}
                placeholder="Enter name"
                autoFocus
                selectTextOnFocus
                containerStyle={styles.field}
              />
            </View>
            <View style={styles.actions}>
              <AnimatedPressable style={styles.actionBtn} onPress={onCancel} pressScale={0.97}>
                <AppText variant="bodyLg" color={colors.textPrimary}>
                  Cancel
                </AppText>
              </AnimatedPressable>
              <View style={styles.divider} />
              <AnimatedPressable style={styles.actionBtn} onPress={onConfirm} pressScale={0.97}>
                <AppText variant="bodyLgStrong" color={colors.link}>
                  Sure
                </AppText>
              </AnimatedPressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Animated.View>
  </Modal>
);

const styles = StyleSheet.create({
  backdropFill: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrimStrong,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    minWidth: 300,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xxl,
    overflow: 'hidden',
  },
  title: {
    paddingTop: spacing.lg,
  },
  inputWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});

export default EditNameModal;
