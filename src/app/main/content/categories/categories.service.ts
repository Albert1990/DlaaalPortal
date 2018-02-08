import { AppSettings } from './../shared/app.settings';
import { Category } from './category.model';
import { AuthService } from './../auth/auth.service';
import { HelpersService } from './../shared/helpers.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AppException } from '../shared/app.exception';

@Injectable()
export class CategoriesService {
  private items: Category[] = [];
  //onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Category[]>(AppSettings.baseUrl+'/categories')
      .subscribe(
        items => {
          this.items = items;
      resolve({
        items: this.items.slice(),
        totalCount: this.items.length
      });
        },
        error => {
          console.log(error);
        }
      )
    });
  }

  item(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //send get request
      this.http.get<Category>(AppSettings.baseUrl+'/categories/'+itemId)
      .subscribe(
        item => {
          resolve(item);
        },
        error => {
          reject(new AppException('unknown exception'));
        }
      );
    });
  }

  delete(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //send delete request
      // if delete op success then we can delete it from our users list
      this.items.splice(0,1);
      let serverResult = null;
      serverResult.addPair('users', this.items.slice());
      serverResult.addPair('totalCount', this.items.length);
      resolve(serverResult);
    });
  }

  update(item: Category): Promise<any>{
    return new Promise((resolve,reject)=>{
      //send put request to update the user
      // if the update success return the local modified list into the resolver
      // update the local users data with the modified user data
      this.http.put(AppSettings.baseUrl+'/users/'+item.id, item)
      .subscribe(
        data => {
          resolve(true);
        },
        error => {
          reject(new AppException(error));
        }
      );
    });
  }

}
