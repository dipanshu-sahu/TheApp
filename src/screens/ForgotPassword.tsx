import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, View } from 'react-native';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import { MailIcon } from '../assets/icons';
import ActionButton from '../components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import BackButtonHeader from '../components/BackButtonHeader';

const ForgotPassword = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <BackButtonHeader />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ ...textFont.boldXL, color: colors.textPrimary }}>
          Forgot Password? No worry!
        </Text>
        <Gap type="s" />
        <Text style={{ ...textFont.boldS, color: colors.textPrimary }}>
          It happens to the best of us. Let's get you back on track.
        </Text>
        <Gap type="l" />
        <CustomInput
          InputIcon={MailIcon}
          placeholder="Enter Email"
          maxLength={30}
        />
      </View>
      <View style={{ padding: 16 }}>
        <ActionButton
          title="Submit"
          onPress={() => navigation.navigate('Intro' as never)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
