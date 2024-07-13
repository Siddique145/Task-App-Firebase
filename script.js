import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRW67xWqKlF_MzGrB1G8ktw3x_5ttx0lM",
  authDomain: "my-first-project-30635.firebaseapp.com",
  projectId: "my-first-project-30635",
  storageBucket: "my-first-project-30635.appspot.com",
  messagingSenderId: "474960752073",
  appId: "1:474960752073:web:215fe17adf8e3e6ae58c18",
  measurementId: "G-11N5F7YV0G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const numbers_list = document.getElementById("numbers_list");
const add_number = document.getElementById("add_number");
const user_input = document.getElementById("user_input");
const numberCollection = collection(db, "number");

console.log(user_input.value);

getNumbersFromDb();
add_number.addEventListener("click", async () => {
  const number = user_input.value.trim();
  if (number === "") {
    Swal.fire("Add Something to the TaskBar!");
    docRef = false;
    return;
  }
  console.log(number);
  try {
    add_number.disabled = true;
    const docRef = await addDoc(numberCollection, {
      number,
    });
    add_number.disabled = false;
    getNumbersFromDb();
    console.log("Document written with ID: ", docRef.id);
    user_input.value = "";
  } catch (e) {
    add_number.disabled = false;
    console.error("Error adding document: ", e);
  }
});

async function getNumbersFromDb() {
  const querySnapshot = await getDocs(numberCollection);
  numbers_list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    var obj = doc.data();
    const li = `<li id= ${doc.id}> <b>${obj.number}</b>  <button> <i class="fa-solid fa-pen-to-square"></i> </button> <button> <i class="fa-solid fa-trash"></i> </button>  </li>`;
    numbers_list.innerHTML += li;
  });

  numbers_list.childNodes.forEach((node) => {
    node.children[1].addEventListener("click", async function () {
      node.children[1].disabled = false;
      const docRef = doc(db, "number", this.parentNode.id);
      const newNumber = prompt("New Number");

      await updateDoc(docRef, {
        number: newNumber,
      });
      console.log("Document update hogya he");
      getNumbersFromDb();
      node.children[1].disabled = true;
    });

    node.children[2].addEventListener("click", async function () {
      node.children[2].disabled = false;
      const docRef = doc(db, "number", this.parentNode.id);
      await deleteDoc(docRef);
      node.children[2].disabled = true;
      console.log("Doc deleted");
      getNumbersFromDb();
    });
  });
}
