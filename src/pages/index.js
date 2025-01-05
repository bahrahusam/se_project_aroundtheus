import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import "../pages/index.css";

// Initial card data
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

/* Elements */
const profileEditBtn = document.querySelector("#profile-edit-button");
const profileAddModal = document.querySelector("#add-card-modal");
const cardPictureModal = document.querySelector("#card-picture-modal");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditForm = document.querySelector(
  "#profile-edit-modal .modal__form"
);
const addCardForm = document.querySelector("#add-card-modal .modal__form");
const cardListEl = document.querySelector(".cards__list");

// Validation settings
const validationSettings = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Create FormValidator instances
const profileEditFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
profileEditFormValidator.enableValidation();

const addCardFormValidator = new FormValidator(validationSettings, addCardForm);
addCardFormValidator.enableValidation();

/* Functions */

// Handles opening the image preview modal
const imagePopup = new PopupWithImage("#card-picture-modal");
imagePopup.setEventListeners(); // Set up the event listeners from the parent class

function handleImageClick(name, link) {
  imagePopup.open({ name, link });
}

// New PopupWithForm instances (userinfo integration change)
const editProfilePopup = new PopupWithForm("#profile-edit-modal", (data) => {
  userInfo.setUserInfo({ name: data.title, job: data.description });
  editProfilePopup.close(); //closes popup after editing profile
});
//end

const addCardPopup = new PopupWithForm("#add-card-modal", (data) => {
  const newCard = createCard({ name: data.title, link: data.description });
  cardSection.addItem(newCard); // Add the new card using Section's method
  addCardPopup.close(); //closes popup after adding card
});

editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();

// Function to create a new card
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.generateCard();
  return cardElement; // Return the card element
}

/* Event Listeners */

//start: new userinfo.js integration
profileEditBtn.addEventListener("click", () => {
  const userData = userInfo.getUserInfo(); // Get current user data
  profileTitleInput.value = userData.name;
  profileDescriptionInput.value = userData.job;
  profileEditFormValidator.resetValidation(); // Reset validation state
  editProfilePopup.open(); // Open the edit profile popup
});
//end

addNewCardButton.addEventListener("click", () => {
  addCardFormValidator.resetValidation(); // Reset validation state
  addCardPopup.open(); // Open the add card popup
});

//new code
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

// Section class integration
const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item); // Create the card element
      cardSection.addItem(cardElement); // Add the card to the DOM
    },
  },
  ".cards__list" // Selector for the container
);

// Render the initial cards on page load
cardSection.renderItems();
