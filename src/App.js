import React, { Component } from 'react';
import axios from 'axios';
import './css/reset.css';
import './css/App.css';
import _ from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayShortUrl: null,
      urlList: {}
    };
  }

  getUrls() {
    axios.get(`/urls`)
      .then((response) => {
        console.log('response', response);
        this.setState({urlList: response});
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
        this.setState({displayShortUrl: "http://localhost:3001/api/" + response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getUrls();
  }

  render() {
    let input;
    // let list = this.state.urlList.map((url) => {
    //   return(
    //     <li>{url}</li>
    //   )
    // });
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

        <a href={this.state.displayShortUrl}>
          <h1 className="short-url"
            display={this.state.displayShortUrl}>
            {this.state.displayShortUrl}
          </h1>
        </a>

        <div className="list-container">
          <ul>
            {/* {list} */}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
