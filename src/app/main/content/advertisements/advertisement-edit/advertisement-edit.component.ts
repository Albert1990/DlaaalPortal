import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PageAction} from '../../shared/enums/page-action';
import {AdvertisementsService} from '../../advertisements/advertisements.service';
import {Advertisement} from '../../advertisements/advertisement.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HelpersService} from '../../shared/helpers.service';
import {FuseSplashScreenService} from '../../../../core/services/splash-screen.service';
import {CitiesService} from './../../cities/cities.service';
import {CategoriesService} from './../../categories/categories.service';
import {SubCategoriesService} from './../../categories/subCategories/subCategories.service';
import {UsersService} from './../../users/users.service';

@Component({
  selector: 'app-advertisement-edit',
  templateUrl: './advertisement-edit.component.html',
  styleUrls: ['./advertisement-edit.component.scss'],
  animations: fuseAnimations
})
export class AdvertisementEditComponent implements OnInit {
  advertForm: FormGroup;
  advert: Advertisement;
  isEditMode: boolean = false;
  cities = [];
  categories = [];
  users = [];
  finalValues = new FormArray([]);

  // @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private citiesService: CitiesService,
              private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private usersService: UsersService,
              private advertisementsService: AdvertisementsService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) {
    this.advert = new Advertisement();
  }


  getErrorMessage(fieldName, required, phone, min) {
    return this.advertForm.controls[fieldName].hasError(required) ? 'You must enter a value' :
      this.advertForm.controls[fieldName].hasError(phone) ? 'Not a valid phone' :
        this.advertForm.controls[fieldName].hasError(min) ? 'The value must be more than 0' :
          '';
  }

  getUsers() {
    this.usersService.listing().then(serverResult => {
      console.log('usersService', serverResult);
      this.users = serverResult.items;
    }).catch(reason => {
      console.log('error ', reason);
    });
  }

  getCities() {
    this.citiesService.listing().then(serverResult => {
      console.log('CitiesService', serverResult);
      this.cities = serverResult.items;
    }).catch(reason => {
      console.log('error ', reason);
    });
  }

  getCategories() {
    this.categoriesService.listing().then(serverResult => {
      console.log('getCategories', serverResult);
      this.categories = serverResult.items;
    }).catch(reason => {
      console.log('error ', reason);
    });
  }

  getSubCategories(category) {
    if(category) {
      category.subCategories = [];
      this.subCategoriesService.listing(category.id).then(serverResult => {
        console.log('subCategories', serverResult);
        category.subCategories = serverResult.items;
      }).catch(reason => {
        console.log('error ', reason);
      });
    }
  }

  setSelectedCategory(category) {
    this.advert.category = category;
    this.advertForm.value.fields['controls'] = [];
    this.advertForm.controls.fields['controls'] = [];
    if (category && category !== null && category !== '') this.getSubCategories(category);
    else this.advertForm.value.subCategoryId = '';
  }

  setSelectedSubCategory(subCategory) {
    console.log("subCategory ", subCategory);
    console.log("this.advertForm ", this.advertForm);
    this.advert.subCategory = subCategory;
    this.advertForm.value.fields['controls'] = [];
    this.advertForm.controls.fields['controls'] = [];
    if (!subCategory || subCategory == null || subCategory === '')
       this.advertForm.value.fields['controls'] = '';
    else {
      let items = this.advertForm.get('fields')['controls'] as FormArray;
       console.log('this.advertForm.get(\'fields\')', this.advertForm.get('fields'));
      for (let i = 0; i < subCategory.fields.length; i++) {
        items.push(new FormGroup({
          key: new FormControl(subCategory.fields[i].key),
          type: new FormControl(subCategory.fields[i].type),
          value: new FormControl(subCategory.fields[i].value),
        }));
        if (subCategory.fields[i].type === 'choose') {
          this.advertForm.controls.fields['controls'][i].controls.values = new FormArray([]);
          let vv = this.advertForm.get(['fields', i, 'values']) as FormArray;
          console.log('vv', vv);
          for (let j = 0; j < subCategory.fields[i].values.length; j++) {
            vv.push(new FormControl(subCategory.fields[i].values[j]));
            console.log('vv', vv);
          }
        }
      }
      this.finalValues = this.advertForm.controls.fields['controls'];
    }
  }

  submit() {
    console.log('submit 1');
    console.log('this.advertForm add', this.advertForm.value);
    // this.advertForm.value.fields = this.advert.subCategory.fields;
    if (this.isEditMode) {
      console.log('this.advertForm edit', this.advertForm.value);
      this.advertisementsService.update(this.advertForm.value).then((val) => {
        this.helpers.showActionSnackbar(PageAction.Update, true, 'advertisements');
        this.router.navigate(['/advertisements']);
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Update, false, 'advertisements');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    } else {
      delete this.advertForm.value.id;
      console.log('this.advertForm add', this.advertForm.value);
      this.advertisementsService.add(this.advertForm.value).then((val) => {
        this.helpers.showActionSnackbar(PageAction.Create, true, 'advertisements');
        this.router.navigate(['/advertisements']);
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Create, false, 'advertisements');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    }
  }

  uploadImages(images) {
    console.log('images ', images);
    if (images && images.length > 0) {
      const formData: FormData = new FormData();
      let arr = [], append = false;
      for (let i = 0; i < images.length; i++) {
        console.log('typeof images[i] ', typeof images[i]);
        if (typeof images[i] !== 'string') {
          formData.append('file', images[i]);
          append = true;
        }
        else arr.push(images[i]);
      }
      console.log('append ', append);
      if (append)
        this.advertisementsService.uploadImages(formData).then((val) => {
          this.advertForm.value.images = arr.concat(val);
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      else {
        this.advertForm.value.images = images;
        this.submit();
      }
    }
  }

  prepareFields() {
    let arr = [], obj;
    for (var i = 0; i < this.finalValues.length; i++) {
      let obj1 = {
        key: this.finalValues[i].controls['key'].value,
        value: this.finalValues[i].controls['value'].value,
        type: this.finalValues[i].controls['type'].value
      };
      if (this.finalValues[i].controls['type'].value === 'choose') {
        let obj2 = {values: this.finalValues[i].controls['values'].value};
        obj = Object.assign(obj1, obj2);
      } else obj = obj1;
      arr.push(obj);
    }
    console.log('arr ', arr);
    return arr;
  }

  onSubmit(thisAdvertForm: NgForm) {
    console.log('onSubmit ', thisAdvertForm);
    if (thisAdvertForm.valid) {
      this.loadingScreen.show();
      this.advertForm.value.fields = this.prepareFields();
      this.uploadImages(this.advertForm.controls.images.value);
    }
  }

  onUploadFinished(event) {
    this.advertForm.controls.images.value.push(event.file);
  }

  onRemoved(event) {
    this.advertForm.controls.images.value.splice(this.advertForm.controls.images.value.indexOf(event.file), 1);
  }

  removeField(i) {
    const fields = <FormArray>this.advertForm.get('fields');
    fields.removeAt(i);

  }

  addField() {
    let fields = this.advertForm.get('fields')['controls'] as FormArray;
    console.log('fields ', fields);
    fields.push(this.initFields());
  }


  removeValue(i, j) {
    console.log('i ', i, 'j ', j);
    let values = this.advertForm.get(['fields', i, 'values']) as FormArray;
    console.log('values ', values);
    values.removeAt(j);
    this.finalValues = this.advertForm.controls.fields['controls'];
  }

  addValue(i) {
    console.log(i);
    // let values = this.advertForm.controls.fields.controls[i].controls.values;
    const values = <FormArray>this.advertForm.get('fields')['controls'][i].get('values');
    // const values = this.advertForm.get(['fields', i, 'values']) as FormArray;
    console.log(values);
    // const control = <FormArray>this.survey.get('sections').controls[j].get('questions');
    values.push(this.initFieldValues());
    this.finalValues = this.advertForm.controls.fields['controls'];
  }

  printt(a) {
    console.log(a);
    console.log('this.finalValues ', this.finalValues);
  }

  selectFieldType(type, field, i) {
    console.log('type ', type);
    console.log('field ', type, field, i);
    if (type === 'choose') {
      // const values = <FormArray>this.advertForm.get('fields').controls[i].get('values');

      this.advertForm.controls.fields['controls'][i].controls.values = new FormArray([this.initFieldValues()]);

      const vv = this.advertForm.get(['fields', i, 'values']) as FormArray;
      console.log('vv', vv);
      vv.push(new FormControl(''));
      console.log('vv', vv);
      console.log(' this.advertForm.controls.fields', this.advertForm.controls.fields);
      this.finalValues = this.advertForm.controls.fields['controls'];
    }
  }

  initFieldValues() {
    return new FormControl('');
  }

  initFields() {
    return new FormGroup({
      key: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      // value: new FormArray([this.initFieldValues()])
    });
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.advert = this.route.snapshot.data['serverResult'];
      if (this.advert.category !== null) this.getSubCategories(this.advert.category);
    }
    console.log('advert.subCategory.fields ', this.advert);
    this.advertForm = new FormGroup({
      id: new FormControl(this.advert.id),
      title: new FormControl(this.advert.title, [Validators.required]),
      description: new FormControl(this.advert.description, [Validators.required]),
      price: new FormControl(this.advert.price, [Validators.required, Validators.min(0)]),
      images: new FormControl(this.advert.images),
      phone: new FormControl(this.advert.phone, [Validators.pattern('^[+]?[0-9]*\\.?[0-9]*')]),
      status: new FormControl(this.advert.status),
      fields: new FormArray([]),
      address: new FormControl(this.advert.address),
      viewsCount: new FormControl(this.advert.viewsCount, [Validators.min(0)]),
      createdAt: new FormControl(this.advert.createdAt),
      isBookmarked: new FormControl(this.advert.isBookmarked),
      cityId: new FormControl(this.advert.cityId),
      ownerId: new FormControl(this.advert.ownerId),
      categoryId: new FormControl(this.advert.categoryId),
      subCategoryId: new FormControl(this.advert.subCategoryId),
      // subCategory: new FormControl(this.advert.subCategory),
    });
    console.log('advertForm ', this.advertForm);
    this.getCities();
    this.getCategories();
    this.getUsers();
    if (!this.isEditMode) {
      this.advertForm.controls.ownerId = new FormControl(JSON.parse(localStorage.me).id);
      console.log("this.advertForm.controls.ownerId ", this.advertForm.controls.ownerId);
    } else {
      if (this.advert.fields && this.advert.fields !== null) {
        let items = this.advertForm.get('fields') as FormArray;
        console.log('this.advertForm.get(\'fields\')', this.advertForm.get('fields'));
        for (let i = 0; i < this.advert.fields.length; i++) {
          items.push(new FormGroup({
            key: new FormControl(this.advert.fields[i].key),
            type: new FormControl(this.advert.fields[i].type),
            value: new FormControl(this.advert.fields[i].value),
            // values: new FormControl(this.advert.subCategory.fields[i].values),
          }));

          if (this.advert.fields[i].type === 'choose') {
            console.log('advertForm.controls.fields.controls[i] ', i, this.advertForm.controls.fields['controls'][i]);
            console.log('this.advertForm.get([\'fields\', i]', this.advertForm.get(['fields', i]));
            this.advertForm.controls.fields['controls'][i].controls.values = new FormArray([]);
            let vv = this.advertForm.get(['fields', i, 'values']) as FormArray;
            console.log('vv', vv);
            for (let j = 0; j < this.advert.fields[i].values.length; j++) {
              vv.push(new FormControl(this.advert.fields[i].values[j]));
              console.log('vv', vv);
            }
          }
        }
        console.log('advertForm ', this.advertForm);
        this.finalValues = this.advertForm.controls.fields['controls'];
        console.log('this.finalValues ', this.finalValues);
      }
      /*if (this.advert.subCategory && this.advert.subCategory !== null) {
        let items = this.advertForm.get('fields') as FormArray;
        console.log('this.advertForm.get(\'fields\')', this.advertForm.get('fields'));
        for (let i = 0; i < this.advert.subCategory.fields.length; i++) {
          items.push(new FormGroup({
            key: new FormControl(this.advert.subCategory.fields[i].key),
            type: new FormControl(this.advert.subCategory.fields[i].type),
            value: new FormControl(this.advert.subCategory.fields[i].value),
            // values: new FormControl(this.advert.subCategory.fields[i].values),
          }));

          if (this.advert.subCategory.fields[i].type === 'choose') {
            console.log('advertForm.controls.fields.controls[i] ', i, this.advertForm.controls.fields['controls'][i]);
            console.log('this.advertForm.get([\'fields\', i]', this.advertForm.get(['fields', i]));
            this.advertForm.controls.fields['controls'][i].controls.values = new FormArray([]);
            let vv = this.advertForm.get(['fields', i, 'values']) as FormArray;
            console.log('vv', vv);
            for (let j = 0; j < this.advert.subCategory.fields[i].values.length; j++) {
              vv.push(new FormControl(this.advert.subCategory.fields[i].values[j]));
              console.log('vv', vv);
            }
          }
        }


        console.log('advertForm ', this.advertForm);
        this.finalValues = this.advert.subCategory.fields['controls'];
        console.log('this.finalValues ', this.finalValues);
      }*/
    }
  }
}
