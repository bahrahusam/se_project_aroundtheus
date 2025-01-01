import Popup from "../components/Popup.js";

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupImage = this._popup.querySelector(".modal__image");
    this._popupCaption = this._popup.querySelector(".modal__image-description");
  }

  // Override the open method to handle image and caption
  open(data) {
    // data should be an object containing the name and link
    this._popupImage.src = data.link;
    this._popupImage.alt = data.name;
    this._popupCaption.textContent = data.name;

    super.open(); // Call the parent's open method to show the popup
  }
}
