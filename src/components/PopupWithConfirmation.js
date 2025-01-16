import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirmAction) {
    super(popupSelector);
    this._handleConfirmAction = handleConfirmAction;
    this._confirmButton = this._popup.querySelector("#confirm-delete-button");
    this._cardInstance = null; // To store the card instance
  }

  open(cardInstance) {
    super.open();
    this._cardInstance = cardInstance; // Store the instance
  }

  setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener("click", () => {
      if (this._cardInstance) {
        this._handleConfirmAction(this._cardInstance)
          .then(() => this.close())
          .catch((err) => {
            console.error("Failed to delete card:", err);
          });
      } else {
        console.error("No card instance found for deletion");
      }
    });
  }
}
