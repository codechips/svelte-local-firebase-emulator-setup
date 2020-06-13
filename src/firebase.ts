import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/firebase-functions';

let firestore: firebase.firestore.Firestore | null = null;
let functions: firebase.functions.Functions | null = null;

// Naive implementation of Firebase init.
// For education purposes. Never store your config in source control!
const config = {
  apiKey: 'your-firebase-key',
  projectId: 'testing-firebase-emulators'
};

firebase.initializeApp(config);

const db = (): firebase.firestore.Firestore => {
  if (firestore === null) {
    firestore = firebase.firestore();
    // Snowpack's env variables. Does now work in Svelte files
    if (import.meta.env.MODE === 'development') {
      // firebase.firestore.setLogLevel('debug');
      firestore.settings({
        host: 'localhost:8080',
        ssl: false
      });
    }
  }
  return firestore;
};

const funcs = (): firebase.functions.Functions => {
  if (functions === null) {
    functions = firebase.app().functions();

    if (import.meta.env.MODE === 'development') {
      // tell Firebase where to find the Firebase functions emulator
      functions.useFunctionsEmulator('http://localhost:5001');
    }
  }
  return functions;
};

export { db, funcs };
