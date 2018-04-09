import {AppSettings} from './../shared/app.settings';
import {CitiesService} from './cities.service';
import {City} from './city.model';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CityResolver implements Resolve<any> {

  constructor(private citiesService: CitiesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data['resolverType'];
      if (resolverType === 'list') {
        this.citiesService.listing().then(
          serverResult => {
            resolve(serverResult);
          },
          (reason: any) => {
            console.log(reason);
          }
        );
      } else {
        const itemId = route.params['id'];
        this.citiesService.item(itemId).then(
          serverResult => {
            resolve(serverResult);
          },
          (reason: any) => {
            console.log(reason);
          }
        );
      }

    });
  }
}
