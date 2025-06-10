// ==== Sélections ==== 
// Tâches
const inputTaskName         = document.querySelector("#task-name");
const inputStartDate        = document.querySelector("#start-date");
const inputEndDate          = document.querySelector("#end-date");
const inputDescription      = document.querySelector("#description");
const btnAddTask            = document.querySelector(".add-task");

// Affichages
const displayTask           = document.querySelector(".display-task");
const displayProgress     = document.querySelector(".display-progress");
const displayDone           = document.querySelector(".display-done");

// Filtre
const [btnName, btnEndDate] = document.querySelectorAll(".btn-container button");

// ==== Variables ====
let arrayTasks = [];
let currentSort = null; // Pour retenir le tri actuel

// ==== Fonctions utilitaires ====
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    
    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }

    return element;
}
function appendElement(parent, child) {
    parent.append(child);
}

// ==== Fonctions ====
// ---- Générer les tâches ----
function getUserData() {
    // Obtenir la valeur du bouton radio lors de l'appel (sinon il prend celui coché au départ du chargement)
    const radio       = document.querySelector(`[name="priority"]:checked`);

    if (!inputTaskName.value) {
        alert("Veuillez donner un nom de tâche");
        return 

    } else {
        // Obtenir la valeur des champs
        const name        = inputTaskName.value ? inputTaskName.value : alert(`Veuillez donner un nom de tâche`);
        const startDate   = inputStartDate.value;
        const endDate     = inputEndDate.value;
        const description = inputDescription.value;
        const priority    = radio.value;

        return {
            name: name,
            startDate: startDate,
            endDate: endDate,
            description: description,
            priority: priority,
            inprogress: false,
            done: false
        }
    }
}
function stockUserData() {
    arrayTasks.push(getUserData());
    localStorage.setItem('tasks', JSON.stringify(arrayTasks));
}
function displayUserData() {
    displayTask.innerHTML = `<h3>My tasks</h3>`;
    displayProgress.innerHTML = "<h3>In progress</h3>";
    displayDone.innerHTML = "<h3>Done</h3>";

    // Appliquer le tri si un critère est actif
    if (currentSort === "name") {
        arrayTasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "endDate") {
        arrayTasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }

    arrayTasks.forEach((task, index) => {
        const card              = createElement("details", "card", "");
        card.setAttribute("draggable", "true");
        card.id = `task-${index}`;
        
        const card_name         = createElement("summary", "card_name", `${task.name}`);
        const card_start        = createElement("div", "card_start", `Start: <span>${task.startDate}</span>`);
        const card_end          = createElement("div", "card_end", `End: <span>${task.endDate}</span>`);
        const card_description  = createElement("div", "card_description", `Description: <span>${task.description}</span>`);
        const card_priority     = createElement("div", "card_priority", `<span>Priority :</span>${task.priority}`);
        const btnDelete         = createElement("div", "delete-btn", `<span>Supprimer</span> ✖️`)

        appendElement(card, card_name)
        appendElement(card, card_priority)
        appendElement(card, card_start)
        appendElement(card, card_end)
        appendElement(card, card_description)
        appendElement(card, btnDelete)

        btnDelete.addEventListener("click", function (event) {
            event.preventDefault();

            arrayTasks.splice(index, 1); // Supprimer la bonne tâche
            localStorage.setItem('tasks', JSON.stringify(arrayTasks)); // Mettre à jour le localStorage
            displayUserData(); // Afficher les tâches mises à jour
        })

        card.addEventListener("dragstart", drag); // Ajout de l'événement dragstart

        // Ajouter card dans la bonne colonne
        if (task.done) {
            displayDone.appendChild(card);
        } else if (task.inprogress) {
            displayProgress.appendChild(card);
        } else {
            displayTask.appendChild(card);
        }
    })
}
function resetFields() {
    inputTaskName.value     = "";
    inputStartDate.value    = "";
    inputEndDate.value      = "";
    inputDescription.value  = "";

    // Sélectionnez tous les boutons radio et décochez-les
    const radios = document.querySelectorAll('[name="priority"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}

// ---- Drag & Drop les tâches ----
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
  ev.preventDefault();

    let dropTarget = ev.target;
    while (dropTarget && !dropTarget.id) {
        dropTarget = dropTarget.parentElement;
    }

    const taskId = ev.dataTransfer.getData("text");
    const taskElement = document.getElementById(taskId);
    const dropZone = dropTarget.id;

  // Mettre à jour les données de l'objet task
  const taskIndex = parseInt(taskId.split("-")[1]); // Extrait l'index
  if (arrayTasks[taskIndex]) {
    if (dropZone === "in-progress") {
      arrayTasks[taskIndex].inprogress = true;
      arrayTasks[taskIndex].done = false;

    } else if (dropZone === "done") {
      arrayTasks[taskIndex].inprogress = false;
      arrayTasks[taskIndex].done = true;
    }
  }

    // Ajoutez l'élément à la nouvelle zone
    dropTarget.appendChild(taskElement);
    // Mettre à jour le localStorage après avoir modifié les tâches
    localStorage.setItem('tasks', JSON.stringify(arrayTasks));
    // Réafficher les tâches après la mise à jour
    displayUserData();
}

// ---- Local storage ----
function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        arrayTasks = JSON.parse(tasks);
        displayUserData();
    }
}
loadTasksFromLocalStorage();

// ==== Evénements ====
btnAddTask.addEventListener("click", function (event) {
    event.preventDefault();

    stockUserData();
    displayUserData();
    resetFields()
    
})

btnName.addEventListener("click", function () {
    currentSort = "name";
    displayUserData();
})
btnEndDate.addEventListener("click", function () {
    currentSort = "endDate";
    displayUserData();
})

