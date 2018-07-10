import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormArray, FormControl, FormGroup, NgForm, Validators, FormBuilder} from '@angular/forms';
import {PageAction} from '../../shared/enums/page-action';
import {AdvertisementsService} from '../../lazy-child/advertisements.service';
import {Advertisement} from '../../lazy-child/advertisement.model';
import {GUID} from '../../GUID/GUID.module';
import {ActivatedRoute, Router} from '@angular/router';
import {HelpersService} from '../../shared/helpers.service';
import {FuseSplashScreenService} from '../../../../core/services/splash-screen.service';
import {CitiesService} from './../../cities/cities.service';
import {CategoriesService} from './../../categories/categories.service';
import {SubCategoriesService} from './../../categories/subCategories/subCategories.service';
import {UsersService} from './../../users/users.service';
import {AppSettings} from '../../shared/app.settings';
import {AuthService} from '../../auth/auth.service';


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
  Guid: GUID;

  selectedFieldPanel: FormGroup;
  fieldsPanelOpen = false;
  subCategoryFields: FormGroup;


  // @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private citiesService: CitiesService,
              private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private usersService: UsersService,
              private advertisementsService: AdvertisementsService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService,
              private authService: AuthService,
              public formBuilder: FormBuilder) {
    this.advert = new Advertisement();
    this.Guid = new GUID();
    this.selectedFieldPanel = new FormGroup({_id:new FormControl(null)});
  }
  showMe = false
  fixBug(index: number) {
    if(index === 2) {
      this.showMe = true;
    } else {
      this.showMe = false;
    }
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
    if (category) {
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
    this.subCategoryFields = new FormGroup({});
    if (category && category !== null && category !== '') this.getSubCategories(category);
    else this.advertForm.value.subCategoryId = '';
  }

  setSelectedSubCategory(subCategory) {
    console.log('subCategory ', subCategory);
    console.log('this.advertForm ', this.advertForm);
    this.advert.subCategory = subCategory;
    this.subCategoryFields = new FormGroup({});
    if (!subCategory || subCategory == null || subCategory === '') {
    }
    else {
      if(subCategory.fields )
        this.subCategoryFields = this.createForm(subCategory);
    }

  }

  submit() {
    console.log('submit 1');
    console.log('this.subCategoryFields ', this.subCategoryFields.value);
    this.advertForm.value.fields = this.subCategoryFields.value.fields ? this.subCategoryFields.value.fields : null;
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
       // console.log('typeof images[i] ', typeof images[i]);
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

  onSubmit(thisAdvertForm: NgForm) {
    console.log('onSubmit ', thisAdvertForm);
    console.log('this.advertForm.controls.images.value ', this.advertForm);
    if (thisAdvertForm.valid) {
      this.loadingScreen.show();
     // this.advertForm.value.fields = this.prepareFields();
      this.uploadImages(this.advertForm.controls.images.value);
    }
  }

  uploadService(){
    return "'" + AppSettings.baseUrl + '/files/images/upload?access_token=' + this.authService.getToken() + "'";
  }
  onUploadFinished(event) {
   // console.log('event ', event);
    this.advertForm.controls.images.value.push(event.file);
   // console.log('this.advertForm.controls.images.value ', this.advertForm.controls.images.value);
  }

  onRemoved(event) {
  //  console.log('event ', event);
   // console.log('file', event.file);
    for (let i = 0; i < this.advertForm.controls.images.value.length; i++) {
      // console.log("this.advertForm.controls.images.value[i] ", this.advertForm.controls.images.value[i]);
      // console.log("event.file.src ", event.src);
      if (this.advertForm.controls.images.value[i] === event.src
      || this.advertForm.controls.images.value[i] === event.file) {
        this.advertForm.controls.images.value.splice(i, 1);
        break;
      }
    }
      /*for (let i = 0; i < this.advertForm.controls.images.value.length; i++) {
        if (event.file.src.split(':')[0] === 'http') {
          if (this.advertForm.controls.images.value[i] === event.file.src) {
            this.advertForm.controls.images.value.splice(i, 1);
            break;
          }
        }else {
          if (this.advertForm.controls.images.value[i] === event.file) {
            this.advertForm.controls.images.value.splice(i, 1);
            break;
          }
        }
      }*/


   // console.log('this.advertForm.controls.images.value ', this.advertForm.controls.images.value);
  }

  //============================================================================//

  setSelectedFieldsPanel(field){
    console.log('field ', field);
    this.selectedFieldPanel = field;
    console.log('selectedFieldPanel.value._id == field.value._id ', this.selectedFieldPanel.value._id , field.value._id);
    //this.fieldsPanelOpen = !this.fieldsPanelOpen;
  }
  addSomething(levels = null, from): void {
    console.log("addSomething ", levels);
    if (!this[from].controls['fields']) {
      this[from].controls['fields'] = new FormArray([]);
    }
    if (levels == null) { //fields 1
      let item = this[from] as FormGroup;
      let subItems = item.get('fields') as FormArray;
      subItems.push(this.createItem(''));

    } else {
      if (levels[0] && levels[0].add) { //values 1
        let subItems;
        let items = this[from]['controls']['fields']['controls'][levels[0].val] as FormGroup;
        subItems = items.get('values') as FormArray;


        if (!subItems || subItems == null) {
          // alert()
          this[from]['controls']['fields']['controls'][levels[0].val]['controls']['values'] = new FormArray([]);
          items = this[from]['controls']['fields']['controls'][levels[0].val] as FormGroup;
          subItems = items.get('values') as FormArray;
          console.log('subItems', subItems);
        }

        if (levels[0].type == 'choose') subItems.push(this.createSubItem(levels[0]));
        else subItems.push(this.createSubItem(''));

      }
      if (levels[1] && levels[1].add) { //fields 2

        let subItems;
        let items = this[from]['controls']['fields']['controls'][levels[0].val]
          ['controls']['values']['controls'][levels[1].val] as FormGroup;
        subItems = items.get('fields') as FormArray;

        if (!subItems || subItems == null) {
          //alert()
          this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]['controls']['fields'] = new FormArray([]);
          items = this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val] as FormGroup;
          subItems = items.get('fields') as FormArray;
          console.log('subItems', subItems);
        }

        subItems.push(this.createSubItem2(''));
      }
      if (levels[2] && levels[2].add) { //values 2
        let subItems;
        let items = this[from]['controls']['fields']['controls'][levels[0].val]
          ['controls']['values']['controls'][levels[1].val]
          ['controls']['fields']['controls'][levels[2].val] as FormGroup;
        subItems = items.get('values') as FormArray;


        if (!subItems || subItems == null) {
          // alert()
          this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val]['controls']['values'] = new FormArray([]);
          items = this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val] as FormGroup;
          subItems = items.get('values') as FormArray;
          console.log('subItems', subItems);
        }

        if (levels[2].type == 'choose') subItems.push(this.createSubItem3(levels[2]));
        else subItems.push(this.createSubItem3(''));
      }
    }
  }

  removeSomething(levels = null, from) {
    if (levels[0] && levels[0].remove) {
      let level = this[from].get('fields') as FormArray;
      level.removeAt(levels[0].val);
    }
    if (levels[1] && levels[1].remove) {
      let level = this[from].get('fields')['controls'][levels[0].val]
        .get('values') as FormArray;
      level.removeAt(levels[1].val);
    }
    if (levels[2] && levels[2].remove) {
      let level = this[from].get('fields')['controls'][levels[0].val]
        .get('values')['controls'][levels[1].val]
        .get('fields') as FormArray;
      level.removeAt(levels[2].val);
    }
    if (levels[3] && levels[3].remove) {
      let level = this[from].get('fields')['controls'][levels[0].val]
        .get('values')['controls'][levels[1].val]
        .get('fields')['controls'][levels[2].val]
        .get('values')as FormArray;
      level.removeAt(levels[3].val);
    }

  }

  onSelectType(level, type, from) {
    console.log('level, type ', level, type);
    if (type === 'choose') {
      if (level[0] && level[0].type == 'choose') { // values 1
        level[0].add = true;
        level[0].type = 'choose';
        this.addSomething(level, from);
      } else if (level[2] && level[2].type == 'choose') { // values 2
        level[2].add = true;
        console.log('level', level);
        this.addSomething(level, from);
      }
    }
  }

  createItem(obj): FormGroup { //Fields 1
    //console.log('choose ', obj);
    if (obj.type == 'choose' && obj.values && obj.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < obj.values.length; i++) {
        subArr.push(this.createSubItem(obj.values[i]));
      }
      return this.formBuilder.group({
        _id: obj._id || this.Guid.newGuid(),
        key: obj.key || 'New Field',
        type: obj.type || '',
        value: obj.value || '',
        priority: obj.priority,
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        _id: obj._id || this.Guid.newGuid(),
        key: obj.key || 'New Field',
        type: obj.type || '',
        value: obj.value || '',
        priority: obj.priority,
        values: this.formBuilder.array([])
      });
    }

  }

  createSubItem3(subItem): FormGroup { //values 2
    //console.log('subItem ', subItem);
    return this.formBuilder.group({
      value: subItem.value || ''
    });
  }

  createSubItem2(subItem): FormGroup { //fields 2
   // console.log('createSubItem2' ,subItem);
    if (subItem.type == 'choose' && subItem.values && subItem.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.values.length; i++) {
        subArr.push(this.createSubItem3(subItem.values[i]));
      }
      return this.formBuilder.group({
        _id: subItem._id || this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        value: subItem.value,
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        _id: subItem._id || this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        value: subItem.value,
        values: this.formBuilder.array([])
      });
    }
  }

  createSubItem(subItem): FormGroup { //values 1
   /* if (subItem.fields && subItem.fields.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.fields.length; i++) {
        subArr.push(this.createSubItem2(subItem.fields[i]));
      }
      return this.formBuilder.group({
        value: subItem.value || '',
        fields: this.formBuilder.array(subArr)
      });
    } else {*/
      return this.formBuilder.group({
        value: subItem.value || '',
        //fields: this.formBuilder.array([])
      });
    //}
  }

  createForm(obj) {
    if (obj.fields && obj.fields.length > 0) {
      var arr = [];
      for (var i = 0; i < obj.fields.length; i++) {
        //console.log('obj.fields[i] ', obj.fields[i]);
        arr.push(this.createItem(obj.fields[i]));
      }
      //console.log('arr', arr);
      return this.formBuilder.group({
        fields: this.formBuilder.array(arr)
      });
    } else {
      return this.formBuilder.group({
        fields: this.formBuilder.array([])
      });
    }

  }
  //============================================================================//

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.advert = this.route.snapshot.data['serverResult'];
      if (this.advert.category !== null) this.getSubCategories(this.advert.category);
    }
    console.log('advert.subCategory ', this.advert);
    this.advertForm = new FormGroup({
      id: new FormControl(this.advert.id),
      title: new FormControl(this.advert.title, [Validators.required]),
      description: new FormControl(this.advert.description, [Validators.required]),
      price: new FormControl(this.advert.price, [Validators.required, Validators.min(0)]),
      images: new FormControl(this.advert.images),
      phone: new FormControl(this.advert.phone, [Validators.pattern('^[+]?[0-9]*\\.?[0-9]*')]),
      status: new FormControl(this.advert.status),
      fields: new FormGroup({}),
      address: new FormControl(this.advert.address),
      viewsCount: new FormControl(this.advert.viewsCount, [Validators.min(0)]),
      createdAt: new FormControl(this.advert.createdAt),
      isBookmarked: new FormControl(this.advert.isBookmarked),
      cityId: new FormControl(this.advert.cityId),
      ownerId: new FormControl(this.advert.ownerId),
      categoryId: new FormControl(this.advert.categoryId, [Validators.required]),
      subCategoryId: new FormControl(this.advert.subCategoryId, [Validators.required]),
      // subCategory: new FormControl(this.advert.subCategory),
    });
    console.log('advertForm ', this.advertForm);
    this.getCities();
    this.getCategories();
    this.getUsers();
    if (!this.isEditMode) {
      this.advertForm.controls.ownerId = new FormControl(JSON.parse(localStorage.me).id);
     /// console.log('this.advertForm.controls.ownerId ', this.advertForm.controls.ownerId);
    } else {
      if (this.advert.subCategory && this.advert.subCategory !== null) {
        console.log('this.advert.subCategory ', this.advert.subCategory);
        this.subCategoryFields = this.createForm(this.advert);
        console.log('this.subCategoryFields ', this.subCategoryFields);
      }

    }

  }
}
