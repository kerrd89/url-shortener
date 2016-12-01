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
      filterValue: "",
      activeFilter: "Date Created"
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
        return url;
      }
    });
    return urls;
  }

  sortBy(property) {
    const { urlList } = this.state;
    let sortedUrls = _.orderBy(urlList, [property]);
    this.setState({ urlList: sortedUrls });
  }

  componentDidMount() {
    this.getUrls();
  }

  render() {
    let input;
    let list;
    let urls = this.filterUrls(this.state.filterValue, this.state.activeFilter);

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

    if(!this.state.ascending && list) {list.reverse()}
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
              className="submit-button"
            >
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
              <input
                type="text"
                className="search-field"
                placeholder="Search Long URLs"
                onChange={(e) => this.setState({filterValue: e.target.value})}
              />
            </section>
            <table className="url-table">
              <thead>
                <tr>
                  <th className="table-headers">Title</th>
                  <th className="table-headers">Original URL</th>
                  <th className="table-headers">Short URL</th>
                  <th className="table-headers"
                    onClick={() => {
                      this.sortBy('createdAt')
                      this.setState({ascending: true, activeFilter: "Date Created"})
                    }}
                  >
                    Date Created {this.state.activeFilter === "Date Created" && '●'}
                  </th>
                  <th className="table-headers"
                    onClick={() => {
                      this.sortBy('count')
                      this.setState({ascending: false, activeFilter: "Popularity"})
                    }}
                  >Popularity {this.state.activeFilter === "Popularity" && '●'}
                  </th>
                  <th className="sort-button"
                    onClick={() => this.setState({ascending: !this.state.ascending})}
                  >
                  Sort {this.state.ascending ? "⬆︎" : "⬇︎"}
                  </th>
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
