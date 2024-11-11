import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import { ThemeProvider } from './ThemeContext';
import rawABI from './TodoABI.json';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [contract, setContract] = useState(null);

  const TodoABI = useMemo(() => rawABI, []);
  const provider = useMemo(() => {
    if (typeof window.ethereum !== 'undefined') {
      return new ethers.BrowserProvider(window.ethereum);
    } else {
      console.error("Ethereum provider not found");
      return null;
    }
  }, []);

  const contractAddress=process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    const initializeContract = async () => {
      if (provider) {
        try {
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(contractAddress, TodoABI, signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      }
    };

    initializeContract();
  }, [provider, TodoABI, contractAddress]);

  const fetchTasks = useCallback(async () => {
    if (contract) {
      try {
        const tasks = await contract.getTasks();
        console.log(tasks);
        
        // Transform tasks into an array of objects
        const formattedTasks = tasks.map(task => ({
          task: task[0],        // First element is the task description
          completed: task[1]    // Second element is the completed status
        }));
        setTasks(formattedTasks); // Set tasks in the correct format
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  }, [contract]);
  

  const addTask = async () => {
    if (contract) {
      try {
        const tx = await contract.addTask(newTask);
        await tx.wait();
        fetchTasks();
        setNewTask('');
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const completeTask = async (index) => {
    if (contract) {
      try {
        const tx = await contract.completeTask(index);
        await tx.wait();
        fetchTasks();
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
  };

  const deleteTask = async (index) => {
    if (contract) {
      try {
        const tx = await contract.deleteTask(index);
        await tx.wait();
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    const requestAccess = async () => {
      try {
        if (provider) {
          const accounts = await provider.send("eth_requestAccounts", []);
          if (accounts.length > 0) {
            fetchTasks();
          }
        }
      } catch (error) {
        console.error("User denied account access or no provider available");
      }
    };

    requestAccess();
  }, [provider, fetchTasks]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 p-4 transition duration-300">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
          <ThemeToggle />
        </div>

        {/* Main Task Manager Container */}
        <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
            Todo List
          </h2>

          {/* Task Form Component */}
          <TaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />

          {/* Task List Component */}
          <TaskList tasks={tasks} completeTask={completeTask} deleteTask={deleteTask} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;