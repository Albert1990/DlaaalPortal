import {AppSettings} from './../../shared/app.settings';
import {SubCategory} from './subCategory.model';
import {AuthService} from './../../auth/auth.service';
import {HelpersService} from './../../shared/helpers.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AppException} from '../../shared/app.exception';
import {Advertisement} from '../../lazy-child/advertisement.model';

@Injectable()
export class SubCategoriesService {
  private items: SubCategory[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helpers: HelpersService) {
  }

  listing(categoryId, pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<SubCategory[]>(AppSettings.baseUrl + '/categories/' + categoryId + '/subCategories')
        .subscribe(
          items => {
            console.log('SubCategory ', items);
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

  add(categoryId, item: SubCategory): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(AppSettings.baseUrl + '/categories/' + categoryId + '/subCategories?access_token=' + this.authService.getToken(), item)
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

  /*item(itemId: string): Promise<any> {
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
*/
  delete(categoryId, item): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.items.indexOf(item);
      this.http.delete<Advertisement>(AppSettings.baseUrl + '/categories/' + categoryId + '/subCategories/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            // this.items.splice(index, 1);
            resolve(true);
          },
          error => {
            this.helpers.showActionSnackbar(null, false, '', {style: 'failed-snackbar'});
            reject(new AppException(error));
          }
        );
    });
  }
  deleteAll(categoryId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete<Advertisement>(AppSettings.baseUrl + '/categories/' + categoryId + '/subCategories?access_token=' + this.authService.getToken())
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

  update(categoryId, item: SubCategory): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(AppSettings.baseUrl + '/categories/' + categoryId + '/subCategories/' + item.id + '?access_token=' + this.authService.getToken(), item)
        .subscribe(
          data => {
            console.log('data ', data);
            resolve(true);
          },
          error => {
            console.log('error ', error);
            reject(new AppException(error));
          }
        );
    });
  }

}
