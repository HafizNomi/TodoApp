document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const searchNote = document.getElementById('search-note');
    const shadowBox = document.getElementById('shadow-box');

    // Function to get tasks from local storage
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Function to save tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to render tasks
    function renderTasks(filter = '') {
        const tasks = getTasks();
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const { text, done } = task;
            if (text.toLowerCase().includes(filter.toLowerCase())) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" ${done ? 'checked' : ''} data-index="${index}">
                    <span class="todo-text ${done ? 'done' : ''}">${text}</span>
                    <button class="delete-btn" data-index="${index}">❌</button>
                `;
                todoList.appendChild(li);
            }
        });
    }

    // Function to add a new task
    function addTask(text) {
        const tasks = getTasks();
        const newTask = { text, done: false };
        saveTasks([...tasks, newTask]);
        renderTasks();
    }

    // Function to delete a task
    function deleteTask(index) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter((_, i) => i !== index);
        saveTasks(updatedTasks);
        renderTasks();
    }

    // Function to toggle task completion
    function toggleTaskDone(index) {
        const tasks = getTasks();
        tasks[index] = { ...tasks[index], done: !tasks[index].done };
        saveTasks(tasks);
        renderTasks();
    }

    // Function to mark all tasks as done
    function markAllTasksDone() {
        const tasks = getTasks();
        const updatedTasks = tasks.map(task => ({ ...task, done: true }));
        saveTasks(updatedTasks);
        renderTasks();
    }

    // Event listener for add task button
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });

    // Event listener for task interactions
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;

        if (target.classList.contains('delete-btn')) {
            deleteTask(Number(index));
        } else if (target.type === 'checkbox') {
            toggleTaskDone(Number(index));
        }
    });

    // Event listener for shadow box click to mark all tasks as done
    shadowBox.addEventListener('click', () => {
        markAllTasksDone();
    });

    // Prevent shadow box click from interfering with inner elements
    document.querySelector('.todo-container').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Event listener for search functionality
    searchNote.addEventListener('input', (e) => {
        const filter = e.target.value;
        renderTasks(filter);
    });

    // Initial render of tasks
    renderTasks();
});
