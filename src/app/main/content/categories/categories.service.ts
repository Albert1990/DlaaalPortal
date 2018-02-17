import {AppSettings} from './../shared/app.settings';
import {Category} from './category.model';
import {AuthService} from './../auth/auth.service';
import {HelpersService} from './../shared/helpers.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AppException} from '../shared/app.exception';
import {Advertisement} from '../advertisements/advertisement.model';

@Injectable()
export class CategoriesService {
  private items: Category[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Category[]>(AppSettings.baseUrl + '/categories')
        .subscribe(
          items => {
            console.log('items ', items);
            this.items = items;
            resolve({
              items: this.items.slice(),
              totalCount: this.items.length
            });
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  item(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Category>(AppSettings.baseUrl + '/categories/' + itemId)
        .subscribe(
          item => {
            console.log(item);
            resolve(item);
          },
          error => {
            reject(new AppException('unknown exception'));
          }
        );
    });
  }

  delete(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<Advertisement>(AppSettings.baseUrl + '/categories/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            console.log(data);
            // this.items.splice(index, 1);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
          }
        );
    });
  }

  update(item: Category): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(AppSettings.baseUrl + '/categories/' + item.id, item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
          }
        );
    });
  }

  add(item: Advertisement): Promise<any> {
    console.log("item ", item);
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/categories/?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
          }
        );
    });
  }

}
