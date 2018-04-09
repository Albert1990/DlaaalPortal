import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../core/modules/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {CityListComponent} from './city-list/city-list.component';
import {CityEditComponent} from './city-edit/city-edit.component';
import {CityDetailComponent} from './city-detail/city-detail.component';
import {CityResolver} from './city.resolver';
import {CitiesService} from './cities.service';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CityListComponent,
        resolve: {
          serverResult: CityResolver
        },
        data: {resolverType: 'list'}
      },
      {
        path: 'new',
        component: CityEditComponent,
        data: {
          isEditMode: false
        }
      },
      {
        path: ':id/details',
        component: CityDetailComponent,
        resolve: {
          serverResult: CityResolver
        },
        data: {
          resolverType: 'item',
        }
      },
      {
        path: ':id/edit',
        component: CityEditComponent,
        resolve: {
          serverResult: CityResolver
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
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CityListComponent, CityEditComponent, CityDetailComponent],
  providers: [CityResolver, CitiesService],
  exports: [RouterModule]
})
export class CitiesModule {
}
