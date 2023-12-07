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
          title: "The Title", // a property!
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
    calendar.addEvent({
      title: "stock event",
      start: "2023-12-01",
      end: "2023-12-01",
      editable: true,
    });
    calendar.render();

    fetch("/api/v1/events.json").then((response) =>
      console.log(response.json())
    );

    fetch("/posts.json").then((response) => console.log(response.json()));
  }
}
