import React, { Component } from "react";
import { FlexRow } from "style";
import { Button } from "@material-ui/core";
import { move } from "../actions";

class ActionButtons extends Component {
  moveAndSetCurrentRoom = dir => {
    // TODO look up room id in dictionary to see if we know the next room id and send that along if so

    move(dir)
      .then(room => {
        this.props.setCurrentRoom(room);
      })
      .catch(err => {});
  };

  render() {
    const { currentRoom, explore } = this.props;

    return (
      <FlexRow alignCenter>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("n")}
        >
          N
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("s")}
        >
          S
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("w")}
        >
          W
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.moveAndSetCurrentRoom("e")}
        >
          E
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={explore}
          disabled={!currentRoom}
        >
          Explore
        </Button>
      </FlexRow>
    );
  }
}

export default ActionButtons;
