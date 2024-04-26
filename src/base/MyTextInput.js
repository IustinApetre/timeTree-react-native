import { View } from 'react-native';
import { Colors, LeftIcon, RightIcon, StyledInputLabel, StyledTextInput } from '../style';
import { Ionicons, Octicons } from '@expo/vector-icons';
import React from 'react';

export  const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword, ...props}) => {
  return(
    <View>
      {icon &&( <LeftIcon>
        <Octicons name={icon} size={30}/>
      </LeftIcon>)}

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