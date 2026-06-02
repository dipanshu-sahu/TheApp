import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

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
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <Pressable style={styles.backdrop} onPress={onCancel}>
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.title}>Edit</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter name"
          placeholderTextColor={colors.textGrey}
          autoFocus
          selectTextOnFocus
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>Sure</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  title: {
    ...textFont.boldL,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 18,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...textFont.regularM,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.inputBorder,
  },
  cancelText: {
    ...textFont.regularM,
    color: colors.textPrimary,
  },
  confirmText: {
    ...textFont.boldM,
    color: colors.link,
  },
});

export default EditNameModal;
