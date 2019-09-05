import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { ActionButtons } from "./ActionButtons";
import axios from "axios";
import config from "config";
import db from "../db";

class App extends Component {
  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    db.table("treasureMap")
      .toArray()
      .then(map => {
        this.setState({ map });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
