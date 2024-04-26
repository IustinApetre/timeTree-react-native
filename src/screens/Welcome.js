import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ActiveFilterButton,
  ActiveFilterButtonText,
  AddButton,
  Colors, CompletedTasksText, CompletedTaskText,
  DateText, FilterButton, FilterButtonText,
  FilterContainer,
  GreetingText, LogoutButton,
  TaskText,
  TaskView,
  WelcomeContainer,
} from '../style';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../contexts/CredentialsContext';
import { useFormik } from 'formik';
import { baseUrl } from '../base/config';
import axios from 'axios';
import moment from 'moment';

import { ToDoModal } from '../components/ToDoModal';


const Welcome = () => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const [myTasks, setMyTasks] = useState([]);
  const {} = storedCredentials;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [todo,setTodo] = useState();
  const filterCategories = ['All', 'Personal', 'Work'];
  const currentDate = moment().format('DD MMMM YYYY');
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

  const openEditModal = (todo) => {
    setTodo(todo);
    setIsModalVisible(true);
  };

  const openAddModal = (todo) => {
    setTodo({title: '', category: 'Personal' });
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
          title: todo.title,
          category: todo.category,
        });
        // Acțiuni după trimiterea cu succes...
        resetForm();
        updateMyTasks();
      } catch (error) {
        console.error('Eroare la adăugarea taskului:', error);
      }
    },
  });

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

  const saveTask = async (id, newTitle, newCategory) => {
    if (!id) {
      setTodo({title: newTitle, category: newCategory});
      formik.handleSubmit();
      setIsModalVisible(false);
    } else {
      const url = `${baseUrl}/task/tasks/${id}`; // Asigură-te că este corect
      try {
        const response = await axios.put(url, { title: newTitle, category: newCategory });

        updateMyTasks(); // Reîmprospătează lista de task-uri
        setIsModalVisible(false);
      } catch (error) {
        console.error("Eroare la actualizarea task-ului", error.response ? error.response.data : error);
      }
    }
  };

  return (
    <WelcomeContainer>
      <LogoutButton onPress={handleLogoutPress}>
        <Icon name="logout" size={30} color={Colors.black} />
      </LogoutButton>
      <GreetingText>Hello, {storedCredentials.name}!</GreetingText>
      <DateText>{currentDate}</DateText>
      <AddButton onPress={openAddModal}>
        <Icon name="add" size={30} color={Colors.white} />
      </AddButton>
      <FilterContainer>
        {filterCategories.map(category => {
          const FilterButtonComponent = selectedFilter === category ? ActiveFilterButton : FilterButton;
          const FilterButtonTextComponent = selectedFilter === category ? ActiveFilterButtonText : FilterButtonText;
          return (
         <FilterButtonComponent
            key={category}
            onPress={() => filterTasks(category)}
          >

            <FilterButtonTextComponent>{category}</FilterButtonTextComponent>
          </FilterButtonComponent>
        );
        })
        }
      </FilterContainer>
      <FlatList
        data={filteredIncompleteTasks} // Folosește filteredIncompleteTasks
        renderItem={({ item }) => (
          <TaskView>
            {item.category === 'Work' && <Icon name="work" size={24} color={Colors.primary.dark} />}
            {item.category === 'Personal' && <Icon name="person" size={24} color={Colors.primary.dark} />}
            <TaskText>{item.title}</TaskText>
            <DeleteButton onPress={() => deleteTask(item._id)} />
            <EditButton onPress={() => openEditModal(item)} />
            <Checkbox isChecked={item.completed} onPress={() => toggleTaskCompleted(item._id, !item.completed)} />
          </TaskView>
        )}
        keyExtractor={item => item._id.toString()}
      />
      <CompletedTasksText>Completed Tasks</CompletedTasksText>
      <FlatList
        data={filteredCompletedTasks} // Folosește filteredCompletedTasks
        renderItem={({ item }) => (
          <TaskView>
            <Icon name={item.category === 'Work' ? "work" : "person"}  size={24} color={Colors.primary.dark} />
            <CompletedTaskText>{item.title}</CompletedTaskText>
            <DeleteButton onPress={() => deleteTask(item._id)} />
          </TaskView>
        )}
        keyExtractor={item => item._id.toString()}
      />
      <ToDoModal visible={isModalVisible} onModalClose={() => setIsModalVisible(false)} todo={{...todo}}
                onSave={saveTask} />
    </WelcomeContainer>
  );
};

export default Welcome;
