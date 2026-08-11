import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '../ui/AppText';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
import GlassCard from '../ui/GlassCard';
import AnimatedPressable from '../ui/AnimatedPressable';
import AmbientBackground from '../ui/AmbientBackground';
import Icon from '../Icon';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';

type DeviceRoleOption = {
  role: number;
  label: string;
  description: string;
};

const ROLE_OPTIONS: DeviceRoleOption[] = [
  { role: 2, label: 'Gateway', description: 'First device in this mesh' },
  { role: 3, label: 'Sub-Gateway', description: 'Extends an existing gateway' },
  { role: 4, label: 'Node', description: 'End device in the mesh' },
];

type AreaSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (payload: { meshId: string; deviceRole: number }) => void;
};

const RoleChip: React.FC<{
  label: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onPress?: () => void;
}> = ({ label, description, selected, disabled, onPress }) => (
  <AnimatedPressable
    style={[
      styles.chip,
      selected && styles.chipSelected,
      disabled && styles.chipDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    pressScale={0.97}
    enforceTouchTarget={false}
  >
    <AppText variant="bodyStrong" color={selected ? colors.primary : colors.textPrimary}>
      {label}
    </AppText>
    <AppText variant="caption" color={selected ? colors.primary : colors.textTertiary}>
      {description}
    </AppText>
  </AnimatedPressable>
);

const AreaSelectionModal: React.FC<AreaSelectionModalProps> = ({ visible, onClose, onConfirm }) => {
  const [meshId, setMeshId] = useState('');
  const [deviceRole, setDeviceRole] = useState<number>(1);

  useEffect(() => {
    const hasMeshValue = meshId.trim().length > 0;
    if (hasMeshValue && deviceRole === 1) {
      setDeviceRole(2);
    } else if (!hasMeshValue) {
      setDeviceRole(1);
    }
  }, [meshId, deviceRole]);

  const hasMesh = meshId.trim().length > 0;

  const resetState = () => {
    setMeshId('');
    setDeviceRole(1);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm({ meshId: meshId.trim(), deviceRole });
    resetState();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <AmbientBackground />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <AnimatedPressable onPress={handleClose} pressScale={0.9} style={styles.closeBtn}>
              <Icon name="close" width={22} height={22} color={colors.textSecondary} />
            </AnimatedPressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AppText variant="h1" style={styles.title}>
              Installing Location
            </AppText>
            <AppText variant="bodyLg" color={colors.textSecondary} style={styles.subtitle}>
              Select or enter a mesh ID for this device
            </AppText>

            <GlassCard variant="soft" sheen={false} style={styles.formCard}>
              <TextField
                icon="map"
                label="Mesh ID"
                placeholder="e.g. living-room-mesh-01"
                value={meshId}
                onChangeText={setMeshId}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                hint={
                  <AppText variant="caption" color={colors.textTertiary} style={styles.helperText}>
                    Leave empty to install as an independent device
                  </AppText>
                }
              />

              <AppText variant="title" style={styles.sectionTitle}>
                Device Role
              </AppText>

              {hasMesh ? (
                <View style={styles.chipRow}>
                  {ROLE_OPTIONS.map(option => (
                    <RoleChip
                      key={option.role}
                      label={option.label}
                      description={option.description}
                      selected={deviceRole === option.role}
                      onPress={() => setDeviceRole(option.role)}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.chipRow}>
                  <RoleChip
                    label="Independent"
                    description="Standalone device, no mesh"
                    selected
                    disabled
                  />
                </View>
              )}
            </GlassCard>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Continue" rightIcon="arrow-next" onPress={handleConfirm} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxs,
    alignItems: 'flex-start',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  formCard: {
    padding: spacing.lg,
  },
  helperText: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minWidth: '45%',
    flex: 1,
    gap: spacing.xxs,
  },
  chipSelected: {
    backgroundColor: withAlpha(colors.primary, 0.18),
  },
  chipDisabled: {
    opacity: 0.95,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});

export default AreaSelectionModal;
