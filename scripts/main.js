// ==== Sélections ==== 
// Tâches
const inputTaskName     = document.querySelector("#task-name");
const inputStartDate    = document.querySelector("#start-date");
const inputEndDate      = document.querySelector("#end-date");
const inputDescription  = document.querySelector("#description");
const btnAddTask        = document.querySelector(".add-task");

// Affichages
const displayTask       = document.querySelector(".display-task");
const displayTaskSheet  = document.querySelector(".display-task-sheet");
const displayDone       = document.querySelector(".display-done");

// Filtre
const btnsFilter         = document.querySelector(".btn-container");

// ==== Variables ====
const arrayTasks = [];

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
function getUserData() {
    // Obtenir la valeur du bouton radio lors de l'appel (sinon il prend celui coché au départ du chargement)
    const radio       = document.querySelector(`[name="priority"]:checked`);
    
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
        priority: priority
    }
}
function stockUserData() {
    arrayTasks.push(getUserData());
}
function displayUserData() {
    displayTask.innerHTML = "";

    arrayTasks.forEach(task => {
        const card              = createElement("details", "card", "");
        const card_name         = createElement("summary", "card_name", `${task.name}`);
        const card_start        = createElement("div", "card_start", `Start: <span>${task.startDate}</span>`);
        const card_end          = createElement("div", "card_end", `End: <span>${task.endDate}</span>`);
        const card_description  = createElement("div", "card_description", `Description: <span>${task.description}</span>`);
        const card_priority     = createElement("div", "card_priority", `<span>Priority :</span>${task.priority}`);
        const btnDelete         = createElement("div", "delete-btn", `<span>Supprimer</span> ✖️`)

        appendElement(displayTask, card)
        appendElement(card, card_name)
        appendElement(card, card_priority)
        appendElement(card, card_start)
        appendElement(card, card_end)
        appendElement(card, card_description)
        appendElement(card, btnDelete)

        btnDelete.addEventListener("click", function (event) {
            event.preventDefault();

            if(event.target.classList.contains("delete-btn")) {
                const item = event.target.parentElement;
                const indexItem = Array.from(event.target.parentElement.children).indexOf(item);
                item.remove();
                arrayTasks.splice(indexItem, 1);
            }
        })
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

// ==== Evénements ====
btnAddTask.addEventListener("click", function (event) {
    event.preventDefault();

    stockUserData();
    displayUserData();
    resetFields()
})