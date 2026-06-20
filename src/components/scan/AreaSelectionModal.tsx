import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

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

const AreaSelectionModal: React.FC<AreaSelectionModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [meshId, setMeshId] = useState('');
  const [deviceRole, setDeviceRole] = useState<number>(1);

  // Auto-adjust role when meshId changes
  useEffect(() => {
    const hasMesh = meshId.trim().length > 0;
    if (hasMesh && deviceRole === 1) {
      setDeviceRole(2);
    } else if (!hasMesh) {
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} hitSlop={12}>
              <Icon name="close" width={22} height={22} fill={colors.greyLight} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Mesh Selection */}
            <Text style={styles.title}>Installing Location</Text>
            <Text style={styles.subtitle}>
              Select or enter a mesh ID for this device
            </Text>

            <TextInput
              style={styles.meshInput}
              placeholder="e.g. living-room-mesh-01"
              placeholderTextColor={colors.textGrey}
              value={meshId}
              onChangeText={setMeshId}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.helperText}>
              Leave empty to install as an independent device
            </Text>

            {/* Device Role Selection */}
            <Text style={styles.sectionTitle}>Device Role</Text>

            {hasMesh ? (
              <View style={styles.chipRow}>
                {ROLE_OPTIONS.map(option => {
                  const isSelected = deviceRole === option.role;
                  return (
                    <TouchableOpacity
                      key={option.role}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => setDeviceRole(option.role)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          isSelected && styles.chipLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.chipDescription,
                          isSelected && styles.chipDescriptionSelected,
                        ]}
                      >
                        {option.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.chipRow}>
                <View style={[styles.chip, styles.chipSelected, styles.chipDisabled]}>
                  <Text style={[styles.chipLabel, styles.chipLabelSelected]}>
                    Independent
                  </Text>
                  <Text style={[styles.chipDescription, styles.chipDescriptionSelected]}>
                    Standalone device, no mesh
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Icon name="arrow-next" width={18} height={18} fill={colors.textPrimary} />
            </TouchableOpacity>
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
    backgroundColor: colors.homeBg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    ...textFont.boldXXXL,
    color: colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    marginTop: 8,
  },
  subtitle: {
    ...textFont.regularM,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  meshInput: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 18,
    ...textFont.regularM,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  helperText: {
    ...textFont.regularS,
    color: colors.textGrey,
    marginBottom: 32,
  },
  sectionTitle: {
    ...textFont.boldM,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minWidth: '45%',
    flex: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.75,
  },
  chipLabel: {
    ...textFont.boldM,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  chipLabelSelected: {
    color: colors.textPrimary,
  },
  chipDescription: {
    ...textFont.regularS,
    color: colors.textGrey,
  },
  chipDescriptionSelected: {
    color: `${colors.textPrimary}CC`,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
});

export default AreaSelectionModal;
