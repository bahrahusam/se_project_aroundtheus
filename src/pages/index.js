import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import {
  initialCards,
  validationSettings,
  profileEditBtn,
  profileTitleInput,
  profileDescriptionInput,
  addNewCardButton,
  profileEditForm,
  addCardForm,
} from "../utils/constants.js";
import "../pages/index.css";

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
  addCardFormValidator.disableButton();
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

//new comment for test purposes
