import axios from "axios";
import { addRoom, count, getRoom, updateRoom } from "../db";
import config from "config";

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
const coolOff = () => {
  return new Promise((resolve, reject) => {
    if (cooling > 1) {
      setTimeout(() => {
        resolve(true);
      }, +cooling * 1000);
    } else {
      resolve(true);
    }
  });
};

export const examine = async itemOrPlayer => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/examine`, {
      name: itemOrPlayer
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const status = async () => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/status`)
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const take = async treasure => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/take`, {
      name: treasure
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const drop = async treasure => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/drop`, {
      name: treasure
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const sell = async item => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/sell`, {
      name: item,
      confirm: "yes"
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const pray = () => {
  //TODO do this
};

export const move = async (dir, nextRoomId) => {
  await coolOff();

  return axios
    .post(`${config.API_PATH}/move`, {
      direction: dir,
      next_room_id: nextRoomId
    })
    .then(({ data }) => {
      cooling = data.cooldown ? +data.cooldown : 15;
      return data;
    })
    .catch(err => {
      throw err;
    });
};

export const explore = async startingRoom => {
  let breadcrumbs = [];
  breadcrumbs.push(startingRoom);
  startingRoom = await addRoom(nextRoom);

  console.log(
    "starting room",
    JSON.stringify(startingRoom, null, 1),
    startingRoom.exits
  );

  cooling = startingRoom.cooldown;

  while (breadcrumbs.length) {
    // remove from stack, this is out current room
    const r = breadcrumbs.pop();

    let visitedAllDirs = true;
    for (let ex of Object.keys(r.exits)) {
      // if it is unvisited go that way
      if (r.exits[ex] === -1) {
        visitedAllDirs = false;
        const exit = { [ex]: r.exits[ex] };
        console.log("now heading ", exit);
        // try to move
        let nextRoom = await move(Object.keys(exit)[0]);

        // add it to the stack so we can backtrack
        breadcrumbs.push(nextRoom);

        // set our next room, visitedRoom
        let visitedRoom = await addRoom(nextRoom);

        // update visitedRoom exit with previous room id
        visitedRoom.exits[getOppositeDir(Object.keys(exit)[0])] = r.id;
        await updateRoom(visitedRoom, visitedRoom.id);

        // update previous room exist with visitedRoom id, this is same as marking it visited
        r.exits[Object.keys(exit)[0]] = visitedRoom.id;
        await updateRoom(r, r.id);

        console.log("now in", visitedRoom);
      }
    }

    if (visitedAllDirs) {
      // we've visited all directions for this room. we need to backtrack now
      const goBackTo = breadcrumbs[0],
        ids = Object.values(goBackTo.exits),
        ind = ids.indexOf(goBackTo.id),
        dir = Object.keys(goBackTo.exits)[ind];
      await move(dir);
    }
  }

  /*  // if there are items in the room, pick it up
  if (visitedRoom.items.length) {
    for (let item of visitedRoom.items) {
      const itemTaken = await take(item);
      console.log("item taken", itemTaken);
    }
  }

  // you're in a store, sell the treasure
  if (visitedRoom.title === "Store") {
    // get current inventory
    const status = await status();
    console.log("status:", status);

    // if there is inventory, sell each item
    if (status.inventory.length) {
      for (let item of status.inventory) {
        const soldItem = await sell(item);
        console.log("item sold: ", soldItem);
      }
    }
  }*/

  // TODO if you're at a shrine, pray

  // }
};
