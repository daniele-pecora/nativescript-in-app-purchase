import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { InAppProductsRoutingModule } from './in-app-products-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { InAppProductsComponent } from './in-app-products.component';


@NgModule({
  declarations: [InAppProductsComponent],
  imports: [
    InAppProductsRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class InAppProductsModule { }
