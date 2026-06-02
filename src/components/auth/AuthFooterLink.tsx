import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type AuthFooterLinkProps = {
  prefix: string;
  linkText: string;
  onPress: () => void;
};

const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({
  prefix,
  linkText,
  onPress,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.prefix}>{prefix}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>{linkText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  prefix: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  link: {
    ...textFont.boldM,
    color: colors.link,
  },
});

export default AuthFooterLink;
