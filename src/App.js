import React, { Component } from 'react';
import axios from 'axios';
import './css/reset.css';
import './css/App.css';
import _ from 'lodash';
import moment from 'moment';
const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayShortUrl: null,
      urlList: [],
      ascending: true,
      filterValue: ""
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
    if(!regexp.test(input)) {
      this.setState({displayShortUrl: "Not a valid URL"});
      return;
    }

    axios.post(`/post`, {
      url: input
    })
      .then((response) => {
        this.setState({displayShortUrl: "http://localhost:3001/api/" + response.data});
        this.getUrls();
      })
      .catch((error) => {
        console.log(error);
        this.setState({displayShortUrl: error});
      });
  }

  filterUrls(searchValue) {
    let urls = this.state.urlList.filter(url => {
      if (url.longUrl.indexOf(searchValue.toLowerCase()) >= 0) {
        console.log('filtered URL', url);
        return url;
      }
    });
    return urls;
    // this.setState({ filteredUrls: urls });
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

// TODO: ternary here to display regular list or filtered list?

    let urls = this.filterUrls(this.state.filterValue);
    console.log(urls)
    if(urls.length){
      list = urls.map((url) => {
        return(
          <tr key={url.shortID}
            className="url-row"
          >
            <td>{url.title}</td>
            <td><a href={url.longUrl}>{url.longUrl}</a></td>
            <td><a href={"http://localhost:3001/api/"+url.shortID}>{url.shortID}</a></td>
            <td>{moment(url.createdAt).format('MMM Do, h:mm a')}</td>
            <td>{url.count}</td>
          </tr>
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
            placeholder="Type your url here"
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
          <section className="list-controls">
            <div className="search-container">
              <input
                type="text"
                className="search-field"
                placeholder="Search Long URLs"
                onChange={(e) => this.setState({filterValue: e.target.value})}
              />
            </div>
            <div className="pop-sort">
              <button
                onClick={() => this.sortBy('count', 'desc')}
                className="sort-button"
              >
                Popularity ⬆︎
              </button>
              <button
                onClick={() => this.sortBy('count', 'asc')}
                className="sort-button"
              >
                Popularity ⬇︎
              </button>
            </div>
            <div className="date-sort">
              <button
                onClick={() => this.sortBy('createdAt', 'desc')}
                className="sort-button"
              >
                Date ⬆︎
              </button>
              <button
                onClick={() => this.sortBy('createdAt', 'asc')}
                className="sort-button"
              >
                Date ⬇︎
              </button>
            </div>

          </section>

          <table className="url-table">
            <thead>
              <tr>
                <th className="table-headers">Title</th>
                <th className="table-headers">Original URL</th>
                <th className="table-headers">Short URL</th>
                <th className="table-headers">Date Created</th>
                <th className="table-headers">Popularity</th>
              </tr>
            </thead>
            <tbody>
              { list }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
