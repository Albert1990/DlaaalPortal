import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
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
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
  animations: fuseAnimations
})
export class CategoryEditComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  categoryForm: FormGroup;
  category: Category;
  subCategories = [];
  isEditMode = false;
  photo = '';
  defaultImage = '../../../../../assets/images/ecommerce/product-image-placeholder.png';
  selectedForm: any;
  panelOpened = false;
  finalValues = new FormArray([]);


  @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService,
              public dialog: MatDialog,
              private ref: ChangeDetectorRef) {
    this.category = new Category();
   /* setInterval(() => {
      this.ref.detectChanges();
      console.log('this.selectedForm ', this.selectedForm);
    }, 5000);*/
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
      return this.selectedForm.fields;
    }
  }

  initFields(val) {
    if (val !== '') {
      if (val.type === 'choose') {
        return new FormGroup({
          key: new FormControl(val.key, [Validators.required]),
          type: new FormControl(val.type),
          value: new FormControl(val.value),
          values: new FormArray([this.initFieldValues(val.values)])
        });
      }
      return new FormGroup({
        key: new FormControl(val.key, [Validators.required]),
        type: new FormControl(val.type ),
        value: new FormControl(val.value)
      });
    }
    console.log('THIS ONE ');
    return new FormGroup({
      key: new FormControl('', [Validators.required]),
      type: new FormControl('' ),
      value: new FormControl('')
    });

  }

  initFieldValues(values) {
    if (values !== '') {
      return new FormControl(values);
    }
    return new FormControl('');
  }
  // initFieldOFValue(values) {
  //   if (values !== '') {
  //     return new FormControl(values);
  //   }
  //   return new FormControl('');
  // }


  removeField(i) {
    const fields = <FormArray>this.selectedForm.get('fields');
    fields.removeAt(i);
    // this.patchFieldsValues('delete', i);
  }
  /*patchFieldsValues(flag, index){
    const fields = this.selectedForm.get('fields')['controls'] as FormArray;
    const control = <FormArray>this.selectedForm.controls['fields'];
    if (flag === 'add') {
      for (let i = 0; i < fields.length; i++) {
        control.at(i).patchValue(this.initFields(''));
      }
    }else {
      control.removeAt(index);
      // control.at(index).remove();
    }
  }*/

  addField() {
    if (!this.selectedForm.controls.fields) {
      this.selectedForm.controls.fields = new FormArray([]);
    }
    const fields = this.selectedForm.get('fields') as FormArray;
    console.log('fields', fields);
    fields.push(this.initFields(''));
    // let last = (<FormArray> this.selectedForm.get('fields')).at(fields.length - 1);
    console.log('this.selectedForm1 ', this.selectedForm);

  }


  removeValue(i, j) {
    const values = this.selectedForm.get(['fields', i, 'values']) as FormArray;
    values.removeAt(j);
    if (this.selectedForm.controls.fields) {
      this.finalValues = this.selectedForm.controls.fields['controls'];
    }
  }

  addValue(i) {
    console.log(i);
    const values = <FormArray>this.selectedForm.get('fields')['controls'][i].get('values');
    console.log(values);
    values.push(this.initFieldValues(''));
    if (this.selectedForm.controls.fields) {
      this.finalValues = this.selectedForm.controls.fields['controls'];
    }
  }
  removeSomethingFromArray(array, index) {
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  removeFieldOfValue(array, index) {

  }

  addSomethingToArray(array, something) {
    let index = array.length;
    console.log('array,index, something ', array,index, something);
    array[index] = something;
    //array.push(something);
    console.log('this.subCategories', this.subCategories);
  }

  printt(a) {
    console.log('this.selectedForm ', this.selectedForm);
  }


  selectFieldType(type, field, i) {
    if (type === 'choose') {
        field.values.push({value: ''});
    }
  }

  setSelectedForm(sub) {
    console.log('setSelectedForm ', sub);
    this.selectedForm = sub;
    this.panelOpened = true;
    /*this.finalValues = new FormArray([]);
    if (this.selectedForm.controls.fields) {
      this.finalValues = this.selectedForm.controls.fields['controls'];
    }*/
  }
  prepareFields() {
    let arr = [], obj;
    for (let i = 0; i < this.finalValues.length; i++) {
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

  saveSubCategory() {
    console.log('this.selectedForm ', this.selectedForm.value);
    if (this.selectedForm.valid) {
      this.selectedForm.value.fields = this.prepareFields();
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
          this.helpers.showActionSnackbar(PageAction.Update, true, 'sub-Categories');
          this.getSubCategoriesListing();
          this.loadingScreen.hide();
        }, (reason) => {
          this.helpers.showActionSnackbar(PageAction.Update, false, 'sub-Categories');
          this.loadingScreen.hide();
          console.log('error ', reason);
        });
      }
    }
  }

  addNewSubCategory() {
    const sub = new FormGroup({
      title: new FormControl('', [Validators.required]),
      categoryId: new FormControl(this.category.id),
      id: new FormControl(''),
      /*fields: new FormArray([
        this.initFields(''),
      ])*/
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

  getSubCategoriesListing() {
    this.subCategories = [];
    this.loadingScreen.show();
    this.subCategoriesService.listing(this.category.id).then((val) => {
      this.subCategories = val.items;
      console.log('val ', val);
      console.log('this.subCategories ', this.subCategories);
      this.loadingScreen.hide();
    }, (reason) => {
      this.loadingScreen.hide();
      // console.log('error ', reason);
    });
    this.panelOpened = false;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (this.isEditMode && tabChangeEvent.index === 1 && this.subCategories.length === 0) {
      this.getSubCategoriesListing();
    }

  }

  submit() {
    if (this.isEditMode) {
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
      this.photo = this.category.image;
    } else this.photo = '';
    this.categoryForm = new FormGroup({
      id: new FormControl(this.category.id),
      title: new FormControl(this.category.title, [Validators.required]),
      image: new FormControl(this.category.image)
    });
  }

}
