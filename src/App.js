import React, { Component } from 'react';
import axios from 'axios';
import './css/reset.css';
import './css/App.css';
import _ from 'lodash';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayShortUrl: null,
      urlList: []

    };
  }

  getUrls() {
    axios.get(`/urls`)
      .then((response) => {
        this.setState({urlList: response.data.urls});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  postUrls(input) {
    axios.post(`/post`, {
      url: input
    })
      .then((response) => {
        this.setState({displayShortUrl: "http://localhost:3001/api/" + response.data});
        this.getUrls();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sortBy(property, direction) {
    const { urlList } = this.state;
    let sortedUrls = _.orderBy(urlList, [property], [direction]);
    this.setState({ urlList: sortedUrls });
  }

  componentDidMount() {
    this.getUrls();
  }

  render() {
    let input;
    let list;
    if(this.state.urlList.length){
      list = this.state.urlList.map((url) => {
        return(
          <li key={url.shortID}>{url.longUrl}:{url.shortID}:
          {moment(url.createdAt).format('MMMM Do, h:mm a')}:{url.count}</li>
        )
      });
    }
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
        <button
          onClick={() => this.sortBy('count', 'asc')}
          >
            Sort By Popularity
          </button>
        <button
          onClick={() => this.sortBy('createdAt', 'desc')}
        >
          Sort By Date
        </button>

          <ul>
            { list }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
