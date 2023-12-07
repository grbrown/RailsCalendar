import { Controller } from "@hotwired/stimulus";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class extends Controller {
  connect() {
    const csrf = document.head.querySelector("meta[name=csrf-token]")?.content;
    console.log(csrf);
    console.log("hello from calendar");
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
        // alert("Clicked on: " + info.dateStr);
        // alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
        // alert("Current view: " + info.view.type);
        // change the day's background color just for fun
        console.log(info);
        info.dateStr;
        const myEvent = {
          title: "mymeeting", // a property!
          start: info.dateStr, // a property!
          end: info.dateStr, // a property! ** see important note below about 'end' **
        };
        const req = new Request("/api/v1/events", {
          method: "POST",
          body: JSON.stringify(myEvent),
          headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        });
        //req.method = "POST";
        fetch(req).then((response) => console.log(response.json()));
        calendar.addEvent(myEvent);
        info.dayEl.style.backgroundColor = "red";
        console.log(calendar.getEvents());
      },
    });

    calendar.render();

    fetch("/api/v1/events")
      .then((response) => response.json())
      .then((events) => {
        console.log(events);
        events.forEach((event) => {
          console.log(JSON.stringify(event));
          calendar.addEvent({
            title: event.title,
            start: event.start,
            end: event.end,
          });
        });
      });

    fetch("/posts.json").then((response) => console.log(response.json()));
  }
}
