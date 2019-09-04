import axios from "axios";
import React, { Component } from "react";
import config from 'config'

export default WrappedComponent => {
  return class extends Component {
    constructor() {
      super();

      this.actions = {
        move(dir, nextRoomId) {
          let url = `${config.API_PATH}/move`;

          return axios
            .post(url, { direction: dir, next_room_id: nextRoomId })
            .then(({ data }) => {
              return data;
            })
            .catch(err => {
              throw err;
            });
        }
      };
    }

    render() {
      return (
        <WrappedComponent {...this.actions} {...this.state} {...this.props} />
      );
    }
  };
};
