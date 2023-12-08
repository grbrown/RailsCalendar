import { Controller } from "@hotwired/stimulus";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class extends Controller {
  static targets = ["start", "end", "title", "save", "delete"];

  userid = NaN;
  calendar = null;
  clickedEventInfo = { id: null };

  deleteEvent() {
    if (!this.clickedEventInfo.id) {
      console.error("could not find eventid");
      return;
    }
    const csrf = document.head.querySelector("meta[name=csrf-token]")?.content;
    const req = new Request(`/api/v1/events/${this.clickedEventInfo.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    });
    fetch(req).then((response) => {
      console.log(response.json());
      const clickedEvent = this.calendar.getEventById(this.clickedEventInfo.id);
      clickedEvent.remove();
      this.clickedEventInfo.id = null;
    });
  }

  saveEvent() {
    const start = this.startTarget.value;
    const end = this.endTarget.value;
    const title = this.titleTarget.value;

    if (!this.userid) {
      console.error("could not find userid");
      return;
    }

    if (!this.clickedEventInfo.id) {
      console.error("could not find eventid");
      return;
    }

    const myEvent = {
      title: title,
      start: start,
      end: end,
      user_id: this.userid,
    };
    const csrf = document.head.querySelector("meta[name=csrf-token]")?.content;
    const req = new Request(`/api/v1/events/${this.clickedEventInfo.id}`, {
      method: "PATCH",
      body: JSON.stringify(myEvent),
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    });
    fetch(req).then((response) => {
      console.log(response.json());
      const clickedEvent = this.calendar.getEventById(this.clickedEventInfo.id);
      clickedEvent.setProp("title", title);
    });
  }

  connect() {
    const csrf = document.head.querySelector("meta[name=csrf-token]")?.content;
    console.log("rendering calendar");
    var calendarEl = document.getElementById("calendar");

    const startTargetElement = this.startTarget;
    const endTargetElement = this.endTarget;
    const titleTargetElement = this.titleTarget;
    const clickedEventInfo = this.clickedEventInfo;
    this.calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      dateClick: function (info) {
        console.log(info);
        const events = this.getEvents();
        const clickedEvent = events.find((e) => e.startStr === info.dateStr);
        if (clickedEvent) {
          clickedEventInfo.id = clickedEvent.id;
          startTargetElement.value = clickedEvent.startStr;
          endTargetElement.value = clickedEvent.endStr;
          titleTargetElement.value = clickedEvent.title;
        } else {
          const myEvent = {
            title: "defaultEventName",
            start: info.dateStr,
            end: info.dateStr,
          };
          const req = new Request("/api/v1/events", {
            method: "POST",
            body: JSON.stringify(myEvent),
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrf,
            },
          });

          fetch(req).then((response) => {
            console.log(response.json());
          });
          calendar.addEvent(myEvent);
        }
      },
    });

    this.calendar.render();

    fetch("/api/v1/events")
      .then((response) => response.json())
      .then((events) => {
        console.log("events", events);

        events.forEach((event) => {
          this.userid = event.user_id;
          this.calendar.addEvent({
            title: event.title,
            start: event.start,
            end: event.end,
            id: event.id,
          });
        });
        console.log("calendar render complete");
      });
  }
}
