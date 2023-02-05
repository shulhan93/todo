/*
1. Обраться к localStorage и спросить есть ли объект в нем.
    - Если объекта нет, то ничего не происходит
    - Если есть:
     - читаем его
     - Делаем его копию
     - рендерим заметки на странице.
2. По нажатию на "add new note" открывать диалоговое окно
3. По нажатию на кнопку add note добавлем данные в объект, затем переносим в localStorage, после чего рендерим заметку.

*/
const listNotes = document.querySelector(".notes");
const addNoteBtn = document.querySelector(".add-note");
const popup = document.querySelector(".popup");
const titleInput = document.querySelector("#title");
const textInput = document.querySelector("#text");
const settingsBtn = document.querySelectorAll(".note__dots");

const data = [];

function checkData() {
    if (!localStorage.getItem("notes")) {
        return;
    }
    let obj = JSON.parse(localStorage.getItem("notes"));
    data.push(...obj);
    renderListNotes();
}

function addNote(e) {
    showPopup();
}

function showPopup() {
    popup.classList.add("active");
}

function createdData() {
    let d = new Date();
    let month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    let day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    return `${day}-${month}-${d.getFullYear()}`;
}

function createNote(title, text) {
    let idNote = new Date().getTime();
    let date = createdData();
    let note = {
        id: idNote,
        title: title,
        text: text,
        date: date,
    };
    data.push(note);
    updateLocalStorage(note);
    renderNote(note);
}

function updateLocalStorage() {
    localStorage.removeItem("notes");
    localStorage.setItem("notes", JSON.stringify(data));
}

function renderNote(note) {
    listNotes.insertAdjacentHTML(
        "beforeend",
        `
    <li id="${note.id}" class="note">
    <div class="note__content">
        <h2 class="note__title">${note.title}</h2>
        <p class="note__desc">${note.text}</p>
    </div>
    <div class="note__footer">
        <span class="note__date">${note.date}</span>
        <span class="note__dots">...</span>
        <ul class="note__settings">
            <li class="note__edit">
                <ion-icon name="create-outline"></ion-icon>
                Edit
            </li>
            <li class="note__delete">
                <ion-icon name="trash-outline"></ion-icon>
                Delete
            </li>
        </ul>
    </div>
</li>
    
    `
    );
}

function renderListNotes() {
    listNotes.querySelectorAll(".note").forEach((el) => el.remove());
    data.forEach(renderNote);
}

listNotes.addEventListener("click", function (e) {
    let btnSetting = e.target.closest(".note__dots");
    let note = e.target.closest(".note");
    if (btnSetting) {
        menuSettingsShow(note.querySelector(".note__settings"));
    } else {
        return;
    }
});

function menuSettingsShow(settings) {
    const deleteBtn = settings.querySelector(".note__delete");
    settings.classList.toggle("active");
    deleteBtn.addEventListener("click", deleteNote);
}

function deleteNote(e) {
    const note = e.target.closest(".note");
    note.remove();
    data.forEach((el, idx) => (el.id == note.id ? data.splice(idx, 1) : false));
    updateLocalStorage();
}

checkData();

popup.addEventListener("click", function (e) {
    const btnClose = e.target.closest(".popup-close");
    const addNote = e.target.closest(".popup-form__button");
    if (btnClose) {
        popup.classList.remove("active");
    } else if (addNote) {
        createNote(titleInput.value, textInput.value);
        titleInput.value = "";
        textInput.value = "";
        popup.classList.remove("active");
    }
});

addNoteBtn.addEventListener("click", addNote);
