import { Injectable } from '@angular/core';
import {Advertisement} from './advertisement.model';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {AppException} from '../shared/app.exception';
import {Subject} from 'rxjs/Subject';
import {AppSettings} from '../shared/app.settings';
import { HttpHeaders } from '@angular/common/http';
// import { RequestOptions } from '@angular/http';

@Injectable()
export class AdvertisementsService {

  private items: Advertisement[] = [];
  // onUsersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // onSearchTextChanged: Subject<any> = new Subject();

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  listing(pageIndex = 0, pageSize = 30, startedWith: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<Advertisement[]>(AppSettings.baseUrl + '/advertisemets?access_token=' + this.authService.getToken())
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
          }
        );
    });
  }

  item(itemId: string): Promise<any> {
    console.log("itemId ", itemId);
    return new Promise((resolve, reject) => {
      // send get request
      this.http.get<Advertisement>(AppSettings.baseUrl + '/advertisemets/' + itemId)
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
      this.http.delete<Advertisement>(AppSettings.baseUrl + '/advertisemets/' + item.id + '?access_token=' + this.authService.getToken())
        .subscribe(
          data => {
            console.log(data);
            // this.items[index].status = 'deactivated';
            this.items.splice(index, 1);
            resolve(true);
          },
          error => {
            reject(new AppException(error));
          }
        );
      // resolve(this.items);
    });
  }


  update(item: Advertisement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch(AppSettings.baseUrl + '/advertisemets/' + item.id + '?access_token=' + this.authService.getToken(), item)
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
      this.http.post(AppSettings.baseUrl + '/advertisemets/?access_token=' + this.authService.getToken(), item)
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
  uploadImages(items): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers =  {headers: new  HttpHeaders({ 'Access-Control-Allow-Origin': '*'})};
     // let options = new RequestOptions({ headers: headers });
      console.log("items ", items);
      this.http.post(AppSettings.baseUrl + '/files/images/upload?access_token=' + this.authService.getToken(), items)
        .subscribe(
          data => {
            console.log(data);
            resolve(data);
          },
          error => {
            console.log("error ", error);
            reject(new AppException(error));
          }
        );
    });
  }



}
