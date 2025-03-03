import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".modal__form");
    this._inputList = this._form.querySelectorAll(".modal__input");
    this._submitButton = this._form.querySelector(".modal__button");
  }

  // Private method to collect form data
  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value;
    });
    return values;
  }

  // Override the setEventListeners method to include form submission
  setEventListeners() {
    super.setEventListeners(); // Call parent method to set up close listeners
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formData = this._getInputValues();
      // Assuming _handleFormSubmit is synchronous or you don't need to wait for its result before closing and resetting
      this._handleFormSubmit(formData);
      this._form.reset(); // Reset the form after handling the submission
      this.close(); // Close the popup after submission and reset
    });
  }

  // Public method to close the popup and reset the form
  close() {
    super.close(); // Call parent method to close the popup
  }
}
