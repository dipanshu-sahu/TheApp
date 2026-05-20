import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textFont } from '../utils/textFont';
import { useNavigation } from '@react-navigation/native';
import Gap from '../components/Gap';
import ActionButton from '../components/ActionButton';

const Intro: React.FC = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Image
          source={require('../assets/images/AavitaLogo.png')}
          style={{ height: 200, width: 200 }}
          resizeMode="contain"
        />
        <Text
          style={{
            ...textFont.boldXXXL,
            color: colors.textSecondary,
            marginTop: 24,
          }}
        >
          Aavita Homes
        </Text>
        <Text
          style={{
            ...textFont.boldL,
            color: colors.textSecondary,
            lineHeight: 28,
          }}
        >
          Smart Living Starts Here
        </Text>
      </View>
      <View style={{ width: '100%', marginVertical: 20 }}>
        <ActionButton
          title={'Sign Up'}
          bgColor={colors.bgSecondary}
          textColor={colors.greyLight}
          onPress={() => navigation.navigate('SignUp' as never)}
        />
        <Gap orientation="vertical" type="m" />
        <ActionButton
          title={'Log In'}
          bgColor={colors.secondary}
          textColor={colors.textPrimary}
          onPress={() => navigation.navigate('Login' as never)}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 20,
  },
});

export default Intro;
