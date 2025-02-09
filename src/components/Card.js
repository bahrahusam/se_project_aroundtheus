export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteCard) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id; //new data point for card id
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteCard = handleDeleteCard; // Store the API instance
    this._data = data; // Store all card data for access to isLiked
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => this._toggleLike());
    this._deleteButton.addEventListener("click", () =>
      this._handleDeleteButtonClick()
    );
    this._cardImage.addEventListener("click", () =>
      this._handleImageClick(this._name, this._link)
    );
  }
  _handleDeleteButtonClick() {
    this._handleDeleteCard(this);
  }
  _toggleLike() {
    if (this._likeButton.classList.contains("card__like-button_active")) {
      this._api
        .unlikeCard(this._id)
        .then((updatedCard) => {
          this._likeButton.classList.remove("card__like-button_active");
          this._data.isLiked = false; // Update local state
        })
        .catch((err) => console.error("Failed to unlike card:", err));
    } else {
      this._api
        .likeCard(this._id)
        .then((updatedCard) => {
          this._likeButton.classList.add("card__like-button_active");
          this._data.isLiked = true; // Update local state
        })
        .catch((err) => console.error("Failed to like card:", err));
    }
  }
  deleteCard() {
    this._element.remove();
  }

  generateCard() {
    this._element = this._getTemplate();
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");
    this._cardImage = this._element.querySelector(".card__image");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._element.querySelector(".card__title").textContent = this._name;

    this._element.dataset.cardId = this._id; //card id storage for liking/deleting or other functions

    if (this._data.isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    }
    this._setEventListeners();

    return this._element;
  }
}
