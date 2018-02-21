import {Subscription} from 'rxjs/Subscription';
import {AdvertisementsService} from './../advertisements.service';
import {FuseSplashScreenService} from './../../../../core/services/splash-screen.service';
import {FuseConfirmDialogComponent} from './../../../../core/components/confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {fuseAnimations} from './../../../../core/animations';
import {Observable} from 'rxjs/Observable';
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Advertisement} from './../advertisement.model';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrls: ['./advertisement-list.component.scss'],
  animations: fuseAnimations
})
export class AdvertisementListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Advertisement>;
  displayedColumns = ['id', 'image' ,'title', 'price', 'city','status', 'buttons'];
  btnState: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onPageChangeSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength = 0;
  startedWith: string = '';

  constructor(private AdvertisementsService: AdvertisementsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private loadingScreen: FuseSplashScreenService) {
  }


  ngOnDestroy() {
    this.onPageChangeSubscription.unsubscribe();
  }

  routeTo(item, to: string) {
    if (to === 'delete')
      this.deleteItem(item);
    else
      this.router.navigate(['/advertisements', item.id, to]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  deleteItem(item) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the advertisement?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
       // console.log("item ", item);
         this.loadingScreen.show();
        this.AdvertisementsService.delete(item).then(
          (serverResult) => {
           // console.log('delete user serverResult! ', serverResult);
            this.dataSource.data = this.dataSource.data.filter(item1 => item1 !== item);
             this.loadingScreen.hide();
            // this.dataSource.data = serverResult.users;
            // this.resultsLength = serverResult.totalCount;
          },
          (reason) => {
            // this.loadingScreen.hide();
            console.log('delete user error! ', reason);
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }


  ngOnInit() {
    this.dataSource = new MatTableDataSource<Advertisement>();
    const serverResult = this.activatedRoute.snapshot.data['serverResult'];
    this.dataSource.data = serverResult.items;
    this.resultsLength = serverResult.totalCount;

    this.onPageChangeSubscription = this.paginator.page.subscribe(
      (pageEvent: PageEvent) => {
        // make http request to get users in pageIndex: pageEvent.index
        // this.usersService.listing(pageEvent.pageIndex, pageEvent.pageSize, this.startedWith)
      }
    );
  }
}
