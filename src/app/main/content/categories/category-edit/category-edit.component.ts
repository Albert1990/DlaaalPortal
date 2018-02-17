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
    var file: File = inputValue.files[0];
    var reader: FileReader = new FileReader();

    reader.onloadend = (e) => {
      this.categoryForm.value.image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  browseProfilePicture() {
    console.log(this.fileSelector);
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile(event) {
    this.categoryForm.value.image = '';
  }

  onFileChange(event) {
    console.log(event);
    this.readFile(event.target);
    // this.userForm.value.avatar = event.target.files[0];
  }


  onSubmit(thisAdvertForm: NgForm) {
    if (thisAdvertForm.valid) {
      // this.loadingScreen.show();
      // this.uploadImages(this.advertForm.value.images);
      if (this.isEditMode) {
        console.log('this.categoryForm edit', this.categoryForm.value);
        this.categoriesService.update(this.categoryForm.value).then((val) => {
          this.helpers.showActionSnackbar(PageAction.Update, true, 'categories');
          this.router.navigate(['/categories']);
          this.loadingScreen.hide();
        }, (reason) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Update, false, 'categories');
          console.log('error ', reason);
        });
      } else {
        delete this.categoryForm.value.id;
        console.log('this.categoryForm add', this.categoryForm.value);
        this.categoriesService.add(this.categoryForm.value).then((val) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Create, true, 'categories');
          this.router.navigate(['/categories']);
        }, (reason) => {
          this.loadingScreen.hide();
          this.helpers.showActionSnackbar(PageAction.Create, false, 'categories');
          console.log('error ', reason);
        });
      }
    }
  }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    if (this.route.snapshot.data['serverResult']) {
      this.category = this.route.snapshot.data['serverResult'];
    }
    this.categoryForm = new FormGroup({
      id: new FormControl(this.category.id),
      title: new FormControl(this.category.title, [Validators.required]),
      image: new FormControl(this.category.image)
    });
  }

}
