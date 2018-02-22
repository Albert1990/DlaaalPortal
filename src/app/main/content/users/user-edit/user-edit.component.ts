import {HelpersService} from './../../shared/helpers.service';
import {UsersService} from './../users.service';
import {FuseSplashScreenService} from './../../../../core/services/splash-screen.service';
import {UserType} from './../enums/user-type';
import {group} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from './../user.model';
import {fuseAnimations} from './../../../../core/animations';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {PageAction} from '../../shared/enums/page-action';
import {AppSettings} from '../../shared/app.settings';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  animations: fuseAnimations
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  isEditMode: boolean = false;
  defaultAvatar: string = '../../../../../assets/images/avatars/profile-grey.png';

  @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) {
    this.user = new User();
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.user = this.route.snapshot.data['serverResult'];
    }
    this.userForm = new FormGroup({
      id: new FormControl(this.user.id),
      firstName: new FormControl(this.user.firstName, [Validators.required]),
      lastName: new FormControl(this.user.lastName, [Validators.required]),
      status: new FormControl(this.user.status),
      avatar: new FormControl(this.user.avatar),
      website: new FormControl(this.user.website, [
        Validators.pattern('[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
      ]),
      phone: new FormControl(this.user.phone, [Validators.required, Validators.pattern('^[+]?[0-9]*\\.?[0-9]*')]),
      email: new FormControl(this.user.email, [
        Validators.email, Validators.required
      ]),
    });
    if (!this.isEditMode)
      this.userForm.controls.password = new FormControl(this.user.password, [Validators.required]);
  }

  getErrorMessage(fieldName, required, phone, website, email) {
    return this.userForm.controls[fieldName].hasError(required) ? 'You must enter a value' :
      this.userForm.controls[fieldName].hasError(phone) ? 'Not a valid phone' :
      this.userForm.controls[fieldName].hasError(email) ? 'Not a valid e-mail' :
        this.userForm.controls[fieldName].hasError(website) ? 'Not a valid website' :
          '';
  }

  onSubmit(thisUserForm: NgForm) {
    if (thisUserForm.valid) {
      this.loadingScreen.show();
      if (this.isEditMode) {
        console.log("this.userForm edit", this.userForm.value);
        this.usersService.update(this.userForm.value).then((val) => {
          this.helpers.showActionSnackbar(PageAction.Update, true, 'user');
          this.router.navigate(['/users']);
          this.loadingScreen.hide();
        }, (reason) => {
          this.loadingScreen.hide();
          console.log('error ', reason);
          this.helpers.showActionSnackbar(PageAction.Update, false, 'user');
        });
      } else {
        delete this.userForm.value.avatar;
        delete this.userForm.value.id;
        console.log("this.userForm add", this.userForm.value);
        this.usersService.add(this.userForm.value).then((val) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Create, true, 'user');
          this.router.navigate(['/users']);
        }, (reason) => {
          this.loadingScreen.hide();
          // TODO specify the errors to show them
          this.helpers.showActionSnackbar(PageAction.Create, false, 'user');
          console.log('error ', reason);
        });
      }

    }
  }
  readFile(inputValue: any): void {
    var file:File = inputValue.files[0];
    var reader:FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.userForm.value.avatar = reader.result;
    };
    reader.readAsDataURL(file);
  }
  browseProfilePicture() {
    console.log(this.fileSelector);
    this.fileSelector.nativeElement.click();
    return false;
  }
  removeFile(event){
    this.userForm.value.avatar = '';
  }

  onFileChange(event) {
    console.log(event);
    this.readFile(event.target);
    // this.userForm.value.avatar = event.target.files[0];
  }

}
