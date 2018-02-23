import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../core/animations';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CategoriesService} from '../categories.service';
import {Category} from '../../categories/category.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseSplashScreenService} from '../../../../core/services/splash-screen.service';
import {HelpersService} from '../../shared/helpers.service';
import {PageAction} from '../../shared/enums/page-action';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
  animations: fuseAnimations
})
export class CategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  category: Category;
  isEditMode: boolean = false;
  photo = '';
  defaultImage = '../../../../../assets/images/ecommerce/product-image-placeholder.png';

  @ViewChild('file') fileSelector: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService,
              private loadingScreen: FuseSplashScreenService,
              private helpers: HelpersService) {
    this.category = new Category();
  }

  getErrorMessage(fieldName, required) {
    return this.categoryForm.controls[fieldName].hasError(required) ? 'You must enter a value' :
      '';
  }

  readFile(inputValue: any): void {
    this.categoryForm.value.image = inputValue.files[0];
    var reader: FileReader = new FileReader();

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
    console.log("this.categoryForm ", this.categoryForm);
    this.photo = '';
    this.categoryForm.value.image = '';
  }

  onFileChange(event) {
    console.log(event);
    this.readFile(event.target);
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
    }else{
      this.submit();
    }
  }


  onSubmit(thisAdvertForm: NgForm) {
    console.log("this.categoryForm ", this.categoryForm);
    if (thisAdvertForm.valid) {
      this.loadingScreen.show();
      this.uploadImages(this.categoryForm.value.image);
    }
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.category = this.route.snapshot.data['serverResult'];
      this.photo = this.category.image;
    }else this.photo = '';
    this.categoryForm = new FormGroup({
      id: new FormControl(this.category.id),
      title: new FormControl(this.category.title, [Validators.required]),
      image: new FormControl(this.category.image)
    });
  }

}
