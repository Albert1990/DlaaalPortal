import {Injectable} from '@angular/core';
import {Advertisement} from './advertisement.model';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {AppException} from '../shared/app.exception';
import {Subject} from 'rxjs/Subject';
import {AppSettings} from '../shared/app.settings';
import {HttpHeaders} from '@angular/common/http';
import {PageAction} from '../shared/enums/page-action';
import {HelpersService} from '../shared/helpers.service';
import {Router} from '@angular/router';

// import { RequestOptions } from '@angular/http';

@Injectable()
export class AdvertisementsService {

  private items: Advertisement[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private helpers: HelpersService) {
  }

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Advertisement[]>(AppSettings.baseUrl + '/advertisemets?access_token=' + this.authService.getToken())
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
            const me = this.authService.getToken();
            if ( me !== '') {
              localStorage.clear();
              this.router.navigate(['/auth/login']);
            }
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
          }
        );
    });
  }

  item(itemId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('item ');
      this.http.get<Advertisement>(AppSettings.baseUrl + '/advertisemets/' + itemId)
        .subscribe(
          item => {
            console.log('item 2');
            resolve(item);
          },
          error => {
            console.log('item 3');
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
             reject(new AppException('unknown exception'));
          }
        );
    });
  }

  delete(item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<Advertisement>(AppSettings.baseUrl + '/advertisemets/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            this.items.splice(index, 1);
            resolve(true);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));

          }
        );
    });
  }


  update(item: Advertisement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch(AppSettings.baseUrl + '/advertisemets/' + item.id + '?access_token=' + this.authService.getToken(), item)
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

  add(item: Advertisement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/advertisemets/?access_token=' + this.authService.getToken(), item)
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

  uploadImages(items): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/files/images/upload?access_token=' + this.authService.getToken(), items)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));
          }
        );
    });
  }


}
