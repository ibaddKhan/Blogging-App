import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { auth } from "./config.js";

const email = document.querySelector("#email");
const password = document.querySelector("#pass");
const form = document.querySelector("form");
const button = document.querySelector("#btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(email.value);
  console.log(password.value);
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        icon: "success",
        title: "Logged in as " + " " + user.displayName,
        showConfirmButton: false,
        timer: 1500,
      });
      window.location = "../app/profile.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(errorMessage);
    });
});
