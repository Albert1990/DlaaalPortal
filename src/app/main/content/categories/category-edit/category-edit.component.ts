import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormArray, FormControl, FormGroup, NgForm, Validators, FormBuilder} from '@angular/forms';
import {CategoriesService} from '../categories.service';
import {Category} from '../../categories/category.model';
import {SubCategoriesService} from '../../categories/subCategories/subCategories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseSplashScreenService} from '../../../../core/services/splash-screen.service';
import {HelpersService} from '../../shared/helpers.service';
import {PageAction} from '../../shared/enums/page-action';
import {GUID} from '../../GUID/GUID.module';
import {MatTabChangeEvent} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FuseConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {ChangeDetectorRef} from '@angular/core';
//import { JsonEditorComponent, JsonEditorOptions } from 'angular4-jsoneditor/jsoneditor/jsoneditor.component';



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
  Guid: GUID;
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
  editorOptions;
  data;


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
    this.Guid = new GUID();


    this.data = {"products":[{"name":"car","product":[{"name":"honda","model":[{"id":"civic","name":"civic"},{"id":"accord","name":"accord"},{"id":"crv","name":"crv"},{"id":"pilot","name":"pilot"},{"id":"odyssey","name":"odyssey"}]}]}]}
  }

  showMe = false;
  showMe2 = false;
  fixBug(index: number) {
    if(index === 1) {
      this.showMe = true;
      this.showMe2 = false;
    }else if (index === 2){
      this.showMe2 = true;
      this.showMe = false;
    } else {
      this.showMe = false;
      this.showMe2 = false;
    }
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
  selectedItem;
  listClick(event, newValue, state) {
    console.log(newValue);
    this.selectedItem = newValue;
    if(state)
      newValue.showSubfolders = true;
    else{
      newValue.showSubfolders = !newValue.showSubfolders;
    }
    event.stopPropagation()
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

      if (levels[3] && levels[3].add) { //fields 3 level 5
        let subItems;
        let items = this[from]['controls']['fields']['controls'][levels[0].val]
          ['controls']['values']['controls'][levels[1].val]
          ['controls']['fields']['controls'][levels[2].val]
          ['controls']['values']['controls'][levels[3].val] as FormGroup;
        subItems = items.get('fields') as FormArray;
        if (!subItems || subItems == null) {
          this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val]
            ['controls']['values']['controls'][levels[3].val]['controls']['fields'] = new FormArray([]);
          items = this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val]
            ['controls']['values']['controls'][levels[3].val] as FormGroup;
          subItems = items.get('fields') as FormArray;
          console.log('subItems', subItems);
        }
        subItems.push(this.createSubItem4(''));
        console.log('subItems', subItems);
      }


      if (levels[4] && levels[4].add) { //values 3 level 6
        let subItems;
        let items = this[from]['controls']['fields']['controls'][levels[0].val]
          ['controls']['values']['controls'][levels[1].val]
          ['controls']['fields']['controls'][levels[2].val]
          ['controls']['values']['controls'][levels[3].val]
          ['controls']['fields']['controls'][levels[4].val] as FormGroup;
        subItems = items.get('values') as FormArray;
        if (!subItems || subItems == null) {
          // alert()
          this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val]
            ['controls']['values']['controls'][levels[3].val]
            ['controls']['fields']['controls'][levels[4].val]['controls']['values'] = new FormArray([]);
          items = this[from]['controls']['fields']['controls'][levels[0].val]
            ['controls']['values']['controls'][levels[1].val]
            ['controls']['fields']['controls'][levels[2].val]
            ['controls']['values']['controls'][levels[3].val]
            ['controls']['fields']['controls'][levels[4].val]as FormGroup;
          subItems = items.get('values') as FormArray;
          console.log('subItems', subItems);
        }
        if (levels[4].type == 'choose') subItems.push(this.createSubItem5(levels[4]));
        else subItems.push(this.createSubItem5(''));
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

    if (levels[4] && levels[4].remove) {
      let level = this[from].get('fields')['controls'][levels[0].val]
        .get('values')['controls'][levels[1].val]
        .get('fields')['controls'][levels[2].val]
        .get('values')['controls'][levels[3].val]
        .get('fields') as FormArray;
      level.removeAt(levels[4].val);
    }
    if (levels[5] && levels[5].remove) {
      let level = this[from].get('fields')['controls'][levels[0].val]
        .get('values')['controls'][levels[1].val]
        .get('fields')['controls'][levels[2].val]
        .get('values')['controls'][levels[3].val]
        .get('fields')['controls'][levels[4].val]
        .get('values')as FormArray;
      level.removeAt(levels[5].val);
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
  }


  createItem(obj): FormGroup { //Fields 1
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
        priority: obj.priority || '',
        isInFilter: obj.isInFilter || '',
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        _id: obj._id || this.Guid.newGuid(),
        key: obj.key || 'New Field',
        type: obj.type || '',
        value: obj.value || '',
        priority: obj.priority || '',
        isInFilter: obj.isInFilter || '',
        values: this.formBuilder.array([])
      });
    }
  }

  createSubItem5(subItem): FormGroup { //values 2
    console.log('createSubItem5 ', );
     return this.formBuilder.group({
        value: subItem.value || ''
     });
  }
  createSubItem4(subItem): FormGroup { //fields 3
    console.log('createSubItem4 ', );
    if (subItem.type == 'choose' && subItem.values && subItem.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.values.length; i++) {
        subArr.push(this.createSubItem5(subItem.values[i]));
      }
      return this.formBuilder.group({
        _id: subItem._id ||this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        isInFilter: subItem.isInFilter,
        value: subItem.value || '',
        values: this.formBuilder.array(subArr)
      });
    } else {
      console.log('createSubItem4 return else');
      return this.formBuilder.group({
        _id: subItem._id || this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        isInFilter: subItem.isInFilter,
        value: subItem.value,
        values: this.formBuilder.array([])
      });
    }
  }

  createSubItem3(subItem): FormGroup { //values 2
    if (subItem.fields && subItem.fields.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.fields.length; i++) {
        subArr.push(this.createSubItem4(subItem.fields[i]));
      }
      return this.formBuilder.group({
        value: subItem.value || '',
        fields: this.formBuilder.array(subArr)
      });
    } else {
      console.log('createSubItem3 return' );
      return this.formBuilder.group({
        value: subItem.value || '',
        fields: this.formBuilder.array([])
      });
    }
  }

  createSubItem2(subItem): FormGroup { //fields 2
    if (subItem.type == 'choose' && subItem.values && subItem.values.length > 0) {
      var subArr = [];
      for (var i = 0; i < subItem.values.length; i++) {
        subArr.push(this.createSubItem3(subItem.values[i]));
      }
      console.log('subArr ', subArr);
      return this.formBuilder.group({
        _id: subItem._id ||this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        isInFilter: subItem.isInFilter,
        value: subItem.value || '',
        values: this.formBuilder.array(subArr)
      });
    } else {
      return this.formBuilder.group({
        _id: subItem._id || this.Guid.newGuid(),
        key: subItem.key,
        type: subItem.type,
        priority: subItem.priority,
        isInFilter: subItem.isInFilter,
        value: subItem.value,
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
    console.log('obj.title  ', obj.title );
    if (obj.fields && obj.fields.length > 0) {
      var arr = [];
      for (var i = 0; i < obj.fields.length; i++) {
        arr.push(this.createItem(obj.fields[i]));
      }
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



  // ===========================================================================================//


  saveSubCategory() {
    console.log('this.selectedForm.value ', this.selectedForm);
    this.loadingScreen.show();
    if (this.selectedForm.value.id === 0 || this.selectedForm.value.id === '') {
      console.log('add ');
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
      console.log('edit ');
      this.subCategoriesService.update(this.category.id, this.selectedForm.value).then((val) => {
        this.helpers.showActionSnackbar(PageAction.Update, true, 'sub-Categories');
        this.getSubCategoriesListing();
        this.loadingScreen.hide();
        //this.selectedForm = new FormGroup({});
        //this.panelOpened = false;
        //this.finalValues = new FormArray([]);

      }, (reason) => {
        this.helpers.showActionSnackbar(PageAction.Update, false, 'sub-Categories');
        this.loadingScreen.hide();
        console.log('error ', reason);
      });
    }
  }

  addNewSubCategory() {
    let sub = this.createForm('');
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
      console.log('this.fieldsForm ', this.fieldsForm);
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
