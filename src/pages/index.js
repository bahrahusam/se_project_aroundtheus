import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
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

//new api instance for getting user info
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ccf59c0a-ab7a-465a-b874-5e58b8d51318",
    "Content-Type": "application/json",
  },
});

// API Fetch user information when the page loads (Step 1)
api
  .getUserInfo()
  .then((userData) => {
    // Assuming your UserInfo class only handles name and job for now
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });
  })
  .catch((err) => {
    console.error("Failed to fetch user info:", err);
    // Optionally, show user feedback here
  });

// Check if initial cards have been uploaded before
if (!localStorage.getItem("initialCardsUploaded")) {
  // implement in api.js part of step(2,4)
  api
    .checkIfCardsExist()
    .then((exist) => {
      if (!exist) {
        return Promise.all(initialCards.map((card) => api.addCard(card)));
      } else {
        console.log("Cards already exist on the server");
        return Promise.resolve();
      }
    })
    .then(() => {
      localStorage.setItem("initialCardsUploaded", "true");
    })
    .catch((err) => {
      console.error("Error during initial card upload check:", err);
    });
}

// Fetch cards from the server (Step 2)
api
  .getInitialCards()
  .then((cardsData) => {
    const cardSection = new Section(
      {
        items: cardsData,
        renderer: (item) => {
          const cardElement = createCard(item);
          cardSection.addItem(cardElement);
        },
      },
      ".cards__list"
    );
    cardSection.renderItems();
    return cardSection; // Return the cardSection for use in Step 4
  })
  .then((cardSection) => {
    // Upload initial cards (Step 4)
    return Promise.all(initialCards.map((card) => api.addCard(card)))
      .then((newCardsData) => {
        console.log("All initial cards uploaded:", newCardsData);
        // Optionally refresh the cards after upload
        return api.getInitialCards();
      })
      .then((updatedCardsData) => {
        // Clear existing cards and re-render with the new set including uploaded cards
        cardSection.clear();
        cardSection.renderItems(updatedCardsData);
      });
  })
  .catch((err) => {
    console.error("Error in card operations:", err);
  });

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

// New PopupWithForm instances (userinfo integration change step 3)
const editProfilePopup = new PopupWithForm("#profile-edit-modal", (data) => {
  api
    .setUserInfo({
      name: data.title, // Assuming 'title' is where the user's name is stored in the form
      about: data.description, // Assuming 'description' is where the job description is stored in the form
    })
    .then((updatedUserData) => {
      userInfo.setUserInfo({
        name: updatedUserData.name,
        job: updatedUserData.about,
      });
      editProfilePopup.close();
    })
    .catch((err) => {
      console.error("Failed to update user info:", err);
    });
});
//end

// new addcard server integration (step 4)
const addCardPopup = new PopupWithForm("#add-card-modal", (data) => {
  api
    .addCard({
      name: data.title, // Assuming 'title' is where the card name is stored in the form
      link: data.description, // Assuming 'description' is where the image link is stored
    })
    .then((newCardData) => {
      const newCard = createCard(newCardData);
      cardSection.addItem(newCard); // Add the new card to the DOM using Section
      addCardPopup.close();
      addCardFormValidator.disableButton(); // Reset form and disable submit button
    })
    .catch((err) => {
      console.error("Failed to add new card:", err);
    });
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

//old code commented out for now as part of step 2

// // Section class integration
// const cardSection = new Section(
//   {
//     items: initialCards,
//     renderer: (item) => {
//       const cardElement = createCard(item); // Create the card element
//       cardSection.addItem(cardElement); // Add the card to the DOM
//     },
//   },
//   ".cards__list" // Selector for the container
// );

// // Render the initial cards on page load
// cardSection.renderItems();
