document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const searchNote = document.getElementById('search-note');
    const shadowBox = document.getElementById('shadow-box');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const todoContainer = document.getElementById('todo-container');

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

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


    function addTask(text) {
        const tasks = getTasks();
        const newTask = { text, done: false };
        saveTasks([...tasks, newTask]);
        renderTasks();
    }


    function deleteTask(index) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter((_, i) => i !== index);
        saveTasks(updatedTasks);
        renderTasks();
    }


    function toggleTaskDone(index) {
        const tasks = getTasks();
        tasks[index] = { ...tasks[index], done: !tasks[index].done };
        saveTasks(tasks);
        renderTasks();
    }


    function markAllTasksDone() {
        const tasks = getTasks();
        const updatedTasks = tasks.map(task => ({ ...task, done: true }));
        saveTasks(updatedTasks);
        renderTasks();
    }


    function toggleDarkMode() {

        if (todoContainer.classList.contains('dark-mode')) {
            todoContainer.classList.remove('dark-mode')
        } else {
            todoContainer.classList.add('dark-mode')
        }
    }


    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });


    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;

        if (target.classList.contains('delete-btn')) {
            deleteTask(Number(index));
        } else if (target.type === 'checkbox') {
            toggleTaskDone(Number(index));
        }
    });


    shadowBox.addEventListener('click', () => {
        markAllTasksDone();
    });

    document.querySelector('.todo-container').addEventListener('click', (e) => {
        e.stopPropagation();
    });


    searchNote.addEventListener('input', (e) => {
        const filter = e.target.value;
        renderTasks(filter);
    });

    darkModeToggle.addEventListener('click', toggleDarkMode);

    renderTasks();
});
