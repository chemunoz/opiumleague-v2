import { Component, OnInit } from '@angular/core';
import { DataService } from './../data.service';
import { ChampionsService } from '../champions.service';

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.css']
})
export class ChampionsComponent implements OnInit {
  championsCountdowns: any = [];
  championsRounds: any = [];
  championsGroups: any = [];
  // 0 = equipo bombo A, 1 = equipo bombo B, 2 = equipo bombo C, 3 = equipo bombo D
  championsGroupsSchedule = [
    { match1: [0, 1], match2: [2, 3] },
    { match1: [3, 0], match2: [1, 2] },
    { match1: [2, 0], match2: [3, 1] },
    { match1: [0, 2], match2: [1, 3] },
    { match1: [1, 0], match2: [3, 2] },
    { match1: [2, 1], match2: [0, 3] }
  ];
  players: any = [];
  championsTables: any = {};

  constructor(private _servicioData: DataService,
              private _servicioChampions: ChampionsService) {}

  ngOnInit() {
    this.championsCountdowns = this._servicioChampions.getCountdowns();
    this.initCountDowns();

    this.players = this._servicioData.readPlayers();
    this.players.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    console.log(this.players);

    this.championsGroups = this._servicioChampions.getGroups();
    this.championsRounds = this._servicioChampions.getRounds();
    this.calculateTables();
  }

  initCountDowns() {
    const Competitions = [this.championsCountdowns[0], this.championsCountdowns[1]];

    // Update the count down every 1 second
    const x = setInterval(() => {
      // Get todays date and time
      const now = new Date().getTime();

      if (Competitions.length === 0) {
        clearInterval(x);
      }
      Competitions.forEach((competition, index) => {
        // Find the distance between now an the count down date
        const countDownDate = new Date(competition.deadline).getTime();
        const distance = countDownDate - now;
        let text = '';

        competition.distance = distance;
        if (distance < 0) {
          // If the count down is over, write some text
          text = 'COMENZADA!!';
          Competitions.splice(index, 1);
        } else {
          // Time calculations for days, hours, minutes and seconds
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        // Output the result validating that the element exists
        if (document.getElementById(competition.element) !== null) {
          document.getElementById(competition.element).innerHTML = text;
        }
      });
    }, 1000);
  }

  calculateRounds(group: any) {
    // console.log("CALCULAR RONDAS", group);
    this.championsRounds.forEach((champions_round: any, index: number) => {
      if (this.players[group.teams[0]].points[champions_round.round] !== null) {
        // PARTIDOS
        const partido1 = {
          home: group.teams[this.championsGroupsSchedule[index]['match1'][0]],
          away: group.teams[this.championsGroupsSchedule[index]['match1'][1]]
        };
        const partido2 = {
          home: group.teams[this.championsGroupsSchedule[index]['match2'][0]],
          away: group.teams[this.championsGroupsSchedule[index]['match2'][1]]
        };

        this.championsTables[group.name]['rounds'].push(
          {
            match1: [
              {
                id: partido1.home,
                score: this.players[partido1.home].points[champions_round.round]
              },
              {
                id: partido1.away,
                score: this.players[partido1.away].points[champions_round.round]
              }
            ],
            match2: [
              {
                id: partido2.home,
                score: this.players[partido2.home].points[champions_round.round]
              },
              {
                id: partido2.away,
                score: this.players[partido2.away].points[champions_round.round]
              }
            ]
          }
        );

        // CLASIFICACION
        const home1 = this.championsTables[group.name]['table'].find(x => x.id === partido1.home);
        const away1 = this.championsTables[group.name]['table'].find(x => x.id === partido1.away);
        const home2 = this.championsTables[group.name]['table'].find(x => x.id === partido2.home);
        const away2 = this.championsTables[group.name]['table'].find(x => x.id === partido2.away);
        [home1, away1, home2, away2].forEach((team: any, index: number) => {
          team.pj += 1;
          switch (index) {
            case 0:
              team.pf += this.players[partido1.home].points[champions_round.round];
              team.pc += -this.players[partido1.away].points[champions_round.round];
              if (team.max < this.players[partido1.home].points[champions_round.round]) {
                team.max = this.players[partido1.home].points[champions_round.round];
              }
              if (Math.abs(this.players[partido1.home].points[champions_round.round]) > Math.abs(this.players[partido1.away].points[champions_round.round])) {
                team.score += 3;
                team.pg += 1;
              } else if (Math.abs(this.players[partido1.home].points[champions_round.round]) === Math.abs(this.players[partido1.away].points[champions_round.round])) {
                team.score += 1;
                team.pe += 1;
              } else {
                team.pp += 1;
              }
              break;
            case 1:
              team.pf += this.players[partido1.away].points[champions_round.round];
              team.pc += -this.players[partido1.home].points[champions_round.round];
              if (team.max < this.players[partido1.away].points[champions_round.round]) {
                team.max = this.players[partido1.away].points[champions_round.round];
              }
              if (Math.abs(this.players[partido1.away].points[champions_round.round]) > Math.abs(this.players[partido1.home].points[champions_round.round])) {
                team.score += 3;
                team.pg += 1;
              } else if (Math.abs(this.players[partido1.home].points[champions_round.round]) === Math.abs(this.players[partido1.away].points[champions_round.round])) {
                team.score += 1;
                team.pe += 1;
              } else {
                team.pp += 1;
              }
              break;
            case 2:
              team.pf += this.players[partido2.home].points[champions_round.round];
              team.pc += -this.players[partido2.away].points[champions_round.round];
              if (team.max < this.players[partido2.home].points[champions_round.round]) {
                team.max = this.players[partido2.home].points[champions_round.round];
              }
              if (Math.abs(this.players[partido2.home].points[champions_round.round]) > Math.abs(this.players[partido2.away].points[champions_round.round])) {
                team.score += 3;
                team.pg += 1;
              } else if (Math.abs(this.players[partido2.home].points[champions_round.round]) === Math.abs(this.players[partido2.away].points[champions_round.round])) {
                team.score += 1;
                team.pe += 1;
              } else {
                team.pp += 1;
              }
              break;
            case 3:
              team.pf += this.players[partido2.away].points[champions_round.round];
              team.pc += -this.players[partido2.home].points[champions_round.round];
              if (team.max < this.players[partido2.away].points[champions_round.round]) {
                team.max = this.players[partido2.away].points[champions_round.round];
              }
              if (Math.abs(this.players[partido2.away].points[champions_round.round]) > Math.abs(this.players[partido2.home].points[champions_round.round])) {
                team.score += 3;
                team.pg += 1;
              } else if (Math.abs(this.players[partido2.home].points[champions_round.round]) === Math.abs(this.players[partido2.away].points[champions_round.round])) {
                team.score += 1;
                team.pe += 1;
              } else {
                team.pp += 1;
              }
              break;
            default:
              team.pf = 0;
              team.pc = 0;
              team.max = 0;
              break;
          }
          team.dif = (team.pf + team.pc);
        });

      }
    });
  }

  calculateTables() {
    // Comparison function
    const cmp = (x, y) => {
      return (x > y) ? 1 : (x < y) ? -1 : 0;
    };

    this.championsGroups.forEach((group: any) => {
      this.championsTables[group.name] = {
        table: [],
        rounds: []
      };
      group.teams.forEach((team: any) => {
        this.championsTables[group.name]['table'].push({
          id: team,
          score: 0,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          pf: 0,
          pc: 0,
          dif: 0,
          max: 0
        });
      });
      this.calculateRounds(group);
      this.championsTables[group.name]['table'].sort(function(a: any, b: any) {
        // note the minus before -cmp, for descending order
        return cmp(
          [-cmp(a.score, b.score), -cmp(a.dif, b.dif), -cmp(a.max, b.max)],
          [-cmp(b.score, a.score), -cmp(b.dif, a.dif), -cmp(b.max, a.max)]
        );
      });
    });

    console.log("CLASIFICACIONES", this.championsTables);
  }

}
