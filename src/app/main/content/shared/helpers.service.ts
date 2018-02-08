import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { PageAction } from './enums/page-action';

@Injectable()
export class HelpersService {
  
  constructor(private snackBar: MatSnackBar) { }

  showActionSnackbar(pageAction: PageAction, pageActionResult: boolean, resourceType: string, config: any = null){
    let message: string = '';
    switch(pageAction){
      case PageAction.Create:
      if(pageAction)
        message = 'New ' + resourceType + ' has been created successfully';
      else
        message = 'An error happened while creating the new ' + resourceType;
      break;
      case PageAction.Delete:
      if(pageAction)
        message = 'Selected ' + resourceType + ' has been deleted successfully';
      else
        message = 'An error happened while deleting the selected ' + resourceType;
      break;
      case PageAction.Update:
      if(pageAction)
        message = 'Selected ' + resourceType + ' has been updated successfully';
      else
        message = 'An error happened while updating the selected ' + resourceType;
      break;
    }
    this.snackBar.open(message,'',{
      duration: 2000,
      extraClasses:'color:green'
    });
  }
}
