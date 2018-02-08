import { CategoriesService } from './../categories.service';
import { Category } from './../category.model';
import { Subscription } from 'rxjs/Subscription';
import { FuseSplashScreenService } from './../../../../core/services/splash-screen.service';
import { FuseConfirmDialogComponent } from './../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from './../../../../core/animations';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  animations: fuseAnimations
})

export class CategoryListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Category>;
  displayedColumns = ['id', 'image', 'title', 'buttons'];
  btnState: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onPageChangeSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength = 0;
  startedWith: string = '';

  constructor(private categoriesService: CategoriesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private loadingScreen: FuseSplashScreenService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Category>();
    const serverResult = this.activatedRoute.snapshot.data['serverResult'];
    this.dataSource.data = serverResult.items;
    this.resultsLength = serverResult.totalCount;

    this.onPageChangeSubscription = this.paginator.page.subscribe(
      (pageEvent: PageEvent) => {
        // make http request to get users in pageIndex: pageEvent.index
        this.categoriesService.listing(pageEvent.pageIndex, pageEvent.pageSize, this.startedWith)
      }
    );
  }

  ngOnDestroy() {
    this.onPageChangeSubscription.unsubscribe();
  }

  editItem(itemId: string) {
    this.router.navigate(['/categories', itemId, 'edit']);
  }

  applyFilter(startedWith: string) {
    if (startedWith.length >= 2) {
      this.startedWith = startedWith;
      this.paginator.pageIndex = 0;
      this.categoriesService.listing(this.paginator.pageIndex,
        this.paginator.pageSize,
        startedWith).then(serverResult => {
          console.log(serverResult);
        }).catch(reason => {
          console.log('error while filtering data');
        });
    }
  }

  deleteItem(itemId: string) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingScreen.show();
        this.categoriesService.delete(itemId).then(
          (serverResult) => {
            this.loadingScreen.hide();
            this.dataSource.data = serverResult.users;
            this.resultsLength = serverResult.totalCount;
          },
          (reason) => {
            this.loadingScreen.hide();
            console.log('delete category error!');
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

}
