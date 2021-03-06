import { Component, OnInit } from '@angular/core';
import { DataService } from './../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  homePlayers: any[] = [];

  constructor(private _servicio: DataService) { }

  ngOnInit() {
    // Comparison function
    const cmp = (x: any, y: any) => {
      return (x > y) ? 1 : (x < y) ? -1 : 0;
    };

    this.homePlayers = this._servicio.readPlayers();

    // Sort
    this.homePlayers.sort(function(a, b) {
      // note the minus before -cmp, for descending order
      return cmp(
        [cmp(a.team, b.team)],
        [cmp(b.team, a.team)]
      );
    });

    console.log('HOME', this.homePlayers);
    this.countdown();
  }



  countdown() {
    const opium_countdowns = {
      payment: {
        date: 'Aug 09, 2020 23:59:59',
        element: 'countdown-money'
      },
      start: {
        date: 'Sep 12, 2020 16:00:00',
        element: 'countdown'
      }
    };

    if (new Date(opium_countdowns.payment.date).getTime() > new Date().getTime()) {
      this.timer(opium_countdowns.payment.date, opium_countdowns.payment.element);
    } else if (new Date(opium_countdowns.start.date).getTime() > new Date().getTime()) {
      this.timer(opium_countdowns.start.date, opium_countdowns.start.element);
    }
  }

  timer(fecha: string, elemento_id: string) {
    let now = new Date().getTime();
    const countDownDate = new Date(fecha).getTime();
    let distance = countDownDate - now;

    if (distance < 0) {
      document.getElementById('countdowns').style.display = 'none';
    } else {
      const periodo = elemento_id === 'countdown-money' ? `<div style="font-size: 0.8rem;">PLAZO DE RENOVACIÓN: <br> HASTA EL 09 AGOSTO</div>` : `<div style="font-size: 0.8rem;">LA LIGA COMIENZA EN...</div>`;
      document.getElementById('countdowns').innerHTML = `<div>${periodo}<i class="far ${elemento_id === 'countdown' ? 'fa-futbol' : 'fa-money-bill-alt'}"></i> <span id="${elemento_id}" class="countdowns">0d 0h 0m 0s</span></div>`;

      // Update the count down every 1 second
      setInterval(() => {
        now = new Date().getTime();
        distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result
        document.getElementById(elemento_id) ? document.getElementById(elemento_id).innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s` : null;
      }, 1000);
    }
  }
}
