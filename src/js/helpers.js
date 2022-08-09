// Timeout function only for the rejected promises (after X amount of seconds).

import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Refactored fetch && send function.

// Exporting function to getJSON (fetching API, converting the results to JSON)
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Fetching an API
    const fetchPro = uploadData
      ? fetch(url, {
          // Type of request
          method: 'POST',
          // Snipptes of text which are like information about the request of itself.Specifying in the request that the data we're gonna send is going to be in JSON format.
          headers: {
            'Content-Type': 'application/json',
          },
          // The actual data we're going to "POST" to the browser converted into JSON strings.
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // The fetch request racing with an timeout function so the request don't take forever to load.
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Converting the promise we fetched to an object and storing the data
    const data = await res.json();
    // Checking for the status of the API (Promise) if it's not throwing error manually.
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // Resolved Promise that comes from getJSON function
    return data;
  } catch (error) {
    // Catching the error we threw manually before for the faulty response and alerting it to the UI, then throwing it again so it displays the console.error from model.js

    throw error;
  }
};

// Fetching && sending API with 2 functions

// export const getJSON = async function (url) {
//   try {
//     // Fetching an API
//     const fetchPro = fetch(url);
//     // The fetch request racing with an timeout function so the request don't take forever to load.
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // Converting the promise we fetched to an object and storing the data
//     const data = await res.json();
//     // Checking for the status of the API (Promise) if it's not throwing error manually.
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     // Resolved Promise that comes from getJSON function
//     return data;
//   } catch (error) {
//     // Catching the error we threw manually before for the faulty response and alerting it to the UI, then throwing it again so it displays the console.error from model.js

//     throw error;
//   }
// };

// // Accept the url and the data as an parameters that we're going to upload to the browser (uploadData)
// export const sendJSON = async function (url, uploadData) {
//   try {
//     // Fetching an API
//     const fetchPro = fetch(url, {
//       // Type of request
//       method: 'POST',
//       // Snipptes of text which are like information about the request of itself.Specifying in the request that the data we're gonna send is going to be in JSON format.
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       // The actual data we're going to "POST" to the browser converted into JSON strings.
//       body: JSON.stringify(uploadData),
//     });
//     // The fetch request racing with an timeout function so the request don't take forever to load.
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // Converting the promise we fetched to an object and storing the data also awaiting any data coming back (the Forkify API will return the data we just sent).
//     const data = await res.json();
//     // Checking for the status of the API (Promise) if it's not throwing error manually.
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     // Resolved Promise that comes from getJSON function
//     return data;
//   } catch (error) {
//     // Catching the error we threw manually before for the faulty response and alerting it to the UI, then throwing it again so it displays the console.error from model.js

//     throw error;
//   }
// };
