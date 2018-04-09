import {AppSettings} from './../shared/app.settings';
import {AdvertisementsService} from './advertisements.service';
import {Advertisement} from './advertisement.model';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AppException} from '../shared/app.exception';

@Injectable()
export class AdvertisementResolver implements Resolve<any> {

  constructor(private advertisementsService: AdvertisementsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      let resolverType = route.data['resolverType'];
      if (resolverType === 'list') {
        this.advertisementsService.listing().then(
          serverResult => {
            resolve(serverResult);
          },
          (reason: any) => {
            console.log(reason);
          }
        );
      } else {
        const itemId = route.params['id'];
        this.advertisementsService.item(itemId).then(
          serverResult => {
            resolve(serverResult);
          },
          (reason: any) => {
          }
        );
      }

    });
  }
}
