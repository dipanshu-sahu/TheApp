import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';

import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { createSite } from '../../slices/siteSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Site } from '../../types/site';
import { extractErrorMessage } from '../../utils/extractErrorMessage';

type CreateSiteModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (site: Site) => void;
};

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { createSiteApi } = useSelector((state: RootState) => state.site);

  const [locationName, setLocationName] = useState('');

  const trimmedLocation = locationName.trim();
  const isSubmitting = createSiteApi.loading;
  const isDisabled = !trimmedLocation || isSubmitting;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setLocationName('');
    onClose();
  };

  const handleCreate = async () => {
    if (isDisabled) {
      return;
    }

    const currentUser = Array.isArray(user) ? user[0] : user;
    if (!currentUser?.id) {
      Toast.show({
        type: 'error',
        text1: 'Not signed in',
        text2: 'User profile is missing. Please sign in again.',
        position: 'top',
      });
      return;
    }

    const username =
      `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() ||
      currentUser.email;

    try {
      const site = await dispatch(
        createSite({ userId: currentUser.id, username, location: trimmedLocation }),
      ).unwrap();

      setLocationName('');
      onCreated(site);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create site',
        text2: extractErrorMessage(error, 'Please try again.'),
        position: 'top',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} hitSlop={12} disabled={isSubmitting}>
              <Icon name="close" width={22} height={22} fill={colors.greyLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Site</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Create a Site</Text>
            <Text style={styles.subtitle}>
              A site groups your devices by physical location (e.g. "My Home", "Office").
            </Text>

            <Text style={styles.inputLabel}>Location Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. My Home, Office"
              placeholderTextColor={colors.textGrey}
              value={locationName}
              onChangeText={setLocationName}
              editable={!isSubmitting}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.createButton, isDisabled && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={isDisabled}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textPrimary} size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create Site</Text>
              )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  headerTitle: {
    ...textFont.boldM,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 22,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    ...textFont.boldXXXL,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...textFont.regularM,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  inputLabel: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 18,
    ...textFont.regularM,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  createButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    opacity: 0.45,
  },
  createButtonText: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
});

export default CreateSiteModal;
