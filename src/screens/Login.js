import React,{useState, useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
import{ActivityIndicator} from 'react-native';
import {Formik} from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../contexts/CredentialsContext';

import * as Google from 'expo-google-app-auth';
import {
  StyledContainer,
  InnerContainer,
  PageLogo, PageTitle,
  SubTitle, StyledFormArea,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,

} from '../style';



//colors
const {primary, } = Colors;
//keyboard avoiding view
import KeyBoardAvoidingWrapper from '../components/KeyBoardAvoidingWrapper';
//api CLIENT
import axios from 'axios';
import { MyTextInput } from '../base/MyTextInput';

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  //context
  const { setStoredCredentials} = useContext(CredentialsContext);
  const handleLogin = (credentials, setSubmitting) => {

    const url = `https://fierce-lowlands-23983-82fa6bb73787.herokuapp.com/user/signin`

    axios
      .post(url, credentials)
      .then((response)=> {
        const result = response.data;
        const {message, status, data} = result;
        if (status !== `Success`){
          handleMessage(message, status);

        }
        else
        {
          persistLogin({...data[0]}, message,status);
        }
        setSubmitting(false);
      })
      .catch(error=>{
        console.log(error);
        setSubmitting(false);
        handleMessage("An error occurred. Check your network and try again")
      })
  }
const handleMessage = (message, type=`FAILED` ? primary.main : primary.dark) =>{
  setMessage(message);
  setMessageType(type);
}




const handleGoogleSignin = () => {
    setGoogleSubmitting(true);
const config = {iosClientId: `524265652234-vuoj9ma4rhfuad5ejgm1jpc80o84pn38.apps.googleusercontent.com`,
  androidClientId:`524265652234-622btkvbad4mrnc85hej8s7uliaipmhn.apps.googleusercontent.com`,
  scopes: [`profile`, `email`]
};
Google.logInAsync(config)
  .then((result)=>{
    const {type, user } = result;
    if (type === `success`){
      const {email, name, photoUrl} = user;
      handleMessage(`Google signin successful`, `SUCCESS`);
      setTimeout(()=> navigation.navigate(`Welcome`, {email, name, photoUrl}), 1000);
    }
    else
    {
      handleMessage("Google signin was cancelled")
    }
    setGoogleSubmitting(false);
  })
  .catch(error=>{
    console.log(error);
    handleMessage("An error occurred. Check your network and try again");
    setGoogleSubmitting(false);
  })
  }







const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem(`timeTreeCredentials`, JSON.stringify(credentials))
      .then(()=>{
        handleMessage(message,status);
        setStoredCredentials(credentials);
      })
      .catch((error)=>{
        console.log(error);
        handleMessage(`Persisting login failed`);
      })

}
  return (
    <KeyBoardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style={"light"}></StatusBar>
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('../../assets/img/logo.png')}></PageLogo>
          <PageTitle>TimeTree</PageTitle>
          <SubTitle> Account Login</SubTitle>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, {setSubmitting}) => {
            if(!values.email || !values.password ){
              handleMessage("Please fill all the fields");
              setSubmitting(false);
            }else{
              handleLogin(values,setSubmitting);

            }
            }}
          >
            {(formikProps) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="example@gmail.com"
                  placeholderTextColor={Colors.black}
                  onChangeText={formikProps.handleChange('email')}
                  onBlur={formikProps.handleBlur('email')}
                  value={formikProps.values.email}
                  keyboardType="email-address"
                />
                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * *"
                  placeholderTextColor={Colors.black}
                  onChangeText={formikProps.handleChange('password')}
                  onBlur={formikProps.handleBlur('password')}
                  value={formikProps.values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}

                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!formikProps.isSubmitting && (
                  <StyledButton onPress={formikProps.handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}
                {formikProps.isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                  </StyledButton>
                )}
                <Line />



                <ExtraView>
                  <ExtraText>Don't have an account already?</ExtraText>
                  <TextLink onPress={() => navigation.navigate('Signup')}>
                    <TextLinkContent> Signup</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyBoardAvoidingWrapper>
  );
};


export default Login;