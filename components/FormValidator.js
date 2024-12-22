class FormValidator {
  constructor(settings, formElement) {
    // Store settings and form element
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._inputErrorClass = settings.inputErrorClass;
    this._errorClass = settings.errorClass;

    this._form = formElement; // The form element to validate
  }

  // Private method to show input error
  _showInputError(inputElement) {
    const errorMessageElement = this._form.querySelector(
      `#${inputElement.id}-error`
    );
    inputElement.classList.add(this._inputErrorClass);
    errorMessageElement.textContent = inputElement.validationMessage;
    errorMessageElement.classList.add(this._errorClass);
  }

  // Private method to hide input error
  _hideInputError(inputElement) {
    const errorMessageElement = this._form.querySelector(
      `#${inputElement.id}-error`
    );
    inputElement.classList.remove(this._inputErrorClass);
    errorMessageElement.textContent = "";
    errorMessageElement.classList.remove(this._errorClass);
  }

  // Private method to check input validity
  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement);
    } else {
      this._hideInputError(inputElement);
    }
  }

  // Private method to toggle the submit button state
  _toggleButtonState() {
    const inputElements = Array.from(
      this._form.querySelectorAll(this._inputSelector)
    );
    const submitButton = this._form.querySelector(this._submitButtonSelector);

    const hasInvalidInput = inputElements.some(
      (inputElement) => !inputElement.validity.valid
    );

    if (hasInvalidInput) {
      submitButton.classList.add(this._inactiveButtonClass);
      submitButton.disabled = true;
    } else {
      submitButton.classList.remove(this._inactiveButtonClass);
      submitButton.disabled = false;
    }
  }

  // Private method to add event listeners
  _setEventListeners() {
    const inputElements = Array.from(
      this._form.querySelectorAll(this._inputSelector)
    );

    inputElements.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement); // Check individual input validity
        this._toggleButtonState(); // Update the button state
      });
    });
  }

  // Public method to enable validation
  enableValidation() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent form submission
    });

    this._setEventListeners(); // Set up all event listeners
    this._toggleButtonState(); // Initialize button state
  }
}

// Export the class
export default FormValidator;
