import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { AppLoginComponent } from './auth/app-login/app-login.component';
import { AppRegisterComponent } from './auth/app-register/app-register.component';

const routes: Routes = [
  {path:'login',component:AppLoginComponent},
  {path:'register',component:AppRegisterComponent},
  {path:'admin',component:AdminComponent},
{path:'',redirectTo:'login',pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
