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
        <ActionButtons />
      </div>
    );
  }
}

export default App;
