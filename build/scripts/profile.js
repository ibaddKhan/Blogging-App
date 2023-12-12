import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

import { auth, storage, db } from "./config.js";

const logoutBtn = document.querySelector(".logout-btn");
const pfpImg = document.querySelector("#pfpImg");
const oldPass = document.querySelector("#oldPass");
const newPass = document.querySelector("#newPass");
const repeatPass = document.querySelector("#RepeatPass");
const nameHolder = document.querySelector("form div .nameHead");
const burgerIcon = document.getElementById("burger-icon");
const mobileMenu = document.getElementById("mobile-menu");
const editName = document.querySelector("form div i");
const updatedImg = document.querySelector(" div #updatedImg");

const form = document.querySelector("#form");

let obj = {};

onAuthStateChanged(auth, async (user) => {
  logoutBtn.addEventListener("click", () => {
    if (user) {
      signOut(auth);
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Already Logged Out",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

  if (user) {
    const uid = user.uid;
    rendernewData(user);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const querySnapshot = await getDocs(
        query(collection(db, "userDetails"), where("uid", "==", uid))
      );
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().pass}`);
        obj.pass = doc.data().pass;
        obj.docId = doc.id;
      });
      console.log(obj);
      if (oldPass.value !== obj.pass) {
        Swal.fire({
          icon: "error",
          title: "Incorrect Old Password",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      if (oldPass.value === newPass.value) {
        Swal.fire({
          icon: "warning",
          title: "Passwords cannot be same",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      if (newPass.value !== repeatPass.value) {
        Swal.fire({
          icon: "warning",
          title: "Passwords are not same",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      await updatePassword(user, newPass.value)
        .then(async () => {
          await updateDoc(doc(db, "userDetails", obj.docId), {
            pass: newPass.value,
          });
          Swal.fire({
            icon: "success",
            title: "Password Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          form.reset();
        })

        .catch((error) => {
          const errorMessage = error.message;
          Swal.fire({
            icon: "error",
            title: errorMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    });

    editName.addEventListener("click", async () => {
      const newName = prompt("Enter a new name");
      if (newName === "") {
        return;
      }
      await updateProfile(user, {
        displayName: newName,
      });
      rendernewData(user);
    });
    updatedImg.addEventListener("change", () => {
      const selectImg = updatedImg.files[0];

      if (!selectImg) {
        return;
      }
      Swal.fire({
        title: "Do you want Update Picture?",
        showDenyButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't Update`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const storageRef = ref(storage, user.email);
          await uploadBytes(storageRef, selectImg);
          const url = await getDownloadURL(storageRef);
          console.log(url);
          Swal.fire("Changed!");
          await updateProfile(user, {
            photoURL: url,
          });
          rendernewData(user);
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved");
          return;
        }
      });
    });
    console.log(user);
  } else {
    setTimeout(() => {
      window.location = "../app/login.html";
    }, 1000);
  }
});

burgerIcon.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

function rendernewData(user) {
  pfpImg.src = user.photoURL;
  nameHolder.innerHTML = user.displayName;
}
