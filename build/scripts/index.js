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

const userPfp = document.querySelector(".userPfp");
const greetHead = document.querySelector("div h1");
const div = document.querySelector("div .blogs-div");
const burgerIcon = document.getElementById("burger-icon");
const mobileMenu = document.getElementById("mobile-menu");

onAuthStateChanged(auth, (user) => {
  document.querySelector(".logout-btn").addEventListener("click", () => {
    if (user) {
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        showConfirmButton: false,
        timer: 1500,
      });
      signOut(auth);
    } else {
      Swal.fire({
        icon: "error",
        title: "Youre Already Logged Out",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
  if (user) {
    const uid = user.uid;
    userPfp.src = user.photoURL;
    console.log(uid);
    render();
  } else {
    userPfp.src = "../assets/defaultuserprofile.png";
    console.log("No user logged in");
    render();
  }
});

function greetUser() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning Readers!";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon Readers!";
  } else if (currentHour >= 18 && currentHour < 24) {
    greeting = "Good Evening Readers!";
  } else {
    greeting = "Good Night Readers!";
  }
  greetHead.innerHTML = greeting;
}

greetUser();

burgerIcon.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

let arr = [];

async function render() {
  const q = query(collection(db, "newPost"), orderBy("postDate", "desc"));

  const querySnapshot = await getDocs(q);
  div.innerHTML = "";
  arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), docId: doc.id });
  });
  console.log(arr);
  arr.forEach((item, index) => {
    div.innerHTML += `
    <div style="font-family: 'Poppins', sans-serif;" class="bg-white p-8  rounded-lg my-5  shadow-2xl max-w-xl  w-full " >
       <div class="flex gap-5">
       <div class="mb-4 text-center">
           <img src="${
             item.photoURL
           }" class="rounded-xl w-32 h-32 mb-4" id="blog-img">
       </div >
<div class="w-1/2">
<h1 class="  text-3xl text-[#212529]">${item.title}</h1>
<div  class="">
<h3 class="text-sm mt-1 text-[#6C757D]">${item.displayName}</h5>
<h3 class="text-sm mt-1  text-[#6C757D]"> ${formatDate(
      item.postDate
    )}</h3></div>
</div>
  </div > 
   
   <div class=" relative">
   
   <p  class="text-[#868686]  text-[14px] font-light mt-2 whitespace-normal break-words">
   ${item.caption}
   </p>

   <a id="seeAll" class="cursor-pointer text-amber-500 hover:text-orange-500 absolute right-2 ">See all from this user</a>
   </div>
   </div>
  `;
  });
  const seeAll = document.querySelectorAll("#seeAll");

  seeAll.forEach((item, index) => {
    item.addEventListener("click", () => {
      console.log("btn clicked at index", index);
      let detailsArr = [];
      const obj = {
        uid: arr[index].uid,
        name: arr[index].displayName,
        email: arr[index].email,
        photoURL: arr[index].photoURL,
      };
      console.log(arr[index].photoURL);
      detailsArr.push(obj);

      const seeAlluid = JSON.stringify(detailsArr);
      localStorage.setItem("userDetails", seeAlluid);
      window.location = "../app/seeAll.html";
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
