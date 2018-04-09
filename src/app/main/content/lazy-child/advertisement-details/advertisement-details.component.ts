import { Component, OnInit } from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {ActivatedRoute} from '@angular/router';
import {Advertisement} from '../advertisement.model';

@Component({
  selector: 'app-advertisement-details',
  templateUrl: './advertisement-details.component.html',
  styleUrls: ['./advertisement-details.component.scss'],
  animations: fuseAnimations
})
export class AdvertisementDetailsComponent implements OnInit {
  advert: Advertisement;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data['serverResult']) {
      this.advert = this.route.snapshot.data['serverResult'];
    }
  }

}
