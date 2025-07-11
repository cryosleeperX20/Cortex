class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
        this.init();
    }

    init() {
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.addButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date()
        };

        this.tasks.push(task);
        this.taskInput.value = '';
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.render();
    }

    render() {
        this.taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <button class="delete-button" data-id="${task.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const deleteButton = li.querySelector('.delete-button');

        checkbox.addEventListener('click', () => this.toggleTask(task.id));
        deleteButton.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        e.target.style.transform = 'scale(0.9)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

// Focus input on page load
window.addEventListener('load', () => {
    document.getElementById('taskInput').focus();
});
