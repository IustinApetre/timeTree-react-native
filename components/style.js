import styled from 'styled-components/native';
import Constants from 'expo-constants';


// colors
export const Colors = {
    primary: {main: "#609966",dark:"#304d33", light: "#b0ccb3", lighter: "#d3dfd4"},
    secondary: {main: "#996093", light: "#AE7FAA", lighter: "#D6BFD4", dark: "#5C3958"},
    grey: {light: "#F2EFE5", dark: "#E3E1D9", darker: "#C7C8CC", darkest: "#B4B4B8"},
    white: "#FFFFFF",
    black: "#000",
};

const {primary, secondary,  white, black} = Colors;
const StatusBarHeight = Constants.statusBarHeight;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  background-color: ${white};
  padding-top: ${StatusBarHeight + 30}px;
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px; 
  justify-content: center; 
`;

export const Avatar = styled.Image`
 width: 100px;
 height: 100px;
 margin: auto;
 border-radius: 50px;
 border-width: 2px;
 border-color: ${secondary.main};
 margin-bottom: 10px;
 margin-top: 10px;
`;
export const WelcomeImage = styled.Image`
height: 50%;
max-width: 100%;
`;

export const PageLogo = styled.Image`
  width: 150px;
  height: 200px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${primary.main};
  padding: 10px;
  ${(props) => props.welcome &&`
 font-size:35px;`};
`;
export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${primary.dark}; 
    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `};
`;
export const   StyledFormArea = styled.View`
     width: 90% ;`;
export const StyledTextInput = styled.TextInput`
    background-color:${primary.lighter};
    padding:15px;
    padding-left: 55px;
    padding-right:55px;
    border-radius: 5px;
    font-size: 16px;
    height: 55px;
    margin-bottom: 10px;
    color: ${secondary.main};`;
export const StyledInputLabel = styled.Text`
   color: ${primary.main};
   font-size: 15px;
   text-align: left;
   `;
export const LeftIcon = styled.TouchableOpacity`
 left: 15px;
 top: 35px;
 position: absolute;
 z-index: 1;
`;
export const RightIcon = styled.TouchableOpacity`
 right: 15px;
 top: 35px;
 position: absolute;
 z-index: 1;
`;
export const StyledButton = styled.TouchableOpacity`
 padding: 15px;
 background-color : ${primary.dark};
 justify-content: center;
 align-items: center;
 border-radius:5px;
 margin-vertical:5px;
 height:60px;
 ${(props) => props.google === true && `
 background-color: ${secondary.dark};
 flex-direction: row;
 justify-content: center;
 `}
`;
export const ButtonText = styled.Text`
color:${white};
font-size: 16px;
 ${(props) => props.google === true && `
 padding:5px;
 color:${white}
 

 `}
`;
export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${props => props.type = `SUCCESS` ? primary.main : secondary.main};
`;
export const Line = styled.View`
 height: 1px;
 width: 300px;
 background-color: ${black};
 margin-vertical: 10px;
`;

export const ExtraView = styled.View`
      justify-content: center;
      flex-direction: row;
      align-items: center;
      padding: 10px;
`;
export const ExtraText = styled.Text`
      justify-content: center;
      align-content: center;
      color: ${black};
      font-size: 15px;
      `;
export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    `;
export const TextLinkContent = styled.Text`
color:${primary.dark};
font-size: 15px;

`



