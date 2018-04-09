import { Injectable } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {AppException} from '../shared/app.exception';
import {Subject} from 'rxjs/Subject';
import {AppSettings} from '../shared/app.settings';
import {City} from './city.model';
import {HelpersService} from '../shared/helpers.service';

@Injectable()
export class CitiesService {

  private items: City[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helpers: HelpersService) {
  }

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<City[]>(AppSettings.baseUrl + '/cities?access_token=' + this.authService.getToken())
        .subscribe(
          items => {
            console.log(items);
            this.items = items;
            resolve({
              items: this.items.slice(),
              totalCount: this.items.length
            });
          },
          error => {
            console.log(error);
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

  item(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http.get<City>(AppSettings.baseUrl + '/cities/' + itemId)
        .subscribe(
          item => {
            console.log(item);
            resolve(item);
          },
          error => {
            reject(new AppException('unknown exception'));
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

  delete(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<City>(AppSettings.baseUrl + '/cities/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            console.log(data);
            this.items.splice(index, 1);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }


  update(item: City): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch(AppSettings.baseUrl + '/cities/' + item.id + '?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

  add(item: City): Promise<any> {
    console.log("item ", item);
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/cities/?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

}
