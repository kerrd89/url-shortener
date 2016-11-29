import React, { Component } from 'react';
import axios from 'axios';
import './css/reset.css';
import './css/App.css';

class App extends Component {

  getUrls() {
    axios.get(`/urls`)
      .then((response) => {
        console.log('response', response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  postUrls(input) {
    console.log('input', input);
    axios.post(`/post`, {
      url: input
    })
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
        <h1 className="title">Biggie/Smalls</h1>
        <form
          className="input-container"
          onSubmit={ (e) => {
            e.preventDefault();
            this.postUrls(input.value);
            input.value=('');
          }}
        >
          <input
            ref={ node => input = node}
            type="text"
            placeholder="input your url here"
            className="input-field"
          />
          <button
            className="submit-button">
            Submit
          </button>
        </form>

        <h1 className="short-url">display short url here</h1>

        <div className="list-container">
          <ul>
            <li>Full list here</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
