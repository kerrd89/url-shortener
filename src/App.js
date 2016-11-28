import React, { Component } from 'react';
import './css/reset.css';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="input-container">
          <input type="text" placeholder="url"/>
          <button>Submit</button>
        </div>
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
