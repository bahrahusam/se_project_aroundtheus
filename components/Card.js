class Card {
  // Constructor initializes the card with data, template selector, and a function to handle image clicks
  constructor(data, cardSelector, handleImageClick) {
    this._name = data.name; // Card's title
    this._link = data.link; // Card's image URL
    this._cardSelector = cardSelector; // Template selector for the card
    this._handleImageClick = handleImageClick; // Function to handle clicking the card's image
  }

  // This method selects the card template from the DOM and clones it
  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  // This method sets up all the event listeners for the card
  _setEventListeners() {
    // Add a click event listener to the like button
    this._likeButton.addEventListener("click", () => {
      this._handleLikeButton();
    });

    // Add a click event listener to the delete button
    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteButton();
    });

    // Add a click event listener to the image for previewing
    this._cardImage.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link);
    });
  }

  // This method toggles the like button's active state
  _handleLikeButton() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  // This method removes the card from the DOM
  _handleDeleteButton() {
    this._element.remove();
    this._element = null; // Clear the element reference to avoid memory leaks
  }

  // This method generates the card with all its data and event listeners
  generateCard() {
    // Clone the card template and store it in the instance
    this._element = this._getTemplate();

    // Select and set up the card image
    this._cardImage = this._element.querySelector(".card__image");
    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;

    // Set the card title
    this._element.querySelector(".card__title").textContent = this._name;

    // Select the like and delete buttons
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    // Add all the event listeners to the card
    this._setEventListeners();

    return this._element; // Return the complete card element
  }
}

export default Card;
