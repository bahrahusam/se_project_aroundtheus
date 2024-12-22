import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";

// Initial card data with updated image links
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
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileAddModal = document.querySelector("#add-card-modal");
const cardPictureModal = document.querySelector("#card-picture-modal");
const profileModalCloseButton = profileEditModal.querySelector(
  "#modalEdit-close-button"
);
const addModalCloseButton = profileAddModal.querySelector(
  "#modalAdd-close-button"
);
const pictureModalCloseButton = cardPictureModal.querySelector(
  "#modalPicture-close-button"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const addCardForm = profileAddModal.querySelector(".modal__form");
const cardListEl = document.querySelector(".cards__list");
const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
const cardUrlInput = addCardForm.querySelector(".modal__input_type_url");

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
function handleImageClick(name, link) {
  const cardPictureModalImage = cardPictureModal.querySelector(".modal__image");
  const cardPictureModalDescription = cardPictureModal.querySelector(
    ".modal__image-description"
  );

  cardPictureModalImage.src = link;
  cardPictureModalImage.alt = name;
  cardPictureModalDescription.textContent = name;

  openModal(cardPictureModal);
}

// Closes a popup modal
function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Opens a popup modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

// Handles Escape key press to close modals
function handleEscapeKey(e) {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closePopup(openModal);
    }
  }
}

// Renders a card and appends it to the container
function renderCard(cardData, container) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.generateCard();
  container.prepend(cardElement);
}

// Event Handlers
function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

function handleAddCardFormSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, cardListEl);
  e.target.reset();
  closePopup(profileAddModal);
}

/* Event Listeners */

profileEditBtn.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
});

addNewCardButton.addEventListener("click", () => openModal(profileAddModal));
profileModalCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);

addModalCloseButton.addEventListener("click", () =>
  closePopup(profileAddModal)
);

pictureModalCloseButton.addEventListener("click", () =>
  closePopup(cardPictureModal)
);

// Close modal on overlay click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closePopup(modal);
    }
  });
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);

// Render initial cards
initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
