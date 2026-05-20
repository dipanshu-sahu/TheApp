import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowBackIcon } from '../assets/icons';
import { colors } from '../themes/colors';
import { useNavigation } from '@react-navigation/native';

const BackButtonHeader: React.FC = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginBottom: 24 }}
      onPress={() => navigation.goBack()}
    >
      <ArrowBackIcon width={28} height={28} fill={colors.greyLight} />
    </TouchableOpacity>
  );
};

export default BackButtonHeader;
