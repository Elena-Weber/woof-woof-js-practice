// set json db
const baseURL = "http://localhost:3000/pups"

// what to do when DOM is fully loaded
document.addEventListener("DOMContentLoaded", init)

// this will initialize after page is loaded
function init(e){
    // assign filter button
    const filterDogsButton = document.querySelector("#good-dog-filter")
    // listen for click on filter button and toggle puppies on click (all or good)
    filterDogsButton.addEventListener("click", toggleFilterDogs)
    // send request to db and display puppies
    getDogs()
    .then(addAllDogsToDogBar)
}

// toggle puppies between good and all
function toggleFilterDogs(e){
    // assign filter button
    const filterDogsButton = document.querySelector("#good-dog-filter")
    // if text in this button equals OFF, change text to ON and display only good puppies
    if (filterDogsButton.innerText.includes("OFF")){
        filterDogsButton.innerText = "Filter good dogs: ON"
        updateDogBar()
        // otherwise change text to OFF and display all puppies
    } else {
        filterDogsButton.innerText = "Filter good dogs: OFF"
        updateDogBar()
    }
}

// display good or all puppies
function updateDogBar(){
    // assign puppy filter button
    const filterDogsButton = document.querySelector("#good-dog-filter")
    // if text in button includes text OFF, fetch and display all puppies
    if (filterDogsButton.innerText.includes("OFF")){
        getDogs()
        .then(dogArray => addAllDogsToDogBar(dogArray))
        // otherwise fetch only good puppies
    } else {
        getDogs()
        .then(dogArray => addAllDogsToDogBar(dogArray, true))
    }
}

// send request to db and convert response to json
function getDogs(){
    return fetch(baseURL)
    .then(r => r.json())
}

// choose which puppies to display
function addAllDogsToDogBar(dogArray, filter = false){
    // assign puppies container
    const dogBar = document.querySelector("#dog-bar")
    // it's empty in the beginning
    dogBar.innerHTML = ""
    // if filter is true, filter puppies and show only good ones, adding each of them to container
    if (filter) {
        dogArray.filter(dog => dog.isGoodDog).forEach(addDogSpantoDogBar)
        // otherwise display all puppies
    } else {
        dogArray.forEach(addDogSpantoDogBar)
    }
}

// display puppy in puppies container
function addDogSpantoDogBar(dog){
    // assign puppies container
    const dogBar = document.querySelector("#dog-bar")
    // create puppy card
    const dogSpan = document.createElement("span")
    // text inside puppy card = name
    dogSpan.innerText = dog.name
    // assign puppy data id
    dogSpan.dataset.id = dog.id
    // attach listener to puppy card, display puppy on click
    dogSpan.addEventListener("click", onDogSpanClick)
    // insert puppy card into puppies container
    dogBar.append(dogSpan)
}

// what to do on puppy click
function onDogSpanClick(e){
    // 
    getSingleDog(e.target.dataset.id)
    // display puppy info in container
    .then(addDogInfoToPage)
}

// send request to display a single puppy and convert it to json
function getSingleDog(id){
    return fetch(baseURL + `/${id}`)
    .then(r => r.json() )
}

// display puppy (puppy card)
function addDogInfoToPage(dog){
    // assign puppy info to puppy card
    const dogInfo = document.querySelector("#dog-info")
    // card is empty in the beginning
    dogInfo.innerHTML = ""
    // create puppy image tag
    const dogImg = document.createElement("img")
    // attach image source
    dogImg.src = dog.image
    // create puppy name tag
    const dogTitle = document.createElement("h2")
    // display puppy name
    dogTitle.innerText = dog.name
    // create puppy button
    const dogButton = document.createElement("button")
    // if puppy button equals good dog, display "Good Dog!", otherwise display "Bad Dog!"
    dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    // puppy button data gets id
    dogButton.dataset.id = dog.id
    // listen for click on puppy button, activate function below
    dogButton.addEventListener("click", onGoodDogButtonClick)
    // insert puppy image, name and button into every puppy card
    dogInfo.append(dogImg, dogTitle, dogButton)
}

// what to do on good/bad dog button
function onGoodDogButtonClick(e){
    // create new let
    let newValue;
    // if text includes "Good", change it into "Bad Dog" and assign new let to false
    if (e.target.innerText.includes("Good")){
        e.target.innerText = "Bad Dog"
        newValue = false
        // otherwise change it into "Good Dog" and assign new let to true
    } else {
        e.target.innerText = "Good Dog"
        newValue = true
    }
    // toggle puppy and assign new let
    toggleGoodDog(e.target.dataset.id, newValue)
    // display corresponding puppy array
    .then(updateDogBar)
}

// update puppy carrying id and its value
function toggleGoodDog(id, newValue){
    // set options for puppy and update them (good/bad)
    const options = {
    method: "PATCH",
    headers: {
        "content-type": "application/json"
    },
    // toggle puppy value (good/bad)
    body: JSON.stringify({
        isGoodDog: newValue
    })
    }
    // send request to url with puppy id and options, convert response to json
    return fetch(baseURL + `/${id}`, options)
    .then(r => r.json())
}