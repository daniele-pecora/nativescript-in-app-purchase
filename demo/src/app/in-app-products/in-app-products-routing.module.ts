import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { InAppProductsComponent } from './in-app-products.component';


const routes: Routes = [
  { path: "", component: InAppProductsComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class InAppProductsRoutingModule { }
