import {View} from "react-native";
import {LeftIcon, StyledInputLabel, StyledTextInput} from "./style";
import React from "react";
import {Colors} from "./style";
import {Octicons} from "@expo/vector-icons";

export const MyStyledTextInput = ({label, icon, ...props}) => {
    return <View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={Colors.primary.main}/>
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props}/>
    </View>
}