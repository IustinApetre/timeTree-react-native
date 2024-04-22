import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from './style';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import * as styles from './style';

export function ToDoModal(props) {
  return <Modal visible={props.visible} animationType='slide' onRequestClose={props.onRequestClose}>
    <View style={styles.modalView}>
      <TextInput
        style={[styles.input, { backgroundColor: Colors.white, marginBottom: 20 }]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder='Enter task title'
        placeholderTextColor={Colors.grey.darker}
      />
      <Text>Select Task Category:</Text>
      <Picker
        selectedValue={props.formik.values.category}
        onValueChange={props.formik.handleChange('category')}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label='Personal' value='Personal' />
        <Picker.Item label='Work' value='Work' />
      </Picker>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: Colors.secondary.main }]}
          onPress={props.onPress}
        >
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: Colors.grey.lighter }]}
          onPress={props.onRequestClose}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>;
}