import React, { Component } from 'react';
import axios from 'axios';
import './css/reset.css';
import './css/App.css';

class App extends Component {

  getUrls(input) {
    console.log('input', input);
    axios.get(`/potato`)
      .then((response) => {
        console.log('response', response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    let input;
    return (
      <div className="App">
        <form
          className="input-container"
          onSubmit={ (e) => {
            e.preventDefault();
            this.getUrls(input.value);
            input.value=('');
          }}
        >
          <input
            ref={ node => input = node}
            type="text"
            placeholder="url"
          />
          <button
          className="submit-button">
            Submit
          </button>
        </form>

        <div className="list-container">
          <ul>
            <li>list here</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
