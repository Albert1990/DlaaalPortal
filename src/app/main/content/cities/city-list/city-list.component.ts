import {Subscription} from 'rxjs/Subscription';
import {CitiesService} from './../cities.service';
import {FuseSplashScreenService} from './../../../../core/services/splash-screen.service';
import {FuseConfirmDialogComponent} from './../../../../core/components/confirm-dialog/confirm-dialog.component';
import {MatDialogRef, MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {fuseAnimations} from './../../../../core/animations';
import {Observable} from 'rxjs/Observable';
import {City} from './../city.model';
import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  animations: fuseAnimations
})
export class CityListComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<City>;
  displayedColumns = ['id', 'name', 'buttons'];
  btnState: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onPageChangeSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength = 0;
  startedWith: string = '';

  constructor(private citiesService: CitiesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private loadingScreen: FuseSplashScreenService) {
  }

  ngOnInit() {
    console.log("sssss");
    this.dataSource = new MatTableDataSource<City>();
    const serverResult = this.activatedRoute.snapshot.data['serverResult'];
    this.dataSource.data = serverResult.items;
    this.resultsLength = serverResult.totalCount;

    this.onPageChangeSubscription = this.paginator.page.subscribe(
      (pageEvent: PageEvent) => {
      }
    );
  }

  ngOnDestroy() {
    this.onPageChangeSubscription.unsubscribe();
  }

  routeTo(item, to: string) {
    if (to === 'delete')
      this.deleteItem(item);
    else
      this.router.navigate(['/cities', item.id, to]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    /* if (startedWith.length >= 2) {
       this.startedWith = startedWith;
       this.paginator.pageIndex = 0;
       this.usersService.listing(this.paginator.pageIndex,
         this.paginator.pageSize,
         startedWith).then(serverResult => {
         console.log(serverResult);
       }).catch(reason => {
         console.log('error while filtering data');
       });
     }*/
  }

  deleteItem(item: string) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the city?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('item ', item);
        // this.loadingScreen.show();
        this.citiesService.delete(item).then(
          (serverResult) => {
            console.log('delete city serverResult! ', serverResult);
          },
          (reason) => {
            // this.loadingScreen.hide();
            console.log('delete city error! ', reason);
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

}
