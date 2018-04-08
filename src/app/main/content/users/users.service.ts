import {AppSettings} from './../shared/app.settings';
import {AuthService} from './../auth/auth.service';
import {HelpersService} from './../shared/helpers.service';
import {User} from './user.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AppException} from '../shared/app.exception';

@Injectable()
export class UsersService {
  private items: User[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helpers: HelpersService) {
  }

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<User[]>(AppSettings.baseUrl + '/users?access_token=' + this.authService.getToken())
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
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

  item(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // send get request
      this.http.get<User>(AppSettings.baseUrl + '/users/' + itemId)
        .subscribe(
          item => {
            resolve(item);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException('unknown exception'));
          }
        );
    });
  }

  delete(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.put<User>(AppSettings.baseUrl + '/users/' + item.id + '/deactivate?access_token=' + this.authService.getToken(), null)
        .subscribe(
          data => {
            this.items[index].status = 'deactivated';
            resolve(true);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));
          }
        );
    });
  }


  update(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch(AppSettings.baseUrl + '/users/' + item.id + '?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            resolve(true);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));
          }
        );
    });
  }

  add(item: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/users/?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log(data);
            resolve(true);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));
          }
        );
    });
  }

}
