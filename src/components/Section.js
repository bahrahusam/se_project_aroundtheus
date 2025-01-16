export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items; // Array of data to render
    this._renderer = renderer; // Function to create and add a single item
    this._container = document.querySelector(containerSelector); // DOM container
  }

  // Public method to render all items
  renderItems() {
    this._items.forEach((item) => {
      this._renderer(item); // Call the renderer function on each item
    });
  }

  // Public method to add a single item to the container
  addItem(element) {
    this._container.prepend(element); // Add the DOM element to the container
  }

  // New method to clear all items from the container
  clear() {
    this._container.innerHTML = ""; // Clear the contents of the container
  }
}
