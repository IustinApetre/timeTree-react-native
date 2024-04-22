import React, { useState,useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons } from "@expo/vector-icons";
import { CredentialsContext } from '../components/CredentialsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledTextInput,
  LeftIcon,
  StyledInputLabel,
  StyledButton,
  ButtonText,
  Colors,
  RightIcon,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
} from '../components/style';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyBoardAvoidingWrapper from '../components/KeyBoardAvoidingWrapper';
import axios from 'axios';
import { baseUrl } from '../base/config';


const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(200, 0, 1));
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  //context
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const persistSignup = (credentials, message, status) => {
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
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
   setShow(false);
    setDate(currentDate);

  };

  const showDatePicker = () => {
    setShow(true);
  };


  const handleSignup = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `${baseUrl}/user/signup`

    axios
      .post(url, credentials)
      .then((response)=> {
        const result = response.data;
        const {message, status, data} = result;
        if (status !== `SUCCESS`){
          handleMessage(message, status);

        }
        else
        {

          persistSignup({...data}, message, status);
        }
        setSubmitting(false);
      })
      .catch(error=>{
        console.log(error);
        setSubmitting(false);
        handleMessage("An error occurred. Check your network and try again")
      })
  }

  const handleMessage = (message, type = `FAILED`) => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <KeyBoardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style={"light"} />
        <InnerContainer>
          <PageTitle>Flower Crib</PageTitle>
          <SubTitle> Account Signup</SubTitle>
          {show && (
            <DateTimePicker
              value={new Date()}
              mode='datetime'
              is24Hour={true}
              onChange={onChange}
              display="default"
              testID="dateTimePicker"
            />
          )}
          <Formik
            initialValues={{
              name: '',
              email: '',
              dateOfBirth: '',
              password: '',
              confirmPassword: ''
            }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: date };
              if (!values.email ||
                !values.password ||
                !values.name ||
                !values.dateOfBirth ||
                !values.confirmPassword
              ) {
                handleMessage("Please fill all the fields");
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage("Passwords do not match");
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
              }
            }}
          >
            {(formikProps) => (
              <StyledFormArea>
                <MyTextInput
                  label=" Name"
                  icon="person"
                  placeholder="Richard Barnes"
                  placeholderTextColor={Colors.black}
                  onChangeText={formikProps.handleChange('name')}
                  onBlur={formikProps.handleBlur('name')}
                  value={formikProps.values.name}
                />
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
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="YYYY - MM -- DD"
                  placeholderTextColor={Colors.black}
                  onChangeText={formikProps.handleChange('dateOfBirth')}
                  onBlur={formikProps.handleBlur('dateOfBirth')}
                  value={date ? date.toDateString() : ``}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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
                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * *"
                  placeholderTextColor={Colors.black}
                  onChangeText={formikProps.handleChange('confirmPassword')}
                  onBlur={formikProps.handleBlur('password')}
                  value={formikProps.values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!formikProps.isSubmitting && (
                  <StyledButton onPress={formikProps.handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}
                {formikProps.isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                  </StyledButton>
                )}
                <Line />
                <ExtraView>
                  <ExtraText>Already have an account?</ExtraText>
                  <TextLink onPress={() => navigation.navigate(`Login`)}>
                    <TextLinkContent>Login</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, showDatePicker, isDate, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={30} color={Colors.gray} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
