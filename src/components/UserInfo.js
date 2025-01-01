export default class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
  }

  // Returns an object with user info
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    };
  }

  // Sets new user info to the page
  setUserInfo({ name, job }) {
    if (name) this._nameElement.textContent = name;
    if (job) this._jobElement.textContent = job;
  }
}
