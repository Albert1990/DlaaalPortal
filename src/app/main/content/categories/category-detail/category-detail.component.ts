import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fuseAnimations} from '../../../../core/animations';
import {Category} from './../category.model';
import {User} from '../../users/user.model';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  animations: fuseAnimations
})
export class CategoryDetailComponent implements OnInit {
  category: Category;
  defaultImage = '../../../../../assets/images/ecommerce/product-image-placeholder.png';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data['serverResult']) {
      this.category = this.route.snapshot.data['serverResult'];
    }
  }

}
