import { AppException } from './../../shared/app.exception';
import { MatSnackBar } from '@angular/material';
import { HelpersService } from './../../shared/helpers.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { FuseConfigService } from './../../../../core/services/config.service';
import { fuseAnimations } from './../../../../core/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageAction } from '../../shared/enums/page-action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {

  constructor(private fuseConfig: FuseConfigService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      },
    });
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password).then(
      user => {
        this.router.navigate(['/']);
      }
    ).catch((reason: AppException) => {
      this.snackBar.open(reason.errorMessage,'',{
        duration: 2000,
        extraClasses:'color:red'
      });
    })
  }

}
