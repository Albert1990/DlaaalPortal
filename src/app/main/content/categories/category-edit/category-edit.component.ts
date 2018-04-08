import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormArray, FormControl, FormGroup, NgForm, Validators, FormBuilder} from '@angular/forms';
import {CategoriesService} from '../categories.service';
import {Category} from '../../categories/category.model';
import {SubCategory} from '../../categories/subCategories/subCategory.model';
import {SubCategoriesService} from '../../categories/subCategories/subCategories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseSplashScreenService} from '../../../../core/services/splash-screen.service';
import {HelpersService} from '../../shared/helpers.service';
import {PageAction} from '../../shared/enums/page-action';
import {MatTabChangeEvent} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FuseConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {ChangeDetectorRef} from '@angular/core';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
  animations: fuseAnimations
})
export class CategoryEditComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  categoryForm: FormGroup;
  fieldsForm: FormGroup;
  category: Category;
  subCategories = [];
  isEditMode = false;
  photo = '';
  defaultImage = '../../../../../assets/images/ecommerce/product-image-placeholder.png';
  selectedForm: FormGroup;
  selectedFieldPanel: FormGroup;
  panelOpened = false;
  fieldsPanelOpen = false;
  finalValues = new FormArray([]);
  tabIndex = -1;


  @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService,
              public dialog: MatDialog,
              public formBuilder: FormBuilder
             ) {
    this.category = new Category();

  }


  getErrorMessage(fieldName, required) {
    return this.categoryForm.controls[fieldName].hasError(required) ? 'You must enter a value' :
      '';
  }

  readFile(inputValue: any): void {
    this.categoryForm.value.image = inputValue.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.photo = reader.result;
    };
    reader.readAsDataURL(this.categoryForm.value.image);
  }

  browseProfilePicture() {
    console.log(this.fileSelector);
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile() {
    console.log('this.categoryForm ', this.categoryForm);
    this.photo = '';
    this.categoryForm.value.image = '';
  }

  onFileChange(event) {
    console.log(event);
    this.readFile(event.target);
  }


  getSubCategoryFields() {
    if (this.selectedForm) {
      // console.log('this.selectedForm.controls.fields.controls ', this.selectedForm.controls.fields.controls);
      return this.selectedForm.controls['fields']['controls'];
    }
  }

  // ===========================================================================================//
  initFinalValues() {
    if (this.selectedForm.controls['fields']) {
      this.finalValues = this.selectedForm.controls['fields']['controls'];
    }
  }

  initFields(field = null, level = null) {
    console.log('initFields ', field);
    if (field !== null) {
      if (field.type === 'choose') {
        console.log('choose ');
        return new FormGroup({
          key: new FormControl(field.key),
          type: new FormControl(field.type),
          value: new FormControl(field.value),
          values: new FormArray([])
          // this.initValues(field.values)
        });
      }
      return new FormGroup({
        key: new FormControl(field.key),
        type: new FormControl(field.type),
        value: new FormControl(field.value)
      });
    }
    return new FormGroup({
      key: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl('')
    });
  }

  initValues(value = null, level = null) {
    console.log('initValues ', value, level);
    let values;
    switch (level) {
      case 3 :
        if (value !== null) {
          values = new FormGroup({
            value: new FormControl(value.value)
          });
        } else {
          values = new FormGroup({
            value: new FormControl('')
          });
        }
        break;
      default :
        if (value !== null) {
          values = new FormGroup({
            value: new FormControl(value.value),
            fields: new FormArray([])
            // value.fields
          });
        } else {
          values = new FormGroup({
            value: new FormControl(''),
            fields: new FormArray([])
            // value.fields
          });
        }
        break;
    }
    console.log('initValues ', values);
    return values;
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

  setSelectedFieldsPanel(field){
    this.selectedFieldPanel = field;
    this.fieldsPanelOpen = true;
  }

  setSelectedForm(sub, close) {
    console.log('setSelectedForm ', sub);
    this.selectedForm = sub;
    if (close == 'close') this.panelOpened = false;
    else this.panelOpened = true;
    //this.finalValues = new FormArray([]);
    //this.initFinalValues();
  }


  createItem(obj): FormGroup { //Fields 1
    console.log('choose ', obj);
    if (obj.type == 'choose' && obj.values && obj.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < obj.values.length; i++) {
        subArr.push(this.createSubItem(obj.values[i]));
      }
      return this.formBuilder.group({
        key: obj.key || 'New Field',
        type: obj.type || '',
        value: obj.value || '',
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        key: obj.key || 'New Field',
        type: obj.type || '',
        value: obj.value || '',
        values: this.formBuilder.array([])
      });
    }

  }

  createSubItem3(subItem): FormGroup { //values 2
    console.log('subItem ', subItem);
    return this.formBuilder.group({
      value: subItem.value || ''
    });
  }

  createSubItem2(subItem): FormGroup { //fields 2
    console.log('createSubItem2' ,subItem);
    if (subItem.type == 'choose' && subItem.values && subItem.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.values.length; i++) {
        subArr.push(this.createSubItem3(subItem.values[i]));
      }
      return this.formBuilder.group({
        key: subItem.key,
        type: subItem.type,
        //value: subItem.value || '',
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        key: subItem.key,
        type: subItem.type,
        //value: subItem.value,
        values: this.formBuilder.array([])
      });
    }
  }

  createSubItem(subItem): FormGroup { //values 1
    if (subItem.fields && subItem.fields.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.fields.length; i++) {
        subArr.push(this.createSubItem2(subItem.fields[i]));
      }
      return this.formBuilder.group({
        value: subItem.value || '',
        fields: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        value: subItem.value || '',
        fields: this.formBuilder.array([])
      });
    }

  }

  createForm(obj) {
    if (obj.fields && obj.fields.length > 0) {
      var arr = [];
      for (var i = 0; i < obj.fields.length; i++) {
        arr.push(this.createItem(obj.fields[i]));
      }
      console.log('arr', arr);

      return this.formBuilder.group({
        title: new FormControl(obj.title || 'New Sub-category', [Validators.required]),
        categoryId: new FormControl(obj.categoryId || ''),
        id: new FormControl(obj.id || ''),
        fields: this.formBuilder.array(arr)
      });
    } else {
      return this.formBuilder.group({
        title: new FormControl(obj.title || 'New Sub-category', [Validators.required]),
        categoryId: new FormControl(obj.categoryId || ''),
        id: new FormControl(obj.id || ''),
        fields: this.formBuilder.array([])
      });
    }

  }

  getSubCategoriesListing() {
    this.subCategories = [];
    let cat = {
      title: "title",
      categoryId: '12123123',
      id: '1',
      fields: [
        {'key': 'key1', 'type': 'text', value: 'textvalue'},
        {
          'key': 'abc', 'type': 'choose', value: 'textvalue',
          'values': [
            {
              'value': 'BMW',
              'fields': [
                {'key': 'model', 'type': 'number'},
                {
                  'key': 'model', 'type': 'choose',
                  'values': [
                    {'value': 'BM X5'},
                    {'value': 'BM X6'},
                  ]
                }
              ]
            }]
        },
        {
          'key': 'Brand2', 'type': 'choose', value: 'textvalue',
          'values': [
            {
              'value': 'BMW2',
              'fields': [
                {
                  'key': 'model', 'type': 'choose',
                  'values': [
                    {'value': 'BM X5'},
                    {'value': 'BM X6'},
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    //this.createForm(cat);

    this.loadingScreen.show();
    this.subCategoriesService.listing(this.category.id).then((val) => {
      console.log('val.items ', val);
      for (let i = 0; i < val.items.length; i++) {
        //this.createForm(val.items[i].fields);
        this.subCategories.push(this.createForm(val.items[i]));
      }

      console.log('this.subCategories ', this.subCategories);
      this.loadingScreen.hide();
    }, (reason) => {
      this.loadingScreen.hide();
      // console.log('error ', reason);
    });
    this.panelOpened = false;
  }

  getSubCategoriesListing__() {
    this.subCategories = [];
    this.loadingScreen.show();
    this.subCategoriesService.listing(this.category.id).then((val) => {
      console.log('val.items ', val);
      for (let i = 0; i < val.items.length; i++) {
        const sub = new FormGroup({
          title: new FormControl(val.items[i].title, [Validators.required]),
          categoryId: new FormControl(val.items[i].categoryId),
          id: new FormControl(val.items[i].id)
        });

        if (val.items[i].fields && val.items[i].fields !== null) {
          sub.controls['fields'] = new FormArray([]);
          const fields = sub.get('fields') as FormArray;
          //console.log('values val.items[i].fields', val.items[i].fields);
          for (let f = 0; f < val.items[i].fields.length; f++) {
            // console.log('val.items[i].fields[f] ',i,f, val.items[i].fields[f]);
            fields.push(this.initFields(val.items[i].fields[f]));

            if (val.items[i].fields[f].type === 'choose' && val.items[i].fields[f].values) {
              //console.log('val.items[i].fields[f].type ', val.items[i].fields[f].type);
              //console.log('choose ');
              sub.controls['fields']['controls'][f].value.values = new FormArray([]);
              //console.log('sub.controls.fields[\'controls\'][i] ', sub.controls.fields['controls'][f]);
              const values = sub.get(['fields', f, 'values']) as FormArray;
              // console.log('values formarray', values);
              // console.log('val.items[i].fields[f].values ', val.items[i].fields[f].values);
              for (let j = 0; j < val.items[i].fields[f].values.length; j++) {
                values.push(this.initValues(val.items[i].fields[f].values[j]));
                if (val.items[i].fields[f].values[j].fields && val.items[i].fields[f].values[j].fields.length > 0) {
                  // console.log("LALALALALALALALALLALALALALALLALA ", j, val.items[i].fields[f].values[j].fields);
                  // console.log("sub.controls.fields['controls'][f]['controls']['values'][j] ", sub.controls.fields['controls'][f]['controls']['values']['controls'][j].value.fields);
                  sub.controls['fields']['controls'][f]['controls']['values']['controls'][j].value.fields = new FormArray([]);
                  const fields2 = sub.get(['fields', f, 'values', j, 'fields']) as FormArray;
                  // console.log('fields2', fields2);
                  for (let k = 0; k < val.items[i].fields[f].values[j].fields.length; k++) {
                    //kk.push(new FormControl(val.items[i].fields[f].values[j].fields[k]));
                    // console.log('val.items[i].fields[f].values[j].fields[k] ', val.items[i].fields[f].values[j].fields[k]);
                    fields2.push(this.initFields(val.items[i].fields[f].values[j].fields[k]));

                    if (val.items[i].fields[f].values[j].fields[k].type === 'choose' && val.items[i].fields[f].values[j].fields[k].values) {
                      console.log("chooooose ", val.items[i].fields[f].values[j].fields[k])
                      sub.controls['fields']['controls'][f]['controls']['values']['controls'][j]['controls']['fields']['controls'][k].value.values = new FormArray([]);
                      const values2 = sub.get(['fields', f, 'values', j, 'fields', k, 'values']) as FormArray;
                      for (let e = 0; e < val.items[i].fields[f].values[j].fields[k].values.length; e++) {
                        values2.push(this.initValues(val.items[i].fields[f].values[j].fields[k].values[e], 3));
                        console.log('values2 ', values2);
                      }
                    }
                  }
                }
              }

            }
          }
        }
        this.subCategories.push(sub);
      }

      console.log('this.subCategories ', this.subCategories);
      this.loadingScreen.hide();
    }, (reason) => {
      this.loadingScreen.hide();
      // console.log('error ', reason);
    });
    this.panelOpened = false;
  }


  // ===========================================================================================//


  prepareFields() {
    console.log('this.finalValues ', this.finalValues);
    let arr = [];
    for (let i = 0; i < this.finalValues.length; i++) {
      arr.push(this.finalValues[i]);
    }
    let controlsarr = arr.map(function (i) {
      return i.controls;
    });
    for (var v = 0; v < controlsarr.length; v++) {
      if (controlsarr[v].values) controlsarr[v].values = controlsarr[v].values.value;
      if (controlsarr[v].value) controlsarr[v].value = controlsarr[v].value.value;
      if (controlsarr[v].key) controlsarr[v].key = controlsarr[v].key.value;
      if (controlsarr[v].type) controlsarr[v].type = controlsarr[v].type.value;
    }
    console.log('controlsarr ', controlsarr);
    return controlsarr;
  }

  saveSubCategory() {
    console.log('this.selectedForm.value ', this.selectedForm);
    this.loadingScreen.show();
    if (this.selectedForm.value.id === 0 || this.selectedForm.value.id === '') {
      delete this.selectedForm.value.id;
      this.subCategoriesService.add(this.category.id, this.selectedForm.value).then((val) => {
        this.helpers.showActionSnackbar(PageAction.Create, true, 'sub-Categories');
        this.getSubCategoriesListing();
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Create, false, 'sub-Categories');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    } else {
      this.subCategoriesService.update(this.category.id, this.selectedForm.value).then((val) => {
        this.loadingScreen.hide();
        this.helpers.showActionSnackbar(PageAction.Update, true, 'sub-Categories');
        this.getSubCategoriesListing();
        this.selectedForm = new FormGroup({});
        this.panelOpened = false;
        this.finalValues = new FormArray([]);

      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Update, false, 'sub-Categories');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    }
    //this.initFinalValues();
    //}

  }

  addNewSubCategory() {
    const sub = new FormGroup({
      title: new FormControl('', [Validators.required]),
      categoryId: new FormControl(this.category.id),
      id: new FormControl('')
    });
    this.subCategories.push(sub);
    this.selectedForm = sub;
  }

  deleteSubCategory(item) {
    console.log('item ', item);
    if (item.value.id && item.value.id !== 0) {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the sub-category (' + item.value.title + ') permanently?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingScreen.show();
          this.subCategoriesService.delete(this.category.id, item.value).then(
            (serverResult) => {
              console.log('serverResult ', serverResult);
              this.subCategories = this.subCategories.filter(item1 => item1 !== item);
              this.loadingScreen.hide();
            },
            (reason) => {
              this.loadingScreen.hide();
              console.log(reason);
            }
          );
        }
        this.confirmDialogRef = null;
      });
    } else {
      this.subCategories = this.subCategories.filter(item1 => item1 !== item);
    }
  }

  deleteAllSubCategories() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ALL the sub-categories permanently?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingScreen.show();
        this.subCategoriesService.deleteAll(this.category.id).then(
          (serverResult) => {
            console.log('serverResult ', serverResult);
            this.subCategories = [];
            this.loadingScreen.hide();
          },
          (reason) => {
            this.loadingScreen.hide();
            console.log(reason);
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  getSubCategoriesListing_() {
    this.subCategories = [];
    this.loadingScreen.show();
    this.subCategoriesService.listing(this.category.id).then((val) => {
      console.log('val ', val);
      for (let i = 0; i < val.items.length; i++) {
        console.log('valval.items ', val.items[i]);
        const sub = new FormGroup({
          title: new FormControl(val.items[i].title, [Validators.required]),
          categoryId: new FormControl(val.items[i].categoryId),
          id: new FormControl(val.items[i].id),
          /* fields: new FormArray([
           this.initFields(val.items[i].fields),
           ])*/
        });
        if (val.items[i].fields && val.items[i].fields !== null) {
          sub.controls.fields = new FormArray([]);
          const fields = sub.get('fields') as FormArray;
          for (let f = 0; f < val.items[i].fields.length; f++) {
            fields.push(new FormGroup({
              key: new FormControl(val.items[i].fields[f].key),
              type: new FormControl(val.items[i].fields[f].type),
              value: new FormControl(val.items[i].fields[f].value),
            }));
            console.log('val.items[i].fields[f].type ', val.items[i].fields[f].type);
            if (val.items[i].fields[f].type === 'choose') {
              console.log('val.items[i].fields[f].type ', val.items[i].fields[f].type);
              console.log('sub ', sub);
              sub.controls.fields['controls'][f].controls.values = new FormArray([]);
              console.log('sub.controls.fields[\'controls\'][i] ', sub.controls.fields['controls'][f]);
              const vv = sub.get(['fields', f, 'values']) as FormArray;
              console.log('vv', vv);
              for (let j = 0; j < val.items[i].fields[f].values.length; j++) {
                //vv.push(new FormControl(val.items[i].fields[f].values[j]));
                vv.push(new FormGroup({
                  value: new FormControl(val.items[i].fields[f].values[j].value),
                  fields: new FormArray([])
                }));
                //vv.push(new FormControl(val.items[i].fields[f].values[j]));
                if (val.items[i].fields[f].values[j].fields && val.items[i].fields[f].values[j].fields.length > 0) {
                  console.log("LALALALALALALALALLALALALALALLALA ", j, val.items[i].fields[f].values[j].fields);
                  console.log("sub.controls.fields['controls'][f]['controls']['values'][j] ", sub.controls.fields['controls'][f]['controls']['values']['controls'][j].value.fields);
                  sub.controls.fields['controls'][f]['controls']['values']['controls'][j].value.fields = new FormArray([]);
                  const kk = sub.get(['fields', f, 'values', j, 'fields']) as FormArray;
                  console.log('kk', kk);
                  for (let k = 0; k < val.items[i].fields[f].values[j].fields.length; k++) {
                    //kk.push(new FormControl(val.items[i].fields[f].values[j].fields[k]));
                    kk.push(new FormGroup({
                      key: new FormControl(val.items[i].fields[f].values[j].fields[k].key),
                      type: new FormControl(val.items[i].fields[f].values[j].fields[k].type),
                      //values: new FormArray(val.items[i].fields[f].values[j].fields[k].values),
                    }));

                    if (val.items[i].fields[f].values[j].fields[k].type === 'choose') {
                      sub.controls.fields['controls'][f]['controls']['values']['controls'][j]['value']['fields'][k].values = new FormArray([]);
                      const vvv = sub.get(['fields', f, 'values', j, 'fields', k, 'values']) as FormArray;
                      console.log('vvv', vvv);
                      for (let e = 0; e < val.items[i].fields[f].values[j].fields[k].values.length; e++) {
                        vvv.push(new FormGroup({
                          value: new FormControl(val.items[i].fields[f].values[j].fields[k].values[e].value),
                          //fields: new FormArray([])
                        }));
                      }
                    }


                  }
                }

              }
            }
          }
        }
        this.subCategories.push(sub);
      }
      console.log('this.subCategories ', this.subCategories);
      this.loadingScreen.hide();
    }, (reason) => {
      this.loadingScreen.hide();
      // console.log('error ', reason);
    });
    this.panelOpened = false;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.fieldsPanelOpen = false;
    this.panelOpened = false;
    this.tabIndex = tabChangeEvent.index;
    if (this.isEditMode && tabChangeEvent.index === 2 && this.subCategories.length === 0) {
      this.getSubCategoriesListing();
    }
  }

  submit() {
    if (this.isEditMode) {
      console.log('this.fieldsForm edit', this.fieldsForm.value);
      if(this.fieldsForm.value.fields && this.fieldsForm.value.fields.length>0){
        this.categoryForm.value.fields = this.fieldsForm.value.fields
      }
      console.log('this.categoryForm edit', this.categoryForm.value);
      this.categoriesService.update(this.categoryForm.value).then((val) => {
        this.helpers.showActionSnackbar(PageAction.Update, true, 'categories');
        this.router.navigate(['/categories']);
        this.loadingScreen.hide();
      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Update, false, 'categories');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    } else {
      delete this.categoryForm.value.id;
      console.log('this.categoryForm add', this.categoryForm.value);
        this.categoriesService.add(this.categoryForm.value).then((val) => {
          this.helpers.showActionSnackbar(PageAction.Create, true, 'categories');
          this.router.navigate(['/categories']);
          this.loadingScreen.hide();
        }, (reason) => {
          this.helpers.showActionSnackbar(PageAction.Create, false, 'categories');
          this.loadingScreen.hide();
          console.log('error ', reason);
        });
    }
  }

  uploadImages(image) {
    console.log('images ', image);
    if (image && image !== '') {
      const formData: FormData = new FormData();
      console.log('typeof images[i] ', typeof image);
      if (typeof image !== 'string') {
        formData.append('file', image);
        this.categoriesService.uploadImages(formData).then((val) => {
          this.categoryForm.value.image = val[0];
          this.submit();
        }, (reason) => {
          console.log('error ', reason);
        });
      } else {
        this.categoryForm.value.image = image;
        this.submit();
      }
    } else {
      this.submit();
    }
  }


  onSubmit(thisAdvertForm: NgForm) {
    console.log('this.categoryForm ', this.categoryForm);
    if (thisAdvertForm.valid) {
      this.loadingScreen.show();
      this.uploadImages(this.categoryForm.value.image);
    }
  }

  ngOnInit() {
    console.log('this.route.snapshot.data[\'serverResult\'] ', this.route.snapshot.data['serverResult']);
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    this.subCategories = [];
    if (this.route.snapshot.data['serverResult']) {
      this.category = this.route.snapshot.data['serverResult'];
      this.fieldsForm = this.createForm(this.category);
      this.fieldsPanelOpen = false;
      this.photo = this.category.image;
    } else this.photo = '';
    this.categoryForm = new FormGroup({
      id: new FormControl(this.category.id),
      title: new FormControl(this.category.title, [Validators.required]),
      image: new FormControl(this.category.image)
    });
  }

}
