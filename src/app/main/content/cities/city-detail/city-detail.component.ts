import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fuseAnimations} from '../../../../core/animations';
import {City} from './../city.model';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss'],
  animations: fuseAnimations
})
export class CityDetailComponent implements OnInit {
  city: City;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data['serverResult']) {
      this.city = this.route.snapshot.data['serverResult'];
    }
  }

}
