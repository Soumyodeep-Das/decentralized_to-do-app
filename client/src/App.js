import React, { useState, useEffect } from 'react';
import { Web3Provider, Contract } from 'ethers';  // Direct import for Web3Provider and Contract
import rawABI from './TodoABI.json';

const App = () => {
  const TodoABI = JSON.parse(JSON.stringify(rawABI));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const provider = new Web3Provider(window.ethereum);  // Using Web3Provider from ethers
  const signer = provider.getSigner();
  const contractAddress = '0x13cb420fE12529E45aa2700f6C63773b60953d12';
  const contract = new Contract(contractAddress, TodoABI, signer);

  const fetchTasks = async () => {
    try {
      const tasks = await contract.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      const tx = await contract.addTask(newTask);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const completeTask = async (index) => {
    try {
      const tx = await contract.completeTask(index);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const deleteTask = async (index) => {
    try {
      const tx = await contract.deleteTask(index);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const requestAccess = async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        fetchTasks();
      } catch (error) {
        console.error("User denied account access or no provider available");
      }
    };

    requestAccess();
  }, []);

  return (
    <div>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <span>{task.task}</span>
            <button onClick={() => completeTask(index)}>Complete</button>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
