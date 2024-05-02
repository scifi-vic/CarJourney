import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASEAPIKEY,
  authDomain: "carjourney-4f2a8.firebaseapp.com",
  projectId: "carjourney-4f2a8",
  storageBucket: "carjourney-4f2a8.appspot.com",
  messagingSenderId: "624955961218",
  appId: "1:624955961218:web:5f5484d2160b33f8db299b",
  measurementId: "G-TKS4CHW4G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


console.log("Hello");

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

import { collection, query, getDoc, where, setDoc, doc} from "firebase/firestore"; 
import prompt from 'prompt-sync'

// WRITE DATA
async function  writeData(username)
{
  // Add a new document in collection "users"
  await setDoc(doc(db, "users", username), {

  // const prompt = require("prompt-sync")({ sigint: true });
  // const username = prompt("Add username: ");
  // console.log(`You are ${username}`);

  username: username

  });
};


// READ DATA 
async function readData(username) {

  const docRef = doc(db, "users", username);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

function main()
{

    const promp = prompt()
    console.log("Do you want to R/W?\n1. Read\n2. Write\n");

    const answer =  promp(">>> ");

    if(answer == '1'){
      console.log("Enter in a username:\n");
      const username = promp(">>> ")
      readData(username)
    }

    else if (answer == '2')
    {
    console.log("Enter in a username: ");
      const username = promp(">>> ")
      writeData(username);
      console.log('\nUsername added.')
    }
    else{
      return;
    }
    return 0;
};



main()