import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-4d045-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsDB = ref(database, "Endorsements")

const textArea = document.getElementById('input-field')
const publishBtn = document.getElementById('publish-button')
const endorsementUl = document.getElementById('endorsements-list')

textArea.addEventListener('keyup', (e) => {
    e.key === "Enter" ? publishBtn.click() : null;
})

publishBtn.addEventListener('click', () => {
    let textAreaInputValue = textArea.value
    clearField()
    appendListItemToHtml(textAreaInputValue)
    push(endorsementsDB, textAreaInputValue)
})

onValue(endorsementsDB, (snapshot) => {
    let endorsementsList = Object.entries(snapshot.val())
    console.log(endorsementsList)
    clearField()

    endorsementsList.forEach(endorsement => {
        appendListItemToHtml(endorsement)
    })

})

function appendListItemToHtml(endorsements) {
    let listEl = document.createElement('li')

    let endorsementId = endorsements[0]
    let endorsementValue = endorsements[1]

    listEl.addEventListener('dblclick', () => {
        let exactLocationOfEndorsements = ref(database, `Endorsements/${endorsementId}`)
        remove(exactLocationOfEndorsements)
    })

    listEl.textContent = endorsementValue
    endorsementUl.append(listEl)
}

function clearField() {
    textArea.value = ""
    endorsementUl.innerHTML = ""
}