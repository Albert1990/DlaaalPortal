/**
 * Created by Hala on 4/10/2018.
 */
import {NgModule} from '@angular/core';
@NgModule({
  imports: [

  ],
  providers: [

  ],
  declarations: [

  ],
  exports: [

  ]
})


export class GUID {
  constructor(){

  }
  newGuid() {
    return Date.now() + '-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
