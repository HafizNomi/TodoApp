

document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const searchNote = document.getElementById('search-note');
    const shadowBox = document.getElementById('shadow-box');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const todoContainer = document.getElementById('todo-container');
    const filter = document.getElementById('filter');

    
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

  
    function renderTasks(filterType = 'all', searchFilter = '') {
        const tasks = getTasks();
        todoList.innerHTML = '';

        
        const filteredTasks = tasks
            .filter(task => {
                if (filterType === 'completed') {
                    return task.done; 
                } else if (filterType === 'incomplete') {
                    return !task.done; 
                }
                return true; 
            })
            .filter(task => task.text.toLowerCase().includes(searchFilter.toLowerCase())); 

        
        filteredTasks.forEach((task, index) => {
            const { text, done } = task;
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${done ? 'checked' : ''} data-index="${index}">
                <span class="todo-text ${done ? 'done' : ''}">${text}</span>
                <button class="delete-btn" data-index="${index}">❌</button>
            `;
            todoList.appendChild(li);
        });
    }


    function addTask(text) {
        const tasks = getTasks();
        const newTask = { text, done: false }; 
        saveTasks([...tasks, newTask]);
        renderTasks(filter.value); 
    }

    
    function deleteTask(index) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter((_, i) => i !== index);
        saveTasks(updatedTasks);
        renderTasks(filter.value);
    }

    
    function toggleTaskDone(index) {
        const tasks = getTasks();
        tasks[index] = { ...tasks[index], done: !tasks[index].done }; 
        saveTasks(tasks);
        renderTasks(filter.value);
    }

    
    function markAllTasksDone() {
        const tasks = getTasks();
        const updatedTasks = tasks.map(task => ({ ...task, done: true }));
        saveTasks(updatedTasks);
        renderTasks(filter.value);
    }

    
    function toggleDarkMode() {
        todoContainer.classList.toggle('dark-mode');
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

    
    searchNote.addEventListener('input', (e) => {
        renderTasks(filter.value, e.target.value); 
    });

    
    filter.addEventListener('change', (e) => {
        renderTasks(e.target.value, searchNote.value); 
    });

    darkModeToggle.addEventListener('click', toggleDarkMode);

    renderTasks();
});
