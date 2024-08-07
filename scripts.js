const cardData = [
  { content: "", title: "1 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG.png" },
  { content: "", title: "2 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG2.png" },
  { content: "", title: "3", src: "./examplePNG3.png" },
  { content: "", title: "4 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG2.png" },
  { content: "", title: "5 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG3.png" },
  { content: "", title: "6 ASSDFGHJKLQWERTYUIOP", src: "./examplePNG.png" },
  // { content:'',title: "", src:"" },
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
  // cardClassElement.textContent = item.content;
  itemClassElement.appendChild(cardClassElement);

  cardClassElement.innerHTML = `<div class="cardTitle"></div>
  <img class="cardImage">
      <div class="cardText"></div>`;

  cardClassElement.querySelector(".cardImage").src = item.src;
  cardClassElement.querySelector(".cardImage").alt = item.src;
  cardClassElement.querySelector(".cardText").innerText = item.content;
  cardClassElement.querySelector(".cardTitle").innerText = item.title;

  // const gibberishDummy = document.createElement("div");
  // gibberishDummy.innerText = `ASSDFGHJKLQWERTYUIOP`;
  // cardClassElement.appendChild(gibberishDummy);

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
    // params
    params = params || {};
    this.container = document.querySelector(params.container || ".container");
    this.items = document.querySelectorAll(
      (params.container || ".container") + " > " + (params.items || ".item")
    );

    // transition variables
    this.currentSlide = 0;
    this.tempSlide = this.currentSlide;
    this.nextSlide = Math.min(this.currentSlide + 1, this.items.length - 1);
    this.delta = 0;
    this.angle = 0;

    // handlers
    this.initHandler = (event) => this.initScroll(event);
    this.moveHandler = (event) => this.moveScroll(event);
    this.endHandler = (event) => this.endScroll(event);

    // listeners
    this.container.addEventListener("pointerdown", this.initHandler);
    this.container.addEventListener("pointerup", this.endHandler);
    this.container.addEventListener("pointercancel", this.endHandler);

    // set item order
    this.items.forEach((i, index) => (i.style.zIndex = -index));
    this.items[this.currentSlide].classList.add("active");
    this.items[this.nextSlide].classList.add("next");
  }

  initScroll(event) {
    // set initial values
    this.initialTouch = event.clientX;
    this.container.classList.add("sliding");
    this.container.addEventListener("pointermove", this.moveHandler);
  }

  moveScroll(event) {
    // transition values
    this.delta = this.initialTouch - event.clientX;
    this.angle = this.delta / 100;
    this.scaling = 1 - Math.abs(this.delta) / 5000;

    // limit direction on first and last items
    //if(Math.sign(this.delta) > 0 && this.currentSlide === this.items.length - 1) return;
    //else if(Math.sign(this.delta) < 0 && this.currentSlide === 0) return;

    // set different slide if right or left
    let slide = this.tempSlide;
    this.tempSlide =
      this.delta < 0
        ? this.currentSlide === 0
          ? this.items.length - 1
          : Math.max(this.currentSlide - 1, 0)
        : this.currentSlide;

    // prevent spam slide stuck
    if (this.tempSlide !== slide) {
      this.items[slide].style.transform = `none`;
    }

    // update slide position
    this.items[this.tempSlide].style.transform = `translateX(${-this
      .delta}px) rotate(${-this.angle}deg) scale(${this.scaling})`;
  }

  endScroll(event) {
    // reset values
    this.container.removeEventListener("pointermove", this.moveHandler, false);
    this.container.classList.remove("sliding");
    this.items[this.tempSlide].style.transform = `none`;

    // you need to slide up to 50px to go prev/next
    if (Math.abs(this.delta) < 50) return;

    // reset items classes
    this.items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    // set current slide
    this.currentSlide =
      this.delta > 0
        ? this.tempSlide == this.items.length - 1
          ? 0
          : Math.min(this.tempSlide + 1, this.items.length - 1)
        : this.tempSlide;
    this.items[this.currentSlide].classList.add("active");

    // set next slide
    this.nextSlide =
      this.currentSlide == this.items.length - 1 ? 0 : this.currentSlide + 1;
    this.items[this.nextSlide].classList.add("next");
  }

  undoSlide() {
    this.items.forEach((i) => {
      i.classList.remove("active");
      i.classList.remove("next");
    });

    this.currentSlide =
      this.currentSlide == 0 ? this.items.length - 1 : this.currentSlide - 1;
    this.items[this.currentSlide].classList.add("active");

    this.nextSlide =
      this.currentSlide == this.items.length - 1 ? 0 : this.currentSlide + 1;
    this.items[this.nextSlide].classList.add("next");
  }
}

new Caroustack();
