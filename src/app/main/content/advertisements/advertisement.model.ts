
import {Data} from '@angular/router/src/config';

export class Advertisement {
  public id: number = 0;
  public title: string = null;
  public description: string = null;
  public images = [];
  public price: number = null;

  public fields = [] ;
  public address: string = null;
  public phone: string = null;
  public status: string = null;
  public viewsCount: number = 0;
  public createdAt: Date = new Date();
  public isBookmarked: boolean = false;
  public cityId: number  = null;
  public city = null;
  public ownerId: number  = null;
  public categoryId: number  = null;
  public category  = null;
  public subCategoryId: number  = null;
  public subCategory = null;
}
