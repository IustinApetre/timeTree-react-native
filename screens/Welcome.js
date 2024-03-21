import React, {useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
import {

  InnerContainer,
  PageTitle,
  SubTitle, StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeContainer,
  WelcomeImage,
  Avatar, HeaderContainer,


} from '../components/style';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';



const Welcome = () => {

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {name, email} = storedCredentials ;
  /*const AvatarImg = photoUrl ? {uri: photoUrl}: require('./../assets/img/logo.png');*/
  const clearLogin = () => {
    AsyncStorage.removeItem(`timeTreeCredentials`)
      .then(()=>{
        setStoredCredentials("");
      })
      .catch(error=>console.log(error))
  }
  return (

    <>
      <StatusBar style={"light"}/>
<HeaderContainer>
  <WelcomeContainer>
    <StyledButton onPress={clearLogin} >
      <ButtonText>Logout</ButtonText>
    </StyledButton>
    <WelcomeImage resizeMode="cover" source={require('./../assets/img/logo.png')}></WelcomeImage>
    <PageTitle welcome={true} >Welcome, {name || `Olga Simpson`}!</PageTitle>


    <StyledFormArea>
      {/*<Avatar resizeMode="cover" source={AvatarImg}></Avatar>*/}
      <Line/>

    </StyledFormArea>
  </WelcomeContainer>
 < /HeaderContainer>
      <InnerContainer>

      </InnerContainer>
   </>
  );
};



export default Welcome;