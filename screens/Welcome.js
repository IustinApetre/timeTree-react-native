import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, GreetingText, TaskText, TaskView, WelcomeContainer } from '../components/style';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import { useFormik } from 'formik';
import { baseUrl } from '../base/config';
import axios from 'axios';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

import { ToDoModal } from '../components/ToDoModal';


const Welcome = () => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const [myTasks, setMyTasks] = useState([]);
  const {} = storedCredentials;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const filterCategories = ['All', 'Personal', 'Work'];
  const currentDate = moment().format('DD MMMM YYYY');

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false); // State for modal visibility
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const filteredIncompleteTasks = filteredTasks.filter(task => !task.completed);
  const filteredCompletedTasks = filteredTasks.filter(task => task.completed);

  useEffect(() => {
    const fetchAndFilterTasks = async () => {
      const tasks = await getTasks();
      const tasksForToday = filterTasksForToday(tasks);
      setMyTasks(tasksForToday);
    };

    fetchAndFilterTasks();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      let tasks = myTasks;
      if (selectedFilter !== 'All') {
        tasks = tasks.filter(task => task.category === selectedFilter);
      }
      setFilteredTasks(tasks);
    };

    applyFilter();
  }, [myTasks, selectedFilter]);

  const clearLogin = () => {
    AsyncStorage.removeItem(`timeTreeCredentials`)
      .then(() => {
        setStoredCredentials("");
      })
      .catch(error => console.log(error))
  };

  const filterTasksForToday = (tasks) => {
    const today = moment().startOf('day');
    return tasks.filter(task => moment(task.createdAt).isSame(today, 'day'));
  };

  const filterTasks = (filter) => {
    setSelectedFilter(filter); // Actualizează filtrul selectat
    if (filter === 'All') {
      // Afișează toate taskurile
      setFilteredTasks(myTasks);
    } else {
      // Filtrare în funcție de categorie
      setFilteredTasks(myTasks.filter(task => task.category === filter));
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Delogare",
      "Ești sigur că vrei să te deloghezi?",
      [
        {
          text: "Nu",
          style: "cancel"
        },
        { text: "Da", onPress: () => clearLogin() }
      ]
    );
  };

  const Checkbox = ({ isChecked, onPress }) => {
    const iconName = isChecked ? 'check-box' : 'check-box-outline-blank';
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon name={iconName} size={24} color={Colors.primary.main} />
      </TouchableOpacity>
    );
  };

  const openEditModal = (taskId, title) => {
    setCurrentTaskId(taskId);
    setNewTitle(title);
    setIsModalVisible(true);
  };


  const getTasks = async () => {
    try {
      const response = await axios.get(`${baseUrl}/task/tasks`, {
        params: { userId: storedCredentials._id }
      });
      return response.data;
    } catch (error) {
      console.error("Eroare la preluarea task-urilor", error);
      return [];
    }
  };

  const EditButton = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon name="edit" size={24} color={Colors.secondary.main} />
      </TouchableOpacity>
    );
  };

  async function updateMyTasks() {
    const allTasks = await getTasks();
    const tasksForToday = filterTasksForToday(allTasks);
    setMyTasks(tasksForToday);
  }

  const DeleteButton = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon name="delete" size={24} color={Colors.secondary.dark} />
      </TouchableOpacity>
    );
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      category: 'Personal', // sau orice valoare implicită dorești
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(`${baseUrl}/task/tasks`, {
          user: storedCredentials._id,
          title: values.title,
          category: values.category,
        });
        // Acțiuni după trimiterea cu succes...
        resetForm();
        updateMyTasks();
      } catch (error) {
        console.error('Eroare la adăugarea taskului:', error);
      }
    },
  });

  const toggleAddTaskModalVisible = () => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible); // Toggle modal visibility
  };



  const toggleTaskCompleted = async (taskId, isCompleted) => {
    const url = `${baseUrl}/task/tasks/${taskId}/toggleCompleted`; // Presupunem că acesta este endpoint-ul tău
    try {
      await axios.put(url, { completed: isCompleted });
      updateMyTasks(); // Reîmprospătează lista de task-uri pentru a reflecta schimbarea
    } catch (error) {
      console.error("Eroare la actualizarea task-ului", error);
    }
  };

  const deleteTask = async (id) => {
    const url = `${baseUrl}/task/tasks/${id}`;
    await axios.delete(url);
    updateMyTasks();
  };

  const saveTask = async (id, newTitle) => {
    const url = `${baseUrl}/task/tasks/${id}`; // Asigură-te că este corect
    try {
      const response = await axios.put(url, { title: newTitle });

      updateMyTasks(); // Reîmprospătează lista de task-uri
      setIsModalVisible(false);
    } catch (error) {
      console.error("Eroare la actualizarea task-ului", error.response ? error.response.data : error);
    }
  };

  return (
    <WelcomeContainer>
      <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
        <Icon name="logout" size={30} color={Colors.black} />
      </TouchableOpacity>
      <GreetingText>Hello, {storedCredentials.name}!</GreetingText>
      <Text style={styles.dateText}>{currentDate}</Text>
      <TouchableOpacity onPress={() => toggleAddTaskModalVisible()} style={styles.addButton}>
        <Icon name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
      <Modal visible={isAddTaskModalVisible} animationType="slide"
             onRequestClose={() => setIsAddTaskModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            value={formik.values.title}
            onChangeText={formik.handleChange('title')}
            placeholder='Task Name'
            placeholderTextColor={Colors.black}
          />
          <Text>Select Task Category:</Text>
          <Picker
            selectedValue={formik.values.category}
            onValueChange={formik.handleChange('category')}
            style={{ height: 50, width: '100%' }}
          >
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Work" value="Work" />
          </Picker>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.secondary.main }]}
              onPress={() => {
                formik.handleSubmit();
                setIsAddTaskModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.grey.lighter }]}
              onPress={() => setIsAddTaskModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>


        </View>
      </Modal>
      <View style={styles.filterContainer}>
        {filterCategories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedFilter === category && styles.activeFilterButton]}
            onPress={() => filterTasks(category)}
          >
            <Text
              style={[styles.filterButtonText, selectedFilter === category && styles.activeFilterButtonText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredIncompleteTasks} // Folosește filteredIncompleteTasks
        renderItem={({ item }) => (
          <TaskView>
            {item.category === 'Work' && <Icon name="work" size={24} color={Colors.primary.dark} />}
            {item.category === 'Personal' && <Icon name="person" size={24} color={Colors.primary.dark} />}
            <TaskText>{item.title}</TaskText>
            <DeleteButton onPress={() => deleteTask(item._id)} />
            <EditButton onPress={() => openEditModal(item._id, item.title)} />
            <Checkbox isChecked={item.completed} onPress={() => toggleTaskCompleted(item._id, !item.completed)} />
          </TaskView>
        )}
        keyExtractor={item => item._id.toString()}
      />
      <Text style={styles.completedTasksText}>Completed Tasks</Text>
      <FlatList
        data={filteredCompletedTasks} // Folosește filteredCompletedTasks
        renderItem={({ item }) => (
          <TaskView>
            {item.category === 'Work' && <Icon name="work" size={24} color={Colors.primary.dark} />}
            {item.category === 'Personal' && <Icon name="person" size={24} color={Colors.primary.dark} />}
            <TaskText style={styles.completedTaskText}>{item.title}</TaskText>
            <DeleteButton onPress={() => deleteTask(item._id)} />
          </TaskView>
        )}
        keyExtractor={item => item._id.toString()}
      />
      <ToDoModal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} value={newTitle}
                 onChangeText={setNewTitle} formik={formik} onPress={() => saveTask(currentTaskId, newTitle)} />
    </WelcomeContainer>
  );
};

const styles = StyleSheet.create({


  dateText: {
    fontSize: 16,
    color: Colors.grey.darker,
    marginTop: 5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  addButton: {
    position: 'relative',
    backgroundColor: Colors.primary.main,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 999,
    alignSelf: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.main,
  },
  filterButtonText: {
    color: Colors.primary.main,
    fontWeight: 'bold',
  },
  activeFilterButtonText: {
    color: Colors.white,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: Colors.primary.dark,
  },
  completedTasksText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
  modalView: {
    backgroundColor: Colors.primary.light,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.grey.darker,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: Colors.black,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

});

export default Welcome;
