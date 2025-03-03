export default class FormValidator {
  constructor(settings, formElement) {
    this._settings = settings;
    this._formElement = formElement;
    this._inputList = Array.from(
      this._formElement.querySelectorAll(this._settings.inputSelector)
    );
    this._submitButton = this._formElement.querySelector(
      this._settings.submitButtonSelector
    );
  }

  enableValidation() {
    this._setEventListeners();
  }

  _setEventListeners() {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }

  _checkInputValidity(inputElement) {
    const errorElement = this._formElement.querySelector(
      `#${inputElement.id}-error`
    );
    if (!inputElement.validity.valid) {
      inputElement.classList.add(this._settings.inputErrorClass);
      errorElement.textContent = inputElement.validationMessage;
    } else {
      inputElement.classList.remove(this._settings.inputErrorClass);
      errorElement.textContent = "";
    }
  }

  _toggleButtonState() {
    const hasInvalidInput = this._inputList.some(
      (inputElement) => !inputElement.validity.valid
    );
    if (hasInvalidInput) {
      this.disableButton();
      this._submitButton.disabled = true;
    } else {
      this._submitButton.classList.remove(this._settings.inactiveButtonClass);
      this._submitButton.disabled = false;
    }
  }

  //new additions to fix submit button reset to invalid
  resetValidation() {
    this._toggleButtonState(); // Reset the button state
    this._inputList.forEach((inputElement) => {
      const errorElement = this._formElement.querySelector(
        `#${inputElement.id}-error`
      );
      inputElement.classList.remove(this._settings.inputErrorClass); // Remove input error styling
      errorElement.textContent = ""; // Clear error messages
    });
  }

  disableButton() {
    this._submitButton.classList.add(this._settings.inactiveButtonClass);
    this._submitButton.disabled = true;
  }
  //end

  //new function
}
