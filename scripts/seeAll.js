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
const div = document.querySelector(".blogs-div");
const searchVal = document.querySelector("#search-value");
const specificPfp = document.querySelector("div .userImg");
const nameDiv = document.querySelector("div h1");
const emailDiv = document.querySelector("div div div h3");
const nameHead = document.querySelector("div .nameHead");
const burgerIcon = document.getElementById("burger-icon");
const mobileMenu = document.getElementById("mobile-menu");
const title = document.querySelector("title");

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

burgerIcon.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

let arr = [];

async function render() {
  const data = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(data);
  const userName = userDetails[0].name;
  const userPhoto = userDetails[0].photoURL;
  const userEmail = userDetails[0].email;
  title.innerHTML = `See All from ${userName}`;
  nameDiv.innerHTML = `All Posts from ${userName}`;
  nameHead.innerHTML = `${userName}`;
  emailDiv.innerHTML = `${userEmail}`;
  specificPfp.src = userPhoto;
  const userUid = userDetails[0].uid;
  const q = query(
    collection(db, "newPost"),
    orderBy("postDate", "desc"),
    where("uid", "==", userUid)
  );
  const querySnapshot = await getDocs(q);
  div.innerHTML = "";
  arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), docId: doc.id });
  });

  console.log(arr);
  printt(arr);

  searchVal.addEventListener("input", () => {
    const filteredVal = searchVal.value.toLowerCase();
    // console.log(filteredVal);
    const filteredArr = arr.filter((item) => {
      return (
        item.title.toLowerCase().includes(filteredVal) ||
        item.caption.toLowerCase().includes(filteredVal)
      );
    });
    printt(filteredArr);
  });

  function printt(posts) {
    div.innerHTML = "";
    posts.forEach((item, index) => {
      div.innerHTML += `
    <div style="font-family: 'Poppins', sans-serif;" class="bg-white  p-8 rounded-lg my-5  shadow-2xl max-w-xl  w-full " >
       <div class="flex gap-5">
       <div class="mb-4 text-center">
           <img src="${
             item.photoURL
           }" class="object-contain rounded-xl  w-32 h-32 mb-4" id="blog-img">
       </div>
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
   </div>
   </div>
  `;
    });
  }
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
