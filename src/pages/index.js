import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
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
  avatarEditForm,
  avatarEditBtn,
} from "../utils/constants.js";
import "../pages/index.css";

//new api instance for getting user info
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ea954eb7-9cc5-4b86-a221-9efd3aedab32",
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
    userInfo.setAvatar(userData.avatar);
  })
  .catch((err) => {
    console.error("Failed to fetch user info:", err);
    // Optionally, show user feedback here
  });

// Fetch cards from the server (Step 2)
let cardSection;

api
  .getInitialCards()
  .then((cardsData) => {
    cardSection = new Section(
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

    // Check if initial cards exist on the server
    const existingCardNames = cardsData.map((card) => card.name);
    const cardsToAdd = initialCards.filter(
      (card) => !existingCardNames.includes(card.name)
    );

    // Only add new initial cards if they're not on the server
    if (cardsToAdd.length > 0) {
      return Promise.all(cardsToAdd.map((card) => api.addCard(card))).then(
        () => {
          console.log("New initial cards added to server.");
          // Refresh cards after adding new ones
          return api.getInitialCards();
        }
      );
    } else {
      console.log("All initial cards already exist on the server.");
      return Promise.resolve(cardsData); // No need to update since no new cards were added
    }
  })
  .then((updatedCardsData) => {
    // If new cards were added, this will re-render with all cards
    cardSection.clear();
    cardSection.renderItems(updatedCardsData);
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

//form validator for add card form
const addCardFormValidator = new FormValidator(validationSettings, addCardForm);
addCardFormValidator.enableValidation();

//form validator for avatar edit form
const avatarEditFormValidator = new FormValidator(
  validationSettings,
  avatarEditForm
);
avatarEditFormValidator.enableValidation();

/* Functions */

// Create a popup for delete confirmation
const deleteCardPopup = new PopupWithConfirmation(
  "#delete-card-modal",
  (cardInstance) => {
    return api.deleteCard(cardInstance._id).then(() => {
      cardInstance.deleteCard(); // Remove the card from the DOM after server confirmation
    });
  }
);
deleteCardPopup.setEventListeners();

function handleCardDelete(cardInstance) {
  deleteCardPopup.open(cardInstance); // Pass the card instance to the popup
}
// Handles opening the image preview modal
const imagePopup = new PopupWithImage("#card-picture-modal");
imagePopup.setEventListeners(); // Set up the event listeners from the parent class

function handleImageClick(name, link) {
  imagePopup.open({ name, link });
}

// New PopupWithForm instances (userinfo integration change step 3)
const editProfilePopup = new PopupWithForm("#profile-edit-modal", (data) => {
  const submitButton = editProfilePopup._form.querySelector(".modal__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  return api
    .setUserInfo({
      name: data.title,
      about: data.description,
    })
    .then((updatedUserData) => {
      userInfo.setUserInfo({
        name: updatedUserData.name,
        job: updatedUserData.about,
      });
      // return new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay
    })
    .then(() => {
      editProfilePopup.close();
    })
    .catch((err) => {
      console.error("Failed to update user info:", err);
      throw err;
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
});
//end

//avatar edit popup step (8)
const avatarEditPopup = new PopupWithForm("#avatar-edit-modal", (data) => {
  const submitButton = avatarEditPopup.form.querySelector(".modal__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  const avatarData = {
    avatar: data["avatar-url"],
  };

  return api
    .setUserAvatar(avatarData) // Return the promise chain
    .then((updatedUserData) => {
      console.log("Avatar update data:", updatedUserData); // Debug log
      userInfo.setAvatar(updatedUserData.avatar);
      // return new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
    })
    .then(() => {
      avatarEditPopup.close();
      avatarEditFormValidator.disableButton();
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
      throw err; // Re-throw the error so PopupWithForm can catch it
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
});
avatarEditPopup.setEventListeners();
// new addcard server integration (step 4)
const addCardPopup = new PopupWithForm("#add-card-modal", (data) => {
  const submitButton = addCardPopup._form.querySelector(".modal__button");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  return api
    .addCard({
      name: data.title,
      link: data.description,
    })
    .then((newCardData) => {
      const newCard = createCard(newCardData);
      cardSection.addItem(newCard);
      // return new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
    })
    .then(() => {
      addCardPopup.close();
      addCardFormValidator.disableButton();
    })
    .catch((err) => {
      console.error("Failed to add new card:", err);
      throw err;
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
});

editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();

// Function to create a new card
function createCard(cardData) {
  //new: logging cardData to see what's passed through
  console.log("Creating card with data:", cardData);
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleCardDelete
  );
  card._api = api; //new code
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
//event listener for avatar edit button
avatarEditBtn.addEventListener("click", () => {
  avatarEditPopup.open();
});

//new code
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});
