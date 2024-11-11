// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    struct TodoItem {
        string task;
        bool completed;
    }

    TodoItem[] private todos;
    mapping(address => uint[]) private ownerTodoIndexes;
    mapping(address => uint) public ownerTodoCount;

    event TaskAdded(address indexed owner, string task);
    event TaskCompleted(address indexed owner, uint index);
    event TaskDeleted(address indexed owner, uint index);

    function addTask(string memory _task) public {
        todos.push(TodoItem(_task, false));
        ownerTodoIndexes[msg.sender].push(todos.length - 1);
        ownerTodoCount[msg.sender]++;
        emit TaskAdded(msg.sender, _task);
    }

    function completeTask(uint _index) public {
        require(_index < todos.length, "Index out of range");
        require(ownerTodoIndexes[msg.sender][_index] == _index, "Not task owner");
        require(!todos[_index].completed, "Task already completed");
        todos[_index].completed = true;
        emit TaskCompleted(msg.sender, _index);
    }

    function deleteTask(uint _index) public {
        require(_index < todos.length, "Index out of range");
        require(ownerTodoIndexes[msg.sender][_index] == _index, "Not task owner");
        todos[_index] = todos[todos.length - 1];
        todos.pop();
        ownerTodoCount[msg.sender]--;
        emit TaskDeleted(msg.sender, _index);
    }

    function getTasks() public view returns (TodoItem[] memory) {
        TodoItem[] memory result = new TodoItem[](ownerTodoCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < todos.length; i++) {
            if (ownerTodoIndexes[msg.sender][i] == i) {
                result[counter] = todos[i];
                counter++;
            }
        }
        return result;
    }
}