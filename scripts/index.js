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
const cardPictureModalImage = cardPictureModal.querySelector(".modal__image");
const cardPictureModalDescription = cardPictureModal.querySelector(
  ".modal__image-description"
);
const profileModalCloseButton = profileEditModal.querySelector(
  "#modal-close-button"
);
const addModalCloseButton = profileAddModal.querySelector(
  "#modal-close-button"
);
const pictureModalCloseButton = cardPictureModal.querySelector(
  "#modal-close-button"
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
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const cardListEl = document.querySelector(".cards__list");
const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
const cardUrlInput = addCardForm.querySelector(".modal__input_type_url");

/* Functions */

function getCardElement(cardData) {
  //clone the template element with all its content and store it in a cardElement variable
  const cardElement = cardTemplate.cloneNode(true);
  console.log(cardElement);
  //access the card title and image and store them in variables
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });
  // access the delete button
  const deleteCardButton = cardElement.querySelector(".card__delete-button");
  // add an event listener for when the delete button is clicked
  deleteCardButton.addEventListener("click", () => {
    cardElement.remove();
  });
  // add event listener when image is clicked.
  cardImageEl.addEventListener("click", () => {
    openModal(cardPictureModal);
    // picture should display what the element picture is.
    cardPictureModalImage.src = cardData.link;
    //alt text for image should display the name of image.
    cardPictureModalImage.alt = cardData.name;
    // description should display the same as well.
    cardPictureModalDescription.textContent = cardData.name;
  });

  //set the path to the image to the link field of the object
  cardImageEl.src = cardData.link;
  //set the image alt text to the name field of the object
  cardImageEl.alt = cardData.name;
  //set the card title to the name field of the object, too
  cardTitleEl.textContent = cardData.name;
  //return the ready HTML element with the filled-in data
  return cardElement;
}

function renderCard(cardData, wrapper) {
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
}

function openModal(modal) {
  modal.classList.add("modal_opened");
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
  //Reset card inputs for title and URL
  e.target.reset();
  closePopup(profileAddModal);
}

/* Event Listeners*/

profileEditBtn.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
});
/* new add button */
addNewCardButton.addEventListener("click", () => openModal(profileAddModal));
profileModalCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);
addModalCloseButton.addEventListener("click", () =>
  closePopup(profileAddModal)
);
//add event listener for picture modal close button.
pictureModalCloseButton.addEventListener("click", () =>
  closePopup(cardPictureModal)
);

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

addCardForm.addEventListener("submit", handleAddCardFormSubmit);

// cardPictureModal.addEventListener

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
