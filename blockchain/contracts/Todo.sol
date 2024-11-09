// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    struct TodoItem {
        string task;
        bool completed;
    }

    TodoItem[] public todos;
    mapping(address => uint) public ownerTodoCount;

    function addTask(string memory _task) public {
        todos.push(TodoItem(_task, false));
        ownerTodoCount[msg.sender]++;
    }

    function completeTask(uint _index) public {
        require(_index < todos.length, "Index out of range");
        require(!todos[_index].completed, "Task already completed");
        todos[_index].completed = true;
    }

    function deleteTask(uint _index) public {
        require(_index < todos.length, "Index out of range");
        todos[_index] = todos[todos.length - 1];
        todos.pop();
        ownerTodoCount[msg.sender]--;
    }

    function getTasks() public view returns (TodoItem[] memory) {
        return todos;
    }
}
