import axios from "axios";
import { addRoom, count, getRoom, updateRoom } from "../db";
import config from "config";

export const examine = itemOrPlayer => {
  //TODO do this
};

export const status = () => {
  //TODO do this
};

export const take = treasure => {
  //TODO do this
};

export const drop = treasure => {
  //TODO do this
};

export const pray = () => {
  //TODO do this
};

export const getOppositeDir = dir => {
  const opps = {
    n: "s",
    s: "n",
    e: "w",
    w: "e"
  };

  return opps[dir];
};

let cooling = 1;
export const move = (dir, nextRoomId) => {
  return new Promise((resolve, reject) => {
    if (cooling > 1) {
      setTimeout(() => {
        axios
          .post(`${config.API_PATH}/move`, {
            direction: dir,
            next_room_id: nextRoomId
          })
          .then(({ data }) => {
            cooling = data.cooldown;
            resolve(data);
          })
          .catch(err => reject(err));
      }, cooling);
    } else {
      axios
        .post(`${config.API_PATH}/move`, {
          direction: dir,
          next_room_id: nextRoomId
        })
        .then(({ data }) => {
          cooling = data.cooldown;
          resolve(data);
        })
        .catch(err => reject(err));
    }
  });
};

export const explore = async currentRoom => {
  cooling = currentRoom.cooldown;

  // if total rooms length is <500 proceed we can also change this to stop on button click instead
  const totalRooms = await count();

  if (totalRooms < 500) {
    // find an unvisited room in currentRoom.exits, set to "exit"
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
    let nextRoom = await move(Object.keys(exit)[0]);

    // look up room in db, if it doesn't exist add one. If it does, update exits
    let visitedRoom = await getRoom(nextRoom.room_id);
    if (!visitedRoom) {
      visitedRoom = await addRoom(nextRoom);
    } else {
      // update exits: set opposite exit of exit to currentRoom and set exit of currentRoom to visitedRoom
      //update currentRoom
      currentRoom.exits[Object.keys(exit)[0]] = visitedRoom.id;

      //update visitedRoom
      visitedRoom.exits[getOppositeDir(Object.keys(exit)[0])] = currentRoom.id;

      await updateRoom(currentRoom, currentRoom.id);
      await updateRoom(visitedRoom, visitedRoom.id);
    }

    // TODO examine current room
    // TODO check your status
    // TODO if there are items in the room and the weight does not exceed your encumbrance, pick it up
    // TODO if you're in a store, sell the treasure
    // TODO if you're at a shrine, pray

    console.log(visitedRoom);
    // recurse
  }
};
