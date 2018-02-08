import { HelpersService } from './../../shared/helpers.service';
import { UsersService } from './../users.service';
import { FuseSplashScreenService } from './../../../../core/services/splash-screen.service';
import { UserType } from './../enums/user-type';
import { group } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './../user.model';
import { fuseAnimations } from './../../../../core/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PageAction } from '../../shared/enums/page-action';
import { AppSettings } from '../../shared/app.settings';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  animations   : fuseAnimations
})
export class UserEditComponent implements OnInit {
  user: User;
  isEditMode: boolean = false;
  @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) { 
              //   this.user = new User(4,'Kemo','Mano','4460467','http://google.com',0,
              // 0,false,'samer.shatta@gmail.com','','active');
              }

  ngOnInit() {
    this.user = this.route.snapshot.data['serverResult'];
    if(this.user == null){
      this.router.navigate(['/'])
    }
    this.isEditMode = this.route.snapshot.data['isEditMode'];
  }

  onSubmit(userForm: NgForm){
    if(userForm.valid){
      this.loadingScreen.show();
      this.usersService.update(this.user).then((val) => {
        this.loadingScreen.hide();
        this.helpers.showActionSnackbar(PageAction.Update, true,'user');
      },(reason) => {
        this.loadingScreen.hide();
        console.log('error');
      })
    }
  }

  browseProfilePicture(){
    console.log(this.fileSelector);
    this.fileSelector.nativeElement.click();
    
    return false;
  }

  onFileChange(event){
    console.log(event);
  }

}
