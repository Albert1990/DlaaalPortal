import {AppException} from './../shared/app.exception';
import {HelpersService} from './../shared/helpers.service';
import {User} from './../users/user.model';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppSettings} from '../shared/app.settings';

@Injectable()
export class AuthService {
  me: User = null;

  constructor(private http: HttpClient) {
    //check if the user exists in the local storage
    //if yes => fetch it
    const meStr = localStorage.getItem('me');
    if (meStr != null)
      this.me = JSON.parse(meStr);
  }

  register(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // do the http request here
      resolve(this.me);
    });
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // send login request & save the loged in user in the local storage
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
      this.http.post<LoginResponse>(AppSettings.baseUrl + '/users/login', {
        email: email,
        password: password
      }, {
        headers: headers
      })
        .subscribe(
          data1 => {
            // now  we will send get me request
            const token = data1.id;
            this.http.get<User>(AppSettings.baseUrl + '/users/me?access_token=' + token)
              .subscribe(
                me => {
                  this.me = me;
                  this.me.id = data1.userId;
                  this.me.token = data1.id;
                  // now save me in localstorage
                  localStorage.setItem('me', JSON.stringify(this.me));
                  resolve(this.me);
                },
                error => {
                  // check the status code to know the error
                  reject(new AppException('unknown error'));
                }
              );
          },
          error => {
            reject(new AppException('email or password is wrong'));
          }
        );
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.me = null;
      localStorage.clear();
      resolve(true);
    });
  }

  getToken() {
    if (this.me != null)
      return this.me.token;
    return '';
  }

  isAuthenticated() {
    return this.me != null;
  }

}

// responses interface
interface LoginResponse {
  id: string;
  ttl: number;
  created: string;
  userId: number;
}
