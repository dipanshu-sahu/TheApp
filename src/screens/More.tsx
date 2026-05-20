import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';

const More: React.FC = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
    ></SafeAreaView>
  );
};

export default More;
