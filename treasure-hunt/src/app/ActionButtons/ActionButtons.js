import React, { Component } from 'react'
import { FlexRow } from 'style'
import {
  Button
} from "@material-ui/core";
import withData from './data/withData'


class ActionButtons extends Component {
  move = dir => {
    // TODO look up room id in dictionary to see if we know the next room id and send that along if so

    this.props.move(dir).then(room => {
      console.log(room)
    }).catch(err => {})
  }

  render() {
    return (
      <FlexRow alignCenter>
        <Button onClick={() => this.move("n")}>N</Button>
      </FlexRow>
    )
  }

}

export default withData(ActionButtons)