import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);
import { PokeComplete, PokeCV } from 'src/app/models/pokemon.model';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-poke-view',
  templateUrl: './poke-view.component.html',
  styleUrls: ['./poke-view.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(500)),
      transition('* <=> *', animate(500)),
    ]),
  ],
})
export class PokeViewComponent implements OnInit {
  @Input() pokeShort!: PokeCV;
  currentPoke?: PokeComplete;
  spriteShown?: string = '';
  chartShow : boolean = false;

  Highcharts: typeof Highcharts = Highcharts;
  hgUpdateFlag = false;
  hgOptions: Highcharts.Options = {
    chart: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      polar: true,
      type: 'line',
    },

    title: {
      text: '',
    },

    xAxis: {
      labels: {
        style: {
          color: 'black',
          fontSize: '1.1em',
        },
      },
      categories: ['PV', 'Att.', 'Déf.', 'Att. spé.', 'Déf. spé.', 'Vit.'],
    },

    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      max: 200,
    },

    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      series: {
        color: '#806852',
      },
    },

    series: [
      {
        type: 'line',
        name: this.currentPoke?.frName,
        showInLegend: false,
        data: [0, 0, 0, 0, 0, 0],
        dataLabels: {
          enabled: true,
          color: '#000000',
        },
      },
    ],
  };

  constructor(private service: PokeapiService) {}

  ngOnInit(): void {
    // Highcharts.chart('container', this.hgOptions);
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.currentPoke = await this.service.getFullPoke(this.pokeShort);;
    this.spriteShown =
      this.currentPoke?.sprites?.other['official-artwork'].front_default;
    this.chartShow = false;
    if (this.hgOptions.series) {
      this.hgOptions.series[0] = {
        type: 'line',
        name: this.currentPoke?.frName,
        showInLegend: false,
        data: [
          this.currentPoke?.stats[0].base_stat ?? 0,
          this.currentPoke?.stats[1].base_stat ?? 0,
          this.currentPoke?.stats[2].base_stat ?? 0,
          this.currentPoke?.stats[3].base_stat ?? 0,
          this.currentPoke?.stats[4].base_stat ?? 0,
          this.currentPoke?.stats[5].base_stat ?? 0,
        ],
      };
    }
    this.hgUpdateFlag = true;
  }

  selectSprite(sprIndex: number) {
    switch (sprIndex) {
      case 0:
        this.spriteShown =
          this.currentPoke?.sprites?.other['official-artwork'].front_default;
        break;
      case 1:
        this.spriteShown = this.currentPoke?.sprites?.front_default;
        break;
      case 2:
        this.spriteShown = this.currentPoke?.sprites?.back_default;
        break;
      default:
        break;
    }
  }

  toggleChartShow(){
    this.chartShow = ! this.chartShow;
  }
}
