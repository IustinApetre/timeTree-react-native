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
  Avatar,



} from '../components/style';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';



const Welcome = () => {

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {name, email} = storedCredentials ;
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
      <InnerContainer>
            <WelcomeContainer>
              <WelcomeImage resizeMode="cover" source={require('./../assets/img/logo.png')}></WelcomeImage>
              <PageTitle welcome={true} >Welcome!</PageTitle>
              <SubTitle welcome={true}> {name || `Olga Simpson`}</SubTitle>
              <SubTitle welcome={true}> {email || `olgasimpson@gmail.com`} </SubTitle>
              <StyledFormArea>
                <Avatar resizeMode="cover" source={require('./../assets/img/logo.png')}></Avatar>
                <Line/>
              <StyledButton onPress={clearLogin} >
                <ButtonText>Logout</ButtonText>
              </StyledButton>
              </StyledFormArea>
            </WelcomeContainer>
      </InnerContainer>
   </>
  );
};



export default Welcome;