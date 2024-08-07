const cardData = [
  { content: "", title: "1 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG.png" },
  { content: "", title: "2 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG2.png" },
  { content: "", title: "3", src: "./examplePNG3.png" },
  { content: "", title: "4 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG2.png" },
  { content: "", title: "5 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG3.png" },
  { content: "", title: "6 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG.png" },
  { content: "This is the last slide", title: "", src: "" }, // Last slide
];

const containerClassElement = document.querySelector(".container");

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

const undoButton = document.createElement("button");
undoButton.id = "undoButton";
containerClassElement.appendChild(undoButton);
undoButton.innerHTML = `UNDO`;

class Caroustack {
  constructor(params) {
    params = params || {};
    this.container = document.querySelector(params.container || ".container");
    this.items = document.querySelectorAll(
      (params.container || ".container") + " > " + (params.items || ".item")
    );

    this.currentSlide = 0;
    this.tempSlide = this.currentSlide;
    this.nextSlide = Math.min(this.currentSlide + 1, this.items.length - 1);
    this.delta = 0;
    this.angle = 0;

    this.initHandler = (event) => this.initScroll(event);
    this.moveHandler = (event) => this.moveScroll(event);
    this.endHandler = (event) => this.endScroll(event);

    this.container.addEventListener("pointerdown", this.initHandler);
    this.container.addEventListener("pointerup", this.endHandler);
    this.container.addEventListener("pointercancel", this.endHandler);

    this.items.forEach((i, index) => (i.style.zIndex = -index));
    this.items[this.currentSlide].classList.add("active");
    this.items[this.nextSlide].classList.add("next");

    document
      .getElementById("undoButton")
      .addEventListener("click", () => this.undoSlide());
  }

  initScroll(event) {
    if (this.currentSlide === this.items.length - 1) return; // Prevent sliding on the last slide
    this.initialTouch = event.clientX;
    this.container.classList.add("sliding");
    this.container.addEventListener("pointermove", this.moveHandler);
  }

  moveScroll(event) {
    if (this.currentSlide === this.items.length - 1) return; // Prevent sliding on the last slide
    this.delta = this.initialTouch - event.clientX;
    this.angle = this.delta / 100;
    this.scaling = 1 - Math.abs(this.delta) / 5000;

    let slide = this.tempSlide;
    this.tempSlide =
      this.delta < 0
        ? this.currentSlide === 0
          ? this.items.length - 1
          : Math.max(this.currentSlide - 1, 0)
        : this.currentSlide;

    if (this.tempSlide !== slide) {
      this.items[slide].style.transform = `none`;
    }

    this.items[this.tempSlide].style.transform = `translateX(${-this
      .delta}px) rotate(${-this.angle}deg) scale(${this.scaling})`;
  }

  endScroll(event) {
    if (this.currentSlide === this.items.length - 1) return; // Prevent sliding on the last slide
    this.container.removeEventListener("pointermove", this.moveHandler, false);
    this.container.classList.remove("sliding");
    this.items[this.tempSlide].style.transform = `none`;

    if (Math.abs(this.delta) < 50) return;

    this.items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    this.currentSlide =
      this.delta > 0
        ? this.tempSlide == this.items.length - 1
          ? this.items.length - 1
          : Math.min(this.tempSlide + 1, this.items.length - 1)
        : this.tempSlide;
    this.items[this.currentSlide].classList.add("active");

    this.nextSlide =
      this.currentSlide == this.items.length - 1
        ? this.items.length - 1
        : this.currentSlide + 1;
    this.items[this.nextSlide].classList.add("next");
  }

  undoSlide() {
    if (this.currentSlide === 0) return; // Prevent undo on the first slide
    this.items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    this.currentSlide = this.currentSlide - 1;
    this.items[this.currentSlide].classList.add("active");

    this.nextSlide = this.currentSlide + 1;
    this.items[this.nextSlide].classList.add("next");
  }
}

new Caroustack();
