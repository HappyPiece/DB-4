import { get, set, ref, push } from '../firebase/firebase-database.js';
import { db } from './db-config.js';

function insert(path, data) {
  push(path, data);
}

async function select(query) {
  let snapshot = await get(query);

  if (!snapshot.exists()) {
    return null;
  }

  let response = [];

  snapshot.forEach((child) => {
    response.push({
      key: child.key,
      ...child.val(),
    });
    return false;
  });

  return response;
}

// function select(query) {
//   return get(query).then((snapshot) => {
//     if (!snapshot.exists()) {
//       return null;
//     }

//     // return snapshot;

//     let response = [];

//     snapshot.forEach((child) => {
//       response.push({
//         key: child.key,
//         ...child.val(),
//       });
//       return false;
//     });

//     return response;
//   });
// }

export { insert, select };
