const tasks = [
  { start: 0, duration: 15, title: "Exercise" },
  { start: 25, duration: 30, title: "Travel to work" },
  { start: 30, duration: 30, title: "Plan day" },
  { start: 60, duration: 15, title: "Rewiev yesterday's commits" },
  { start: 100, duration: 15, title: "Code review" },
  { start: 180, duration: 90, title: "Have lucnh with John" },
  { start: 360, duration: 30, title: "Skype call" },
  { start: 370, duration: 45, title: "Follow up with designer" },
  { start: 405, duration: 30, title: "Push up branch" },
];

function createTimeline(start, hours) {
  const timeContainer = document.querySelector(".timeline");

  for (let i = start; i < start + hours; i++) {
    const hourPoint = document.createElement("div");
    const halfHourPoint = document.createElement("div");

    hourPoint.classList = "timePoint timePoint-hour";
    halfHourPoint.classList = "timePoint timePoint-half-hour";

    hourPoint.innerText = i + ":00";
    halfHourPoint.innerText = i + ":30";

    timeContainer.append(hourPoint);

    if (i === start + hours - 1) {
      return;
    }
    timeContainer.append(halfHourPoint);
  }
}

createTimeline(8, 10);

class Event {
  constructor(event) {
    this.start = event.start;
    this.duration = event.duration;
    this.title = event.title;
    this.task = document.createElement("div");
    this.closeBtn = document.createElement("button");
    this.width = 200;
    this.left = 52;
  }

  createTask() {
    const tasksContainer = document.querySelector(".day-tasks");
    const containerHeight = tasksContainer.getBoundingClientRect().height;

    const bottom = containerHeight - (this.start + this.duration) * 2;
    const minuteLength = this.duration * 2;

    this.task.classList = "task";
    this.task.innerText = this.title;
    this.task.style.height = `${minuteLength}px`;
    this.task.style.bottom = `${bottom}px`;
    this.task.style.width = `${this.width}px`;
    this.task.style.left = `${this.left}px`;
    this.task.dataset.start = this.start;
    this.task.dataset.duration = this.duration;
    this.task.addEventListener("dblclick ", (event) => {
      const form = document.createElement("form");
      const eventTitle = document.createElement("input");
      const eventStart = document.createElement("input");
      const eventEnd = document.createElement("input");
      
      console.log("click");
    });

    this.closeBtn.innerText = "x";
    this.closeBtn.classList = "close-btn";

    this.closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      event.target.parentElement.remove();
    });

    this.task.prepend(this.closeBtn);
    tasksContainer.prepend(this.task);
  }

  checkTasksCrossing() {
    const tasks = [...document.querySelectorAll(".task")];

    const taskArr = tasks.reverse();

    const n = tasks.length;

    for (let i = 0, j = 1; i < n, j < n; i++, j++) {
      if (
        +tasks[i].dataset.start + +tasks[i].dataset.duration >
        +tasks[j].dataset.start
      ) {
        tasks[j].style.width = `99px`;
        tasks[i].style.width = `99px`;
        tasks[i].style.left = `154px`;
        if (tasks[i].nextElementSibling.getBoundingClientRect().left === 154) {
          tasks[i].style.left = `52px`;
          tasks[i].previousElementSibling.style.left = `154px`;
        }
      }
    }
  }
}

const taskList = tasks.map((el) => new Event(el));
taskList.forEach((el) => {
  el.createTask();
  el.checkTasksCrossing();
});
