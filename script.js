const taskTitle = document.getElementById('inputBox');
const taskPriority = document.getElementById('dropdown');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addBtn.addEventListener('click', () => {
    const title = taskTitle.value;
    const priority = taskPriority.value;

    if (title === '' || priority === 'select') return;

    const { date, time } = getCurrentTime();


    tasks.push({
        title,
        priority,
        status: 'pending',
        createdDate: date,
        createdTime: time,
    });

    saveToLocalStorage();
    renderTasks();
    clearInputs();
});


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        //HTML Code
        li.innerHTML = `
        <strong>${task.title}</strong>
        (${task.priority})
        <br>
        <small>${task.createdDate} | ${task.createdTime}</small>
        <button class='statusBtn'></button>
        `;


        //status logic
        const statusBtn = li.querySelector('.statusBtn');
        statusBtn.textContent = task.status;

        statusBtn.addEventListener('click', () => {
            if (task.status === 'pending') {
                task.status = 'in-progress';
            } else if (task.status === 'in-progress') {
                task.status = 'completed';
            } else {
                task.status = 'pending';
            }

            saveToLocalStorage();
            renderTasks();
        });


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
