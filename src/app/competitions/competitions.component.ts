import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  constructor() {
    // COUNTDOWN
    // Set the date we're counting down to

    const FOCup = [
      // SORTEO
      {
        deadline: new Date('Sep 28, 2018 22:30:00').getTime(),
        date: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        distance: 0,
        text: ''
      },
      // COMIENZO
      {
      deadline: new Date('Oct 05, 2018 21:00:00').getTime(),
      date: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      distance: 0,
      text: ''
    }
    ];

    const Champions = [
      // SORTEO
      {
        deadline: new Date('Dec 22, 2018 22:30:00').getTime(),
        date: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        distance: 0,
        text: ''
      },
      // COMIENZO
      {
        deadline: new Date('Jan 04, 2019 19:00:00').getTime(),
        date: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        distance: 0,
        text: ''
      }
    ];

    const EuropaLeague = {
      deadline: new Date('Feb 17, 2019 20:00:00').getTime(),
      date: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      distance: 0,
      text: ''
    };

    const Competitions = [FOCup[0], FOCup[1], Champions[0], Champions[1], EuropaLeague];

    // Update the count down every 1 second
    setInterval(function() {
      // console.log('seconddd');
      // Get todays date and time
      const now = new Date().getTime();

      Competitions.forEach((competition)=>{
        // Find the distance between now an the count down date
        competition.distance = competition.deadline - now;
        // Time calculations for days, hours, minutes and seconds
        competition.date.days = Math.floor(competition.distance / (1000 * 60 * 60 * 24));
        competition.date.hours = Math.floor((competition.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        competition.date.minutes = Math.floor((competition.distance % (1000 * 60 * 60)) / (1000 * 60));
        competition.date.seconds = Math.floor((competition.distance % (1000 * 60)) / 1000);
        // If the count down is over, write some text
        if (competition.distance < 0) {
          clearInterval();
          competition.text = 'COMENZADA!!';
        } else {
          competition.text = `${competition.date.days}d ${competition.date.hours}h 
                              ${competition.date.minutes}m ${competition.date.seconds}s`;
        }
      });

      // Output the result validating that the element exists
      document.getElementById('countdown-draw-FOCup') !== null ? document.getElementById('countdown-draw-FOCup').innerHTML = FOCup[0].text : null;
      document.getElementById('countdown-FOCup') !== null ? document.getElementById('countdown-FOCup').innerHTML = FOCup[1].text : null;
      document.getElementById('countdown-draw-Champions') !== null ? document.getElementById('countdown-draw-Champions').innerHTML = Champions[0].text : null;
      document.getElementById('countdown-Champions') !== null ? document.getElementById('countdown-Champions').innerHTML = Champions[1].text : null;
      document.getElementById('countdown-EuropaLeague') !== null ? document.getElementById('countdown-EuropaLeague').innerHTML = EuropaLeague.text : null;
    }, 1000);
  }

  ngOnInit() {  }
}
