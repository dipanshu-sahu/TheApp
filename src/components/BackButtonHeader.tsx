import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { colors } from '../themes/colors';

const BackButtonHeader: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
      <Icon name="arrow-back" width={28} height={28} fill={colors.greyLight} />
    </TouchableOpacity>
  );
};

export default BackButtonHeader;
