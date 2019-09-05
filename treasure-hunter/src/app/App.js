import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { ActionButtons } from "./ActionButtons";
import axios from "axios";
import config from "config";
import { init } from "../db";

class App extends Component {
  state = {
    currentRoom: null
  };

  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(room => {
      this.setCurrentRoom(room);
    });
  }

  setCurrentRoom = currentRoom => {
    this.setState({ currentRoom });
  };

  render() {
    const { currentRoom } = this.state;

    return (
      <div className="App">
        <ActionButtons
          currentRoom={currentRoom}
          explore={this.explore}
          setCurrentRoom={this.setCurrentRoom}
        />
      </div>
    );
  }
}

export default App;
