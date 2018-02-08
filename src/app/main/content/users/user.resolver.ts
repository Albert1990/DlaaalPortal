import { AppSettings } from './../shared/app.settings';
import { UsersService } from './users.service';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserResolver implements Resolve<any> {

    constructor(private usersService: UsersService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :  Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
          let resolverType = route.data['resolverType'];
          if(resolverType == 'list'){
            this.usersService.listing().then(
              serverResult => {
                resolve(serverResult);
              },
              (reason: any) => {
                console.log(reason);
              }
            );
          } else {
            const itemId = route.params['id'];
            this.usersService.item(itemId).then(
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