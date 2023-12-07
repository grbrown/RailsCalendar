import { Controller } from "@hotwired/stimulus";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class extends Controller {
  connect() {
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
        calendar.addEvent(myEvent);
        info.dayEl.style.backgroundColor = "red";
      },
    });
    calendar.render();
  }
}
