import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-4d045-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsDB = ref(database, "Endorsements")

const textArea = document.getElementById('input-field')
const inputFrom = document.querySelector('.input-from')
const inputTo = document.querySelector('.input-to')
const publishBtn = document.getElementById('publish-button')
const endorsementUl = document.getElementById('endorsements-list')

textArea.addEventListener('keyup', (e) => {
    e.key === "Enter" ? publishBtn.click() : null;
})

publishBtn.addEventListener('click', () => {
    let textAreaInputValue = textArea.value
    let inputFromValue = inputFrom.value
    let inputToValue = inputTo.value

    let endorsementObj = {
        endorsementText: textAreaInputValue,
        endorsementFrom: inputFromValue,
        endorsementTo: inputToValue,
        endorsementLikes: ``
    }

    push(endorsementsDB, endorsementObj)
    clearInputFields()
})

onValue(endorsementsDB, (snapshot) => {
    if (snapshot.exists()) {
        let endorsementsList = Object.entries(snapshot.val())
        clearList()
        endorsementsList.forEach(endorsement => {
            appendListItemToHtml(endorsement)
        })
    } else {
        endorsementUl.innerHTML = "<p>Empty</p>"
    }
})

function appendListItemToHtml(endorsements) {
    let listEl = document.createElement('li')

    let endorsementId = endorsements[0]
    let endorsementObj = endorsements[1]

    console.log(endorsementId)

    listEl.addEventListener('dblclick', () => {
        let exactLocationOfEndorsements = ref(database, `Endorsements/${endorsementId}`)
        remove(exactLocationOfEndorsements)
    })
    const {endorsementText, endorsementFrom, endorsementTo, endorsementLikes} = endorsementObj

    listEl.innerHTML = `
        <div class="endorsement-details">
            <h3 class="endorsement-to">${endorsementTo}</h3>
            <p class="endorsement-text">${endorsementText}</p>
            <h3 class="endorsement-from">${endorsementFrom}</h3>
            <span class="endorsement-likes">
                <i class="fa-solid fa-heart"></i>
                <p>${endorsementLikes}</p>
            </span>
        </div>`
        
    endorsementUl.append(listEl)
}

function clearInputFields() {
    textArea.value = ""
    inputFrom.value = ""
    inputTo.value = ""
}

function clearList() {
    endorsementUl.innerHTML = ""
}