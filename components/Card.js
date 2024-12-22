export default class Card {
  constructor(data, cardSelector, handleImageClick) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__image")
      .addEventListener("click", () =>
        this._handleImageClick(this._name, this._link)
      );

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => this._handleDelete());
  }

  _handleDelete() {
    this._element.remove();
    this._element = null;
  }

  generateCard() {
    this._element = this._getTemplate();
    const cardImage = this._element.querySelector(".card__image");

    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._element.querySelector(".card__title").textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}
