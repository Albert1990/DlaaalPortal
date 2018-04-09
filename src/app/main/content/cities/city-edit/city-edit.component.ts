import {HelpersService} from './../../shared/helpers.service';
import {CitiesService} from './../cities.service';
import {FuseSplashScreenService} from './../../../../core/services/splash-screen.service';

import {group} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {City} from './../city.model';
import {fuseAnimations} from './../../../../core/animations';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {PageAction} from '../../shared/enums/page-action';
import {AppSettings} from '../../shared/app.settings';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
  animations: fuseAnimations
})
export class CityEditComponent implements OnInit {
  cityForm: FormGroup;
  city: City;
  isEditMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private citiesService: CitiesService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) {
    this.city = new City();
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.city = this.route.snapshot.data['serverResult'];
    }
    this.cityForm = new FormGroup({
      id: new FormControl(this.city.id),
      name: new FormControl(this.city.name, [Validators.required])
    });
  }

  getErrorMessage(fieldName, required) {
    return this.cityForm.controls[fieldName].hasError(required) ? 'You must enter a value' :
          '';
  }

  onSubmit(thisCityForm: NgForm) {
    if (thisCityForm.valid) {
      this.loadingScreen.show();
      if (this.isEditMode) {
        console.log("this.cityForm edit", this.cityForm.value);
        this.citiesService.update(this.cityForm.value).then((val) => {
          this.helpers.showActionSnackbar(PageAction.Update, true, 'city');
          this.router.navigate(['/cities']);
          this.loadingScreen.hide();
        }, (reason) => {
          this.loadingScreen.hide();
          console.log('error ', reason);
          this.helpers.showActionSnackbar(PageAction.Update, false, 'city');
        });
      } else {
        delete this.cityForm.value.id;
        console.log("this.cityForm add", this.cityForm.value);
        this.citiesService.add(this.cityForm.value).then((val) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Create, true, 'city');
          this.router.navigate(['/cities']);
        }, (reason) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Create, false, 'city');
          console.log('error ', reason);
        });
      }

    }
  }

}
