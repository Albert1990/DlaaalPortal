import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CategoriesService } from './categories.service';

@Injectable()
export class CategoryResolver implements Resolve<any> {

    constructor(private categoriesService: CategoriesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :  Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
          let resolverType = route.data['resolverType'];
          if(resolverType == 'list'){
            this.categoriesService.listing().then(
              (serverResult) => {
                resolve(serverResult);
              },
              (reason: any) => {
                console.log(reason);
              }
            );
          } else {
            const itemId = route.params['id'];
            this.categoriesService.item(itemId).then(
              (serverResult) => {
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