import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdvertisementListComponent} from './advertisement-list/advertisement-list.component';
import {RouterModule, Routes} from '@angular/router';
import {AdvertisementEditComponent} from './advertisement-edit/advertisement-edit.component';
import {AdvertisementDetailsComponent} from './advertisement-details/advertisement-details.component';
import {AdvertisementResolver} from './advertisement.resolver';
import {AdvertisementsService} from './advertisements.service';
import {SharedModule} from '../../../core/modules/shared.module';
import {CitiesService} from './../cities/cities.service';
import {CategoriesService} from './../categories/categories.service';
import {UsersService} from './../users/users.service';
import {SubCategoriesService} from './../categories/subCategories/subCategories.service';
import { ImageUploadModule } from "angular2-image-upload";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdvertisementListComponent,
        resolve: {
          serverResult: AdvertisementResolver
        },
        data: {resolverType: 'list'}
      },
      {
        path: 'new',
        component: AdvertisementEditComponent,
        data: {
          isEditMode: false
        }
      },
      {
        path: ':id/details',
        component: AdvertisementDetailsComponent,
        resolve: {
          serverResult: AdvertisementResolver
        },
        data: {
          resolverType: 'item',
        }
      },
      {
        path: ':id/edit',
        component: AdvertisementEditComponent,
        resolve: {
          serverResult: AdvertisementResolver
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
    RouterModule.forChild(routes),
    ImageUploadModule.forRoot(),
  ],
  declarations: [AdvertisementListComponent, AdvertisementEditComponent, AdvertisementDetailsComponent],
  providers: [AdvertisementResolver, AdvertisementsService, CitiesService, CategoriesService, SubCategoriesService, UsersService],
  exports: [RouterModule]
})
export class LazyModule {
}
