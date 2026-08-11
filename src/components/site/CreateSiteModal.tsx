import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';

import Icon from '../Icon';
import AppText from '../ui/AppText';
import Button from '../ui/Button';
import TextField from '../ui/TextField';
import AnimatedPressable from '../ui/AnimatedPressable';
import AmbientBackground from '../ui/AmbientBackground';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import { createSite } from '../../slices/siteSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Site } from '../../types/site';
import { extractErrorMessage } from '../../utils/extractErrorMessage';

type CreateSiteModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (site: Site) => void;
};

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ visible, onClose, onCreated }) => {
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
      `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() || currentUser.email;

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
        <AmbientBackground />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <AnimatedPressable onPress={handleClose} disabled={isSubmitting} pressScale={0.9}>
              <Icon name="close" width={22} height={22} fill={colors.textSecondary} />
            </AnimatedPressable>
            <AppText variant="title" style={styles.headerTitle}>
              New Site
            </AppText>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.body}>
            <AppText variant="h1" style={styles.title}>
              Create a Site
            </AppText>
            <AppText variant="bodyLg" color={colors.textSecondary} style={styles.subtitle}>
              A site groups your devices by physical location (e.g. "My Home", "Office").
            </AppText>

            <TextField
              label="Location Name"
              icon="map"
              placeholder="e.g. My Home, Office"
              value={locationName}
              onChangeText={setLocationName}
              editable={!isSubmitting}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Create Site"
              onPress={handleCreate}
              disabled={isDisabled}
              loading={isSubmitting}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 22,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xxl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
});

export default CreateSiteModal;
