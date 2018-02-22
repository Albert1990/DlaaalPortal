import {UsersService} from './users.service';
import {UserResolver} from './user.resolver';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './../../../core/modules/shared.module';
import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListComponent} from './user-list/user-list.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UserListComponent,
        resolve: {
          serverResult: UserResolver
        },
        data: {resolverType: 'list'}
      },
      {
        path: 'new',
        component: UserEditComponent,
        data: {
           isEditMode: false
        }
      },
      {
        path: ':id/details',
        component: UserDetailComponent,
        resolve: {
          serverResult: UserResolver
        },
        data: {
          resolverType: 'item',
        }
      },
      {
        path: ':id/edit',
        component: UserEditComponent,
        resolve: {
          serverResult: UserResolver
        },
        data: {
          resolverType: 'item',
          isEditMode: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    UsersService,
    UserResolver
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  exports: [
    RouterModule
  ]
})


export class UsersModule {
}
