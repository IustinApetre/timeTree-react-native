import React,{useState, useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
import{View, ActivityIndicator} from 'react-native';

//formik
import {Formik} from 'formik';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

// icons
import {Octicons,Ionicons, Fontisto} from "@expo/vector-icons";
import {
  StyledContainer,
  InnerContainer,
  PageLogo, PageTitle,
  SubTitle, StyledFormArea,
  StyledTextInput,
  LeftIcon,
  StyledInputLabel,
  StyledButton,
  ButtonText,
  Colors, RightIcon,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,

} from '../components/style';



//colors
const {primary, } = Colors;
//keyboard avoiding view
import KeyBoardAvoidingWrapper from '../components/KeyBoardAvoidingWrapper';
//api CLIENT
import axios from 'axios';

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
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
const config = {iosClientId: `524265652234-fb4vdo27vlj0gcdn5u4s03vseb4vh54i.apps.googleusercontent.com`}
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
          <PageLogo resizeMode="cover" source={require('./../assets/img/logo.png')}></PageLogo>
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
                <StyledButton google={true} onPress={formikProps.handleSubmit}>

                  <Fontisto name={"google"} color={Colors.white} size={25} />
                  <ButtonText google={true}> Sign in with Google </ButtonText>

                </StyledButton>
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
const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword, ...props}) => {
    return(
        <View>
<LeftIcon>
    <Octicons name={icon} size={30}/>
</LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
          {isPassword && (
            <RightIcon onPress={()=> setHidePassword(!hidePassword)}>

              <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={30} color={Colors.gray} />
            </RightIcon>
          )}
        </View>
    )

}

export default Login;