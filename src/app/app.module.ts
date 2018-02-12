import {AnonymousGuardService} from './main/content/auth/anonymous-guard.service';
import {AuthGuardService} from './main/content/auth/auth-guard.service';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import 'hammerjs';
import {SharedModule} from './core/modules/shared.module';
import {AppComponent} from './app.component';
import {FuseMainModule} from './main/main.module';
import {FuseSplashScreenService} from './core/services/splash-screen.service';
import {FuseConfigService} from './core/services/config.service';
import {FuseNavigationService} from './core/components/navigation/navigation.service';
import {FuseSampleModule} from './main/content/sample/sample.module';
import {TranslateModule} from '@ngx-translate/core';
import {HelpersService} from './main/content/shared/helpers.service';
import {AuthService} from './main/content/auth/auth.service';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './main/content/dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuardService]
  },
  {
    path: 'home',
    loadChildren: './main/content/dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuardService]
  },
  {
    path: 'users',
    loadChildren: './main/content/users/users.module#UsersModule',
    canLoad: [AuthGuardService]
  },
  {
    path: 'categories',
    loadChildren: './main/content/categories/categories.module#CategoriesModule',
    canLoad: [AuthGuardService]
  },
  {
    path: 'countries',
    loadChildren: './main/content/countries/countries.module#CountriesModule',
    canLoad: [AuthGuardService]
  },
  {
    path: 'auth',
    loadChildren: './main/content/auth/auth.module#AuthModule',
    canLoad: [AnonymousGuardService]
  },
  {
    path: '**',
    redirectTo: 'sample'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SharedModule,
    TranslateModule.forRoot(),
    FuseMainModule,
    FuseSampleModule
  ],
  providers: [
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    AuthService,
    AuthGuardService,
    AnonymousGuardService,
    HelpersService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
