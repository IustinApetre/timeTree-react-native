import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from './style';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import * as styles from './style';
import { ModalButton, ModalButtonText, ModalView, TodoInput } from './styleModal';

export function ToDoModal(props) {

  const [title,setTitle] = useState( '');
  const [category,setCategory] = useState('');
  useEffect(() => {
    if(props.todo) {
      setTitle(props.todo.title);
      setCategory(props.todo.category);
    }
  }, [props.todo])

  return <Modal visible={props.visible} animationType='slide' onRequestClose={props.onRequestClose}>
    <ModalView>
      <TodoInput
        value={title}
        onChangeText={setTitle}
        placeholder='Enter task title'
        placeholderTextColor={Colors.grey.darker}
      />
      <Text>Select Task Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={{height: 50,
          width: '100%', }}
      >
        <Picker.Item label='Personal' value='Personal' />
        <Picker.Item label='Work' value='Work' />
      </Picker>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ModalButton
          style={{backgroundColor: Colors.secondary.main }}
          onPress={() => {
            setCategory('');
            setTitle('')
            props.onSave(props.todo._id, title, category);
          }}
        >
          <ModalButtonText>Save</ModalButtonText>
        </ModalButton>
        <ModalButton
          style={{ backgroundColor: Colors.grey.lighter }}
          onPress={() => {
            props.onModalClose();
            setCategory('');
            setTitle('');
          }}
        >
          <ModalButtonText>Cancel</ModalButtonText>
        </ModalButton>
      </View>
    </ModalView>
  </Modal>;
}