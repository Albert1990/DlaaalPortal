import {UserGender} from './enums/user-gender';
import {UserStatus} from './enums/user-status';
import {UserType} from './enums/user-type';
import {Data} from '@angular/router/src/config';

export class User {
  public id: number = 0;
  public firstName: string = '';
  public lastName: string = '';
  public password: string = '';
  public phone: string = '';
  public website: string = '';
  public followersCount: number = 0;
  public advertisementCount: number = 0;
  public isFollowed: boolean = false;
  public email: string = '';
  public token: string = '';
  public status: string = 'active';
  public avatar: string = '';
  //public avatar: string = '../../../../../assets/images/avatars/profile-grey.png';


  /*constructor(public id: number = 0, public firstName: string = 'noName',
              public lastName: string = 'NoName', public phone: string = '',
              public website: string = '', public followersCount: number = 0,
              public advertisementCount: number = 0, public isFollowed: boolean = false,
              public email: string = '', public token: string = '',
              public status: string = '', public avatar: string = '') {
  }*/

  // constructor(id: string = '00', name: string = 'noName', avatar: string = '') {
  //     this.id = id;
  //     this.name = name;
  //     this.avatar = avatar;
  //     this.email = 'soso@soso.com';
  //     this.type = UserType.User;
  //     this.active = true;
  //     this.gender = UserGender.Male;
  //     this.phone = '4460467';
  //     this.createdAt = new Date(2017,10,1);
  // }
}
