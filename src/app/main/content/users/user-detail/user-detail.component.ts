import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fuseAnimations} from '../../../../core/animations';
import {User} from './../user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  animations: fuseAnimations
})
export class UserDetailComponent implements OnInit {
  user: User;
  defaultAvatar: string = '../../../../../assets/images/avatars/profile-grey.png';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data['serverResult']) {
      this.user = this.route.snapshot.data['serverResult'];
    }
  }

}
