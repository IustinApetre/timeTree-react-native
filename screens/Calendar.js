import React, { useEffect, useState, useContext } from 'react';
import { View, Button, TextInput, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { baseUrl } from '../base/config';
import { CredentialsContext } from '../components/CredentialsContext';
import { useFormik } from 'formik';
import moment from 'moment';
import { ToDoModal } from '../components/ToDoModal';

// Define colors
export const Colors = {
  primary: { main: "#609966", dark: "#304d33", light: "#b0ccb3", lighter: "#d3dfd4" },
  secondary: { main: "#996093", light: "#AE7FAA", lighter: "#D6BFD4", dark: "#5C3958" },
  grey: { light: "#F2EFE5", dark: "#E3E1D9", darker: "#C7C8CC", darkest: "#B4B4B8" },
  white: "#FFFFFF",
  black: "#000",
};

export const Calendar = () => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [todo, setTodo] = useState();

  useEffect(() => {

    // Fetch tasks and dates when component mounts or `selectedDate` changes
    if (selectedDate) {
      fetchTasksForSelectedDate(selectedDate);
      fetchAllTaskDates();
    }
  }, [selectedDate, storedCredentials._id]);

  const handleDayPress = (day) => {
    const newSelectedDate = moment(day.dateString).format('YYYY-MM-DD');
    if (newSelectedDate !== selectedDate) {
      setSelectedDate(newSelectedDate);
    }
  };


  const fetchTasksForSelectedDate = async (selectedDate) => {
    try {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      const response = await axios.get(`${baseUrl}/task/tasks`, {
        params: { userId: storedCredentials._id, date: formattedDate },
      });
      setTasksForSelectedDate(response.data);
    } catch (error) {
      console.error('Error fetching tasks for date', selectedDate, ':', error);
    }
  };

  const fetchAllTaskDates = async () => {
    try {
      const response = await axios.get(`${baseUrl}/task/tasks/dates`, {
        params: { userId: storedCredentials._id },
      });
      setMarkedDates(response.data);
    } catch (error) {
      console.error('Error fetching marked dates:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      category: 'Personal',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const formattedDate = moment(selectedDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS');

        await axios.post(`${baseUrl}/task/tasks`, {
          user: storedCredentials._id,  // Asigură-te că acest câmp este trimis corect
          title: todo.title,
          category: todo.category,
          createdAt: formattedDate,  // Data selectată convertită în ISO string
        }).then(response => {
          // Handle success
          console.log("Task added successfully:", response.data);
          fetchTasksForSelectedDate(selectedDate);
        }).catch(error => {
          // Handle error
          console.error("Error adding task:", error.response ? error.response.data : error);
        });
        resetForm();
        fetchTasksForSelectedDate(selectedDate);  // Reîmprospătează lista
      } catch (error) {
        console.error('Error adding task:', error.response ? error.response.data : error);
      }
    },
  });

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseUrl}/task/tasks/${id}`);
      fetchTasksForSelectedDate(selectedDate);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const handleLogoutPress = () => {
    // Implement logout functionality
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
  const clearLogin = () => {
    AsyncStorage.removeItem(`timeTreeCredentials`)
      .then(() => {
        setStoredCredentials(""); // Clear stored credentials
      })
      .catch(error => console.log(error))
  };
  const onAddTodo = () => {
    setTodo({title: '', category: 'Personal'});
    setIsTaskModalVisible(true);
  }

  const onAddTodoFromModal = (id, title, category) => {
    setTodo({title,category});
    formik.handleSubmit();
    setIsTaskModalVisible(false);
  }
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <TouchableOpacity onPress={handleLogoutPress} style={styles.logoutButton}>
        <Icon name="logout" size={30} color={Colors.black} />
      </TouchableOpacity>
      <RNCalendar
        onDayPress={handleDayPress}

        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: Colors.primary.main },
        }}

        headerTitleStyle={{ color: Colors.black }}
      />
      <View style={styles.taskInputContainer}>
        <TouchableOpacity style={styles.addButton} onPress={onAddTodo}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskListContainer}>
        <FlatList
          data={tasksForSelectedDate}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Icon name={item.category === 'Work' ? "work" : "person"}  size={24} color={Colors.primary.dark} />
              <Text style={styles.taskTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => deleteTask(item._id)}>
                <Icon name="delete" size={24} color={Colors.secondary.main} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
      <ToDoModal visible={isTaskModalVisible} onModalClose={() => setIsTaskModalVisible(false)} todo={{...todo}}
                 onSave={onAddTodoFromModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1, // Asigură-te că butonul de logout este desenat deasupra imaginii de fundal
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey.light,
  },
  taskText: {
    fontSize: 16,
    color: Colors.black,
  },
  taskInputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.grey.darkest,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  taskListContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey.light,
  },
  taskTitle: {
    fontSize: 16,
  },
});