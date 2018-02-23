import { CategoriesService } from './categories.service';
import { SharedModule } from './../../../core/modules/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryResolver } from './category.resolver';
import {AdvertisementResolver} from '../advertisements/advertisement.resolver';
import {AdvertisementDetailsComponent} from '../advertisements/advertisement-details/advertisement-details.component';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '',
        component: CategoryListComponent,
        resolve: {
          serverResult: CategoryResolver
        },
        data: { resolverType: 'list' }
      },
      {
        path: 'new',
        component: CategoryEditComponent,
        data: {
          isEditMode: false
        }
      },
      {
        path: ':id/edit',
        component: CategoryEditComponent,
        resolve: {
          serverResult: CategoryResolver
        },
        data: {
          resolverType: 'item',
          isEditMode: true
        }
      },
      {
        path: ':id/details',
        component: CategoryDetailComponent,
        resolve: {
          serverResult: CategoryResolver
        },
        data: {
          resolverType: 'item',
        }
      },
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CategoriesService,
    CategoryResolver
  ],
  declarations: [CategoryListComponent, CategoryDetailComponent, CategoryEditComponent]
})
export class CategoriesModule { }
