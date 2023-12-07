import { Controller } from "@hotwired/stimulus";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class extends Controller {
  connect() {
    const csrf = document.head.querySelector("meta[name=csrf-token]")?.content;
    console.log("rendering calendar");
    var calendarEl = document.getElementById("calendar");
    var calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      dateClick: function (info) {
        const myEvent = {
          title: "mymeeting",
          start: info.dateStr,
          end: info.dateStr,
        };
        const req = new Request("/api/v1/events", {
          method: "POST",
          body: JSON.stringify(myEvent),
          headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        });
        fetch(req).then((response) => {
          console.log(response.json());
        });
        calendar.addEvent(myEvent);
      },
    });

    calendar.render();

    fetch("/api/v1/events")
      .then((response) => response.json())
      .then((events) => {
        console.log("events", events);
        events.forEach((event) => {
          calendar.addEvent({
            title: event.title,
            start: event.start,
            end: event.end,
          });
        });
      });
    console.log("calendar render complete");
  }
}
