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
  static allEvents = [];

  constructor(event) {
    this.start = event.start;
    this.duration = event.duration;
    this.title = event.title;
    this.task = document.createElement("div");
    this.closeBtn = document.createElement("button");
    this.width = 200;
    this.left = 0;
    Event.allEvents.push(this);
    Event.allEvents.sort((a, b) => {
      if (a.start > b.start) return 1;
      if (a.start < b.start) return -1;
      return 0;
    });
  }

  setWidth(value) {
    this.width = value;
  }

  setLeft(value) {
    this.left = value;
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
    this.closeBtn.innerText = "x";
    this.closeBtn.classList = "close-btn";
    this.closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      Event.allEvents.splice(
        Event.allEvents.findIndex((el) => this.title == el.title),
        1
      );
      Event.reRender(Event.allEvents);
    });
    this.task.prepend(this.closeBtn);

    tasksContainer.prepend(this.task);
    Event.checkTasksCrossing();
  }

  static checkTasksCrossing() {
    const n = Event.allEvents.length;
    const crossingGroup = new Map();

    for (let i = 0; i < n; i++) {
      const event = Event.allEvents[i];
      let group = 0;

      for (const [groupId, groupEvents] of crossingGroup) {
        const groupLastEvent = groupEvents[groupEvents.length - 1];
        if (groupLastEvent.start + groupLastEvent.duration > event.start) {
          group = groupId;
          break;
        }
      }

      if (group) {
        crossingGroup.get(group).push(event);
      } else {
        crossingGroup.set(crossingGroup.size, [event]);
      }
    }

    crossingGroup.forEach((groupEvents) => {
      groupEvents.forEach((event, index) => {
        const borderSize = 2;
        const groupSize = groupEvents.length;
        const totalSize = 200;
        const width = (totalSize - (groupSize - 1) * borderSize) / groupSize;
        event.setWidth(width);
        event.setLeft(index * (width + borderSize));
      });
    });
  }

  static reRender(tasksArray) {
    const tasksContainer = document.querySelector(".day-tasks");
    tasksContainer.innerHTML = "";
    Event.checkTasksCrossing();
    tasksArray.forEach((el) => {
      tasksContainer.prepend(el.task);
    });
  }

  static renderAll(tasksArray) {
    Event.allEvents.length = 0;

    tasksArray
      .map((el) => new Event(el))
      .forEach((el) => {
        el.createTask();
      });
  }
}

function addNewTask() {
  function convertStartTime(string) {
    const timeArr = string.split(":");
    const hours = Number(timeArr[0]) - 8;
    const minutes = Number(timeArr[1]);
    const startTime = hours * 60 + minutes;
    return startTime;
  }

  function convertEndTime(string) {
    const timeArr = string.split(":");
    const hours = Number(timeArr[0]) - 8;
    const minutes = Number(timeArr[1]);
    const timeAmount = hours * 60 + minutes;
    const duration = timeAmount - convertStartTime(eventStartTime.value);
    return duration;
  }

  const addEventBtn = document.querySelector("#addEventBtn");
  addEventBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const eventTitle = document.querySelector("#eventTitle");
    const eventStartTime = document.querySelector("#eventStartTime");
    const eventEndTime = document.querySelector("#eventEndTime");

    const newEvent = {
      start: convertStartTime(eventStartTime.value),
      duration: convertEndTime(eventEndTime.value),
      title: eventTitle.value,
    };

    tasks.push(newEvent);
    Event.checkTasksCrossing()
    Event.renderAll(tasks);
  });
}

addNewTask();

Event.renderAll(tasks);
