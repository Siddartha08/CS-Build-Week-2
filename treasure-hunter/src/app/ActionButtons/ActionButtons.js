import React, { Component } from "react";
import { FlexRow } from "style";
import { Button } from "@material-ui/core";
import withData from "./data/withData";
import { explore } from "../../db";

class ActionButtons extends Component {
  move = dir => {
    // TODO look up room id in dictionary to see if we know the next room id and send that along if so

    this.props
      .move(dir)
      .then(room => {
        console.log(room);
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
          onClick={() => this.move("n")}
        >
          N
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.move("s")}
        >
          S
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.move("w")}
        >
          W
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.move("e")}
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

export default withData(ActionButtons);
