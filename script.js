const taskTitle = document.getElementById('inputBox');
const taskPriority = document.getElementById('dropdown');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filter = document.getElementById('filter');
const dueDateInput = document.getElementById('dueDate');

let currentFilter = 'all';
let editIndex = null;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addBtn.addEventListener('click', () => {
    const title = taskTitle.value;
    const priority = taskPriority.value;
    const dueDate = dueDateInput.value;

    if (title === '' || priority === 'select') return;

    const { date, time } = getCurrentTime();


    if (editIndex == null) {
        tasks.push({
            title,
            priority,
            status: 'pending',
            createdDate: date,
            createdTime: time,
            updatedDate: null,
            updatedTime: null,
            dueDate: dueDate || null,
        });
    } else {
        tasks[editIndex].title = title;
        tasks[editIndex].priority = priority;
        tasks[editIndex].updatedDate = date;
        tasks[editIndex].updatedTime = time;
        tasks[editIndex].dueDate = dueDate;

        editIndex = null;
        addBtn.textContent = 'Add Task';
    }


    saveToLocalStorage();
    renderTasks();
    clearInputs();
});


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



function renderTasks() {
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];


    //filter logic
    let processedTasks = tasks; //copy the original array in form of processedTasks.

    if (currentFilter === 'completed') {
        processedTasks = tasks.filter(task => task.status === 'completed');
    }
    if (currentFilter === 'pending') {
        processedTasks = tasks.filter(task => task.status === 'pending');
    }
    if (currentFilter === 'in-progress') {
        processedTasks = tasks.filter(task => task.status === 'in-progress');
    }

    processedTasks.forEach((task) => {
        const originalIndex = tasks.indexOf(task); //to use original array index.
        const li = document.createElement('li');

        //HTML Code
        li.innerHTML = `
        <strong>${task.title}</strong>
        (${task.priority})
        <br>

        ${task.updatedDate ? `<small>(Edited): ${task.updatedDate} | ${task.updatedTime}</small><br>` : ''}
        <small>(created): ${task.createdDate} | ${task.createdTime}</small><br>

        ${task.dueDate ? `<small>(Due): ${task.dueDate}</small><br>`:''}

        <button class='statusBtn'></button><br>

        ${editIndex !== originalIndex ?
        `<button class='editBtn'>Edit</button>
        <button class='delBtn'>delete</button>` : '<br>'}
        `;
        //in 83th line i use ternary operator for updated date, time ui updation.

        
        if(task.dueDate && task.dueDate < today && task.status !== 'completed'){
            li.style.backgroundColor = '#ffe5e5' //light red
        }


        //status logic
        const statusBtn = li.querySelector('.statusBtn');
        statusBtn.textContent = task.status;

        statusBtn.addEventListener('click', () => {
            if (task.status === 'pending') {
                task.status = 'in-progress';
                console.log(task.status);
            } else if (task.status === 'in-progress') {
                task.status = 'completed';
                console.log(task.status);
            } else {
                task.status = 'pending';
                console.log(task.status);
            }

            saveToLocalStorage();
            renderTasks();
        });

        //delete logic
        const delBtn = li.querySelector('.delBtn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                tasks.splice(originalIndex, 1);
                saveToLocalStorage();
                renderTasks();
            })
        }


        //edit logic
        const editBtn = li.querySelector('.editBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editIndex = originalIndex;
                taskTitle.value = tasks[editIndex].title;
                taskPriority.value = tasks[editIndex].priority;
                addBtn.textContent = 'update';

                renderTasks();
            })
        }


        taskList.appendChild(li);
    });
}


function clearInputs() {
    taskTitle.value = '';
    taskPriority.value = 'select';
}


function getCurrentTime() {
    const now = new Date();

    const date = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    const time = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return { date, time };
}

filter.addEventListener('change', () => {
    currentFilter = filter.value;
    renderTasks();
})
