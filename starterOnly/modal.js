// DOM Elements
const modalForm = document.querySelector(".modal-form");
const modalThanks = document.querySelector(".modal-thanks");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const modalBtnClose = document.querySelectorAll(".btn-close");
const regexName = new RegExp("^[a-zA-ZéèîïÉÈÎÏ]+([-'\\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$"); 
// NOTE about this regex :
// 1) it accepts common french names (latin alphabet + accents), hyphens, dash, space
// 2) in the case of several words, these must be at least 2 characters long each
// the case 2) has not a specific error message in this code as considered to have almost zero probability to happen

const regexEmail = new RegExp("^[a-z0-9._-]+@[a-z0-9.-]{2,}\\.[a-z]{2,24}$");
// NOTE about this regex : 
// it accepts recent tld domains that could be until 24 characters long

const regexInteger = new RegExp("^(0|[1-9]\\d*)$");
// it accepts integer numbers including 0

// age limitations 
const ageMinAllowed = 18;
const ageMaxAllowed = 99;

// error messages are defined in the errorMessages object
const errorMessages = {
  firstNamePrefix: "Votre prénom ",
  lastNamePrefix: "Votre nom ",
  fieldEmptySuffix: "ne peut pas être vide.", 
  fieldCharNotValidSuffix: "semble avoir des caractères non valides.",
  fieldTooShortSuffix: "doit contenir au moins 2 caractères",
  emailEmpty: "Veuillez renseigner votre email ",
  emailNotValid: "Vérifiez que votre email soit dans le bon format (ex: abc@abc.abc) ",
  birthdateEmpty: "Veuillez renseigner votre date de naissance ",
  birthdateTooYoung: "Désolé, participation autorisée à partir de 18 ans",
  birthdateTooOld: "Merci de vérifier votre date de naissance",
  quantityNotValid: "Veuillez entrer un nombre valide",
  cityEmpty: "Veuillez choisir une ville",
  conditionEmpty: "Veuillez accepter les conditions",
}

function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}


/**
 * Toggle the display of a modal window.
 * @param {HTMLElement} popupModal - The modal div.
 * @param {string} displayValue - The value for the CSS display property.
 */
function toggleModal(popupModal, displayValue) {
  popupModal.style.display = displayValue;
}

// Add event listener to open modal buttons like "Sign up"
modalBtn.forEach((btn) => btn.addEventListener("click", () => {
  toggleModal(modalForm, "block");
}));

// Add event listener to close modal buttons like "Close" and "X"
modalBtnClose.forEach((btn) => btn.addEventListener("click", () => {
  const modal = btn.closest('.modal-window'); 
  toggleModal(modal, "none");
}));


/**
 * Display the error message by adding the message as data-error content and adding the data-error-visible css class attributes
 * @param {HTMLElement} input - the input field
 * @param {string} message - the error message
 */
function showErrorDisplay(input, message) {
  input.parentElement.setAttribute("data-error-visible", "true");
  input.parentElement.setAttribute("data-error", message);
}


/**
 * Clear the error message by removing the message as data-error content and removing the data-error-visible css class attributes
 * @param {HTMLElement} input - the input field
 * @param {string} message - the error message
 */
function clearErrorDisplay(input) {
  input.parentElement.removeAttribute('data-error-visible');
  input.parentElement.removeAttribute('data-error');
}


/**
 * Validate first and last name: not empty, 2 characters minimum, against regex for french characters only
 * @param {HTMLElement} input - the input field type="text"
 * @return {boolean} true if valid, false otherwise
 */
function validateName(nameField) {
  let errorMessagePrefix =
    nameField.name === 'first' ? errorMessages.firstNamePrefix 
    : nameField.name === 'last' ? errorMessages.lastNamePrefix 
    : ""; 

  let errorMessageSuffix = "";
  if (nameField.value === "") {
    errorMessageSuffix = errorMessages.fieldEmptySuffix
  } else if (!regexName.test(nameField.value)) {
    errorMessageSuffix = errorMessages.fieldCharNotValidSuffix
  } else if (nameField.value.length < 2) {
    errorMessageSuffix = errorMessages.fieldTooShortSuffix
  }

  if (errorMessageSuffix === "") {
    clearErrorDisplay(nameField);
    return true;
  } else {
    let errorMessageFull = errorMessagePrefix + errorMessageSuffix;
    showErrorDisplay(nameField, errorMessageFull);
    return false;
  }
}


/**
 * Validate emil: not empty, against regex for email including new TLD
 * @param {HTMLElement} input - the input field type="email"
 * @return {boolean} true if valid, false otherwise
 */
function validateEmail(emailField) { 
  const errorMessage = 
    emailField.value === "" 
    ? errorMessages.emailEmpty 
    : !regexEmail.test(emailField.value) 
      ? errorMessages.emailNotValid 
      : "";

  if (errorMessage === "") {
    clearErrorDisplay(emailField)
    return true
  } else {
    showErrorDisplay(emailField, errorMessage)
    return false
  }
}


/**
 * Validate birthdate: not empty, not too young, not too old
 * @param {HTMLElement} input - the input field type="date"
 * @return {boolean} true if valid, false otherwise
 */
function validateAge(birthdate) {
  const today = new Date();
  const birthValue = new Date(birthdate.value);
  if (birthdate.value === "") {
    showErrorDisplay(birthdate, errorMessages.birthdateEmpty);
    return false;
  }

  let age = today.getFullYear() - birthValue.getFullYear();
  if (age < ageMinAllowed) {
    showErrorDisplay(birthdate, errorMessages.birthdateTooYoung);
    return false;
  } else if (age > ageMaxAllowed) {
    showErrorDisplay(birthdate, errorMessages.birthdateTooOld);
    return false;
  } else {
    clearErrorDisplay(birthdate);
    return true;
  }
}


/**
 * Validate quantity: not empty, against regex for integer including 0
 * @param {HTMLElement} input - the input field type="number"
 * @return {boolean} true if valid, false otherwise
 */
function validateQuantity(quantityField) {
  if (!regexInteger.test(quantityField.value)) {
    showErrorDisplay(quantityField, errorMessages.quantityNotValid);
    return false;
  } else {
    clearErrorDisplay(quantityField);
    return true;
  }
}


/**
 * Validate city (radio): at least 1 selected
 * @param {HTMLElement} input radio
 * @return {boolean} true if valid, false otherwise
 */
function validateCity(cityField) {
  let cityChecked = false; // Initialize the variable outside the loop
  for (var i = 0; i < cityField.length; i++) {
    if (cityField[i].checked) {
        cityChecked = true; // Set the variable to true if any radio button is checked
        break; // Exit the loop as soon as a checked radio button is found
    }
  }
  if (!cityChecked) { 
    showErrorDisplay(cityField[0], errorMessages.cityEmpty);
    return false;
  } else {
    clearErrorDisplay(cityField[0]);
    return true;
  }
}


/**
 * Validate condition checked
 * @param {HTMLElement} input checkbox
 * @return {boolean} true if checked, false otherwise
 */
function validateCondition(conditionField) {
  let conditionChecked = conditionField.checked; // Initialize the variable outside the loop
  if (conditionChecked) {
    clearErrorDisplay(conditionField);
    return true;
  } else {
    showErrorDisplay(conditionField, errorMessages.conditionEmpty);
    return false;
  }
}


/**
 * Validates the form data.
 * @param {Event} event - The event object representing the event that triggered the validation
 * @return {boolean} true if all the entries in the are form valid, false otherwise
 */
function validate(event) {
  event.preventDefault();
  if (validateName(first) 
      && validateName(last) 
      && validateEmail(email)
      && validateAge(birthdate)
      && validateQuantity(quantity)
      && validateCity(city)
      && validateCondition(condition)
    )
  {        
      console.info("Form validé !")
      toggleModal(modalForm, "none");
      toggleModal(modalThanks, "block");
      form.reset();
  } else {
      console.error("Form non validé !")
  }
}


let first = document.getElementById("first")
let last = document.getElementById("last")
let email = document.getElementById("email")
let birthdate = document.getElementById("birthdate")
let quantity = document.getElementById("quantity")
let city = document.querySelectorAll('input[name="location"]')
let condition = document.getElementById("checkbox1")

first.addEventListener("change", () => validateName(first))
last.addEventListener("change", () => validateName(last))
email.addEventListener("change", () => validateEmail(email))
birthdate.addEventListener("blur", () => validateAge(birthdate))
quantity.addEventListener("change", () => validateQuantity(quantity))

// manage submit on form submit
let form = document.querySelector("form")
form.addEventListener("submit", (event) => validate(event));









