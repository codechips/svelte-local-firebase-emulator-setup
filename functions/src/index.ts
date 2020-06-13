import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onCall((data, context) => {
  return { message: 'Hello from Firebase!' };
});
