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

  db = null;
  cooling = 1;

  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = `Token ${config.API_KEY}`;

    init().then(({ room, db }) => {
      this.db = db;
      this.setState({ currentRoom: room });
    });
  }

  move = dir => {
    return new Promise((resolve, reject) => {
      if (this.cooling > 1) {
        setTimeout(() => {
          axios
            .post(`${config.API_PATH}/move`, {
              direction: dir
            })
            .then(({ data }) => {
              this.cooling = data.cooldown;
              resolve(data);
            })
            .catch(err => reject(err));
        }, this.cooling);
      } else {
        axios
          .post(`${config.API_PATH}/move`, {
            direction: dir
          })
          .then(({ data }) => {
            this.cooling = data.cooldown;
            resolve(data);
          })
          .catch(err => reject(err));
      }
    });
  };

  explore = async () => {
    const { currentRoom } = this.state;

    this.cooling = currentRoom.cooldown;

    // if total rooms length is <500 proceed
    const totalRooms = await this.db.rooms.count();

    if (totalRooms < 500) {
      // find an unvisited room in currentRoom.exits, set to "exit"
      console.log(currentRoom);
      let exit;
      for (let ex of Object.keys(currentRoom.exits)) {
        if (currentRoom.exits[ex] === -1) {
          exit = { [ex]: currentRoom.exits[ex] };
        }
      }

      // if none exist and exists length is one, use the only exit
      if (!exit && Object.keys(currentRoom.exits).length === 1) {
        for (let ex of Object.keys(currentRoom.exits)) {
          exit = { [ex]: currentRoom.exits[ex] };
        }
      } else {
        // otherwise, use a random exit?
      }

      console.log(exit);

      // try to move
      let nextRoom = await this.move(Object.keys(exit)[0]);

      console.log(nextRoom);
    }

    // look up room in db, if it doesn't exist add one. If it does, update exits
    // update exits: set opposite exit of exit to prevRoom and set exit or prevRoom to currRoom
    // recurse
  };

  render() {
    const { currentRoom } = this.state;

    return (
      <div className="App">
        <ActionButtons currentRoom={currentRoom} explore={this.explore} />
      </div>
    );
  }
}

export default App;
