import { Colors } from './style';
import styled from 'styled-components/native';

export const ModalView = styled.View`
    background-color: ${Colors.primary.light};
    padding: 20px;
    borderRadius: 10px;
    elevation: 5;
`;
export const TodoInput = styled.TextInput`
    height: 40px;
    padding-left: 10px;
    border-width: 1px;
    border-color: ${Colors.grey.darker};
    border-radius: 5px;
    color: ${Colors.black};
    background-color: ${Colors.white}; 
    margin-bottom: 20px;
`;
export const ModalButton = styled.TouchableOpacity`
    padding: 10px;
    border-radius: 5px;
    width: 45%;
    align-items: center;
`;
export const ModalButtonText = styled.Text`
    color: ${Colors.white}; 
    font-weight: bold;
`;