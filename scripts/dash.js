import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { auth, storage, db } from "./config.js";

const logoutBtn = document.querySelector(".logout-btn");
const nameHolder = document.querySelector("nav div h1");
const profilePic = document.querySelector("nav div .userPfp");
const form = document.querySelector("form");
const postTitle = document.querySelector("div form #title");
const div = document.querySelector("div div .blogs-div");
const postCaption = document.querySelector("div form #caption");

let arr = [];
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    render(uid, user);
    nameHolder.innerHTML = user.displayName;
    logoutBtn.addEventListener("click", () => {
      console.log("Log out working");
      signOut(auth);
    });

    const Toast = Swal.mixin({
      color: "#4b0082",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      iconColor: "#b5b3f4",
      icon: "success",
      title: "Hey, " + user.displayName,
    });
    profilePic.src = user.photoURL;
    console.log(user);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("working");
      try {
        const docRef = await addDoc(collection(db, "newPost"), {
          title: postTitle.value,
          caption: postCaption.value,
          uid: user.uid,
          photoURL: user.photoURL,
          email: user.email,
          displayName: user.displayName,
          postDate: Timestamp.fromDate(new Date()),
        });
        Swal.fire({
          icon: "success",
          title: "Published",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.log(error.message);
      }

      setTimeout(() => {
        render(uid, user);
      }, 1800);
    });
  } else {
    console.log("not a user");
    window.location = "../app/signup.html";
  }
});

async function render(uid, user) {
  const q = query(
    collection(db, "newPost"),
    where("uid", "==", uid),
    orderBy("postDate", "desc")
  );

  const querySnapshot = await getDocs(q);
  div.innerHTML = "";
  arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), docId: doc.id });
  });

  console.log(arr);
  arr.forEach((item, index) => {
    div.innerHTML += `
    <div style="font-family: 'Poppins', sans-serif;" class="bg-white p-8 rounded-lg my-5  shadow-2xl max-w-xl  w-full " >
       <div class="flex gap-5">
       <div class="mb-4 text-center">
           <img src="${
             item.photoURL
           }" class="rounded-xl object-contain w-32 h-28 mb-4" id="blog-img">
       </div >
       <div class="w-1/2">
       <h1 class="text-3xl flex wrap text-[#212529]">${item.title}</h1>
       <div  class="">
<h3 class="text-sm mt-1 text-[#6C757D]">${item.displayName}</h5>
<h3 class="text-sm mt-1  text-[#6C757D]"> ${formatDate(
      item.postDate
    )}</h3></div>
</div>
  </div > 

   <p  class="text-[#868686] text-[14px] font-light mt-2 whitespace-normal break-words">
   ${item.caption}
   </p>

   

   <div class="flex mt-3 text-sm">
   <btn  href="#" id="remove-btn" class="font- cursor-pointer bg-transparent border-none text-[#7749F8] text-lg  mr-20" >Delete</btn>
   <btn  href="#" id="edit-btn" class="font- cursor-pointer bg-transparent border-none text-[#7749F8]  text-lg mr-20" >Edit</btn>
   </div>
   
   </div>
  `;
  });
  const removeBtn = document.querySelectorAll("#remove-btn");
  const editBtn = document.querySelectorAll("#edit-btn");

  removeBtn.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      console.log("removed at index " + index);

      try {
        Swal.fire({
          title: "Do you want Delete?",
          showDenyButton: true,
          confirmButtonText: "Delete",
          denyButtonText: `No`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteDoc(doc(db, "newPost", arr[index].docId));
            render(uid, user);
            Swal.fire("Deleted!");
          }
        });
      } catch (error) {
        console.error("Error deleting document: ", error.message);
      }
    });
  });
  editBtn.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      console.log("edit at index " + index);

      const editType = prompt("What do you want to edit? (title/caption)");

      if (editType === "title") {
        const newTitle = prompt("Enter new Title");
        if (newTitle == null || newTitle == "") {
          return;
        }

        try {
          const cityRef = doc(db, "newPost", arr[index].docId);

          await updateDoc(cityRef, {
            title: newTitle,
          });

          render(uid, user);
        } catch (error) {
          console.error("Error updating document: ", error.message);
        }
      } else if (editType === "caption") {
        const newCaption = prompt("Enter new Caption");
        if (newCaption == null || newCaption == "") {
          return;
        }

        try {
          const cityRef = doc(db, "newPost", arr[index].docId);

          await updateDoc(cityRef, {
            caption: newCaption,
          });

          render(uid, user);
        } catch (error) {
          console.error("Error updating document: ", error.message);
        }
      }
    });
  });
}
function formatDate(timestamp) {
  const dateObject = timestamp.toDate();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return dateObject.toLocaleDateString("en-US", options);
}
