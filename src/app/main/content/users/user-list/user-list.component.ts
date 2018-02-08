import { AppSettings } from './../../shared/app.settings';
import { UserType } from './../enums/user-type';
import { UserStatus } from './../enums/user-status';
import { Subscription } from 'rxjs/Subscription';
import { UsersService } from './../users.service';
import { FuseSplashScreenService } from './../../../../core/services/splash-screen.service';
import { FuseConfirmDialogComponent } from './../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from './../../../../core/animations';
import { Observable } from 'rxjs/Observable';
import { User } from './../user.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<User>;
  displayedColumns = ['id', 'name', 'email', 'advertisementCount', 'status', 'buttons'];
  btnState: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onPageChangeSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength = 0;
  startedWith: string = '';

  constructor(private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private loadingScreen: FuseSplashScreenService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>();
    const serverResult = this.activatedRoute.snapshot.data['serverResult'];
    this.dataSource.data = serverResult.items;
    this.resultsLength = serverResult.totalCount;

    this.onPageChangeSubscription = this.paginator.page.subscribe(
      (pageEvent: PageEvent) => {
        // make http request to get users in pageIndex: pageEvent.index
        //this.usersService.listing(pageEvent.pageIndex, pageEvent.pageSize, this.startedWith)
      }
    );
  }

  ngOnDestroy() {
    this.onPageChangeSubscription.unsubscribe();
  }

  editItem(itemId: string) {
    this.router.navigate(['/users', itemId, 'edit']);
  }

  applyFilter(startedWith: string) {
    if (startedWith.length >= 2) {
      this.startedWith = startedWith;
      this.paginator.pageIndex = 0;
      this.usersService.listing(this.paginator.pageIndex,
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
        this.usersService.delete(itemId).then(
          (serverResult) => {
            this.loadingScreen.hide();
            this.dataSource.data = serverResult.users;
            this.resultsLength = serverResult.totalCount;
          },
          (reason) => {
            this.loadingScreen.hide();
            console.log('delete user error!');
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

}