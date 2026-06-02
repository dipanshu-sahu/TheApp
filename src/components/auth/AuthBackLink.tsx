import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import Icon from '../Icon';

type AuthBackLinkProps = {
  label?: string;
  onPress?: () => void;
};

const AuthBackLink: React.FC<AuthBackLinkProps> = ({
  label = 'Back to Login',
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate('Login' as never);
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
      <Icon name="arrow-back" width={18} height={18} fill={colors.textSecondary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  label: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
});

export default AuthBackLink;
