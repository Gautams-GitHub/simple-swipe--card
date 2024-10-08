// // Basic Router Setup
// console.log(location.pathname);

// window.addEventListener("popstate", (event) => {
//   loadPage(location.pathname);
// });

// window.addEventListener("load", (event) => {
//   loadPage(location.pathname);
// });
// window.addEventListener("hashchange", (event) => {
//   loadPage(location.pathname);
// });

// document.addEventListener("DOMContentLoaded", () => {
//   loadPage(window.location.pathname);
// });

// function navigateTo(path) {
//   history.pushState({}, path, window.location.origin + path);
//   loadPage(path);
// }

// function loadPage(path) {
//   console.log({ path });

//   if (path === "/") {
//     showHomePage();
//   } else if (path === "/feed") {
//     showFeedPage();
//   }
// }

// // Initial page load
// loadPage(window.location.pathname);

// function showHomePage() {
//   document.body.innerHTML = `
//     <div>
//       <h1>Welcome to the Home Page</h1>
//       <button id="navigateToFeed">Go to Feed</button>
//     </div>
//   `;

//   document.getElementById("navigateToFeed").addEventListener("click", () => {
//     navigateTo("/feed");
//   });
// }

// function showFeedPage() {
//   document.body.innerHTML = `<div class="container"></div>`; // You can keep your existing carousel HTML structure here.

//   // Call the function that sets up the carousel (the existing app logic)
//   main();
// }

const addSkeleton = () => {
  document
    .querySelectorAll(".cardImage, .cardTitle, .cardText")
    .forEach((element) => {
      element.classList.add("loading");
    });
};

const removeSkeleton = () => {
  document
    .querySelectorAll(".cardImage, .cardTitle, .cardText")
    .forEach((element) => {
      element.classList.remove("loading");
    });
};

// Assuming you want to apply skeleton loading before fetching data
addSkeleton();

async function main() {
  let cardData = [
    {
      content: "This is the first slide",
      title: "",
      src: "",
    },
  ];

  //
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbzT5JmVCYCxnTKQwgAwRbCYHM7LHYmR8B6M_eLGqQCMKeAo4xIC6JqvdDHe0AH4oaAFSA/exec"; // Replace with your Google Apps Script web app URL

  //
  try {
    const response = await fetch(apiUrl, {
      method: "GET", // or 'POST' if your API requires it
      // headers: {
      //   "Content-Type": "application/json", // Adjust as needed
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    cardDataFromAPI = JSON.parse(jsonData);
    cardData = cardData.concat(cardDataFromAPI);
    console.log("Data for today:", cardData, "\n", typeof cardData);
    cardData[cardData.length + 1] = {
      content: "This is the last slide",
      title: "",
      src: "",
    };
    console.log(cardData);

    // Process the data as needed
    // jsonData.forEach((item) => {
    //   console.log(`Title: ${item.title}`);
    //   console.log(`Content: ${item.content}`);
    //   console.log(`Source: ${item.src}`);
    // });
    removeSkeleton();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const containerClassElement = document.querySelector(".container");

  console.log({ cardData });

  containerClassElement.innerHTML = "";

  cardData.map((item, index) => {
    const itemClassElement = document.createElement("div");
    itemClassElement.className = "item";
    itemClassElement.key = index;

    containerClassElement.appendChild(itemClassElement);

    const cardClassElement = document.createElement("div");
    cardClassElement.className = "card";
    cardClassElement.key = index;
    itemClassElement.appendChild(cardClassElement);

    if (index === cardData.length - 1) {
      // Last slide
      cardClassElement.className += " lastSlide";
      cardClassElement.innerHTML = item.content;
    } else {
      // Regular slides
      cardClassElement.innerHTML = `<div class="cardTitle"></div>
        <img class="cardImage">
            <div class="cardText"></div>`;
      cardClassElement.querySelector(".cardImage").src = item.src;
      cardClassElement.querySelector(".cardImage").alt = item.src;
      cardClassElement.querySelector(".cardText").innerText = item.content;
      cardClassElement.querySelector(".cardTitle").innerText = item.title;
    }

    if (index === 0) {
      const slideIndicator = document.createElement("div");
      slideIndicator.className = "indicator";
      slideIndicator.innerHTML = `&#11207; SLIDE`;
      cardClassElement.appendChild(slideIndicator);
    }
  });

  let currentSlide = 0;
  let tempSlide = currentSlide;
  let nextSlide = Math.min(currentSlide + 1, cardData.length - 1);
  let delta = 0;
  let angle = 0;
  let initialTouch = 0;

  const items = document.querySelectorAll(".container > .item");

  items.forEach((i, index) => (i.style.zIndex = -index));
  items[currentSlide].classList.add("active");
  items[nextSlide].classList.add("next");

  // Buttons for sharing on WhatsApp and elsewhere

  // shareButton.innerHTML = "SHARE";
  const shareDiv = document.createElement("div");
  shareDiv.className = "shareDiv";
  // shareDiv.style.display = "flex";
  document.body.appendChild(shareDiv);
  const shareButtonIcon = document.createElement("img");
  // shareButtonIcon.style.marginBottom = "80px";

  shareButtonIcon.onclick = () => {
    if (navigator.share) {
      navigator.share({
        text: "Increase my reach!",
        url: "https://www.linkedin.com/in/gagan-gautam/",
        title: "Share",
      });
    } else {
      navigator.clipboard.write("https://www.linkedin.com/in/gagan-gautam/");
    }
  };
  shareButtonIcon.className = "bottomButtons";
  shareButtonIcon.src = "./shareIcon.png";
  shareButtonIcon.alt = "./shareIcon.png";

  shareDiv.appendChild(shareButtonIcon);

  function openWhatsApp() {
    window.open(
      "whatsapp://send?text=https://www.linkedin.com/in/gagan-gautam/"
    );
  }
  // shareWhatsAppButton.innerHTML = "SHARE ON WHATSAPP";
  const shareWSDiv = document.createElement("div");
  const shareWhatsAppButtonIcon = document.createElement("img");
  shareWhatsAppButtonIcon.onclick = openWhatsApp;
  shareWhatsAppButtonIcon.className = "bottomButtons";
  shareWhatsAppButtonIcon.src = "./whatsAppIcon2.png";
  shareWhatsAppButtonIcon.alt = "./whatsAppIcon.png";
  shareWSDiv.appendChild(shareWhatsAppButtonIcon);
  shareDiv.appendChild(shareWSDiv);

  function openToParticularWhatsApp() {
    window.open("https://wa.me/9479307300/?text=Hey%20There");
  }
  const shareToParticularWhatsAppButtonIcon = document.createElement("img");
  shareToParticularWhatsAppButtonIcon.innerHTML = "PARTICULAR";
  shareToParticularWhatsAppButtonIcon.onclick = openToParticularWhatsApp;
  shareToParticularWhatsAppButtonIcon.className = "bottomButtons";
  shareToParticularWhatsAppButtonIcon.src = "./whatsAppIcon2.png";
  shareToParticularWhatsAppButtonIcon.alt = "./whatsAppIcon.png";

  // shareToParticularWhatsAppButtonIcon.style.marginBottom = "40px";
  shareDiv.appendChild(shareToParticularWhatsAppButtonIcon);

  const undoButtonIcon = document.createElement("img");
  undoButtonIcon.id = "undoButton";
  undoButtonIcon.className = "bottomButtons";
  undoButtonIcon.src = "./undoIcon.png";
  undoButtonIcon.alt = "./undoIcon.png";

  shareDiv.appendChild(undoButtonIcon);
  // undoButton.innerHTML = `U`;
  // ................

  const initScroll = (event) => {
    if (currentSlide === items.length - 1) return; // Prevent sliding on the last slide
    initialTouch = event.clientX;
    containerClassElement.classList.add("sliding");
    containerClassElement.addEventListener("pointermove", moveScroll);
  };

  const moveScroll = (event) => {
    if (currentSlide === items.length - 1) return; // Prevent sliding on the last slide
    delta = initialTouch - event.clientX;
    angle = delta / 100;
    let scaling = 1 - Math.abs(delta) / 5000;

    let slide = tempSlide;
    tempSlide =
      delta < 0
        ? currentSlide === 0
          ? items.length - 1
          : Math.max(currentSlide - 1, 0)
        : currentSlide;

    if (tempSlide !== slide) {
      items[slide].style.transform = `none`;
    }

    items[
      tempSlide
    ].style.transform = `translateX(${-delta}px) rotate(${-angle}deg) scale(${scaling})`;
  };

  const endScroll = (event) => {
    console.log("ENDSCROLL");

    if (currentSlide === items.length - 1) return; // Prevent sliding on the last slide
    containerClassElement.removeEventListener("pointermove", moveScroll, false);
    containerClassElement.classList.remove("sliding");
    items[tempSlide].style.transform = `none`;

    if (Math.abs(delta) < 50) return;

    items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    currentSlide =
      delta > 0
        ? tempSlide == items.length - 1
          ? items.length - 1
          : Math.min(tempSlide + 1, items.length - 1)
        : tempSlide;
    items[currentSlide].classList.add("active");

    nextSlide =
      currentSlide == items.length - 1 ? items.length - 1 : currentSlide + 1;
    items[nextSlide].classList.add("next");
  };

  const undoSlide = () => {
    console.log({ currentSlide });
    if (currentSlide === 0) return; // Prevent undo on the first slide
    items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    currentSlide = currentSlide - 1;
    console.log({ currentSlide });
    items[currentSlide].classList.add("active");

    nextSlide = currentSlide == items.length - 1 ? 0 : currentSlide + 1;
    items[nextSlide].classList.add("next");
  };

  containerClassElement.addEventListener("pointerdown", initScroll);
  containerClassElement.addEventListener("pointerup", endScroll);
  containerClassElement.addEventListener("pointercancel", endScroll);

  document.getElementById("undoButton").addEventListener("click", undoSlide);
}

main();
