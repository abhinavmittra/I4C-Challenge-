import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { AppLoginComponent } from './auth/app-login/app-login.component';
import { AppRegisterComponent } from './auth/app-register/app-register.component';
import { DonorComponent } from './donor/donor/donor.component';
import { DonorViewUpdatesComponent } from './donor//donor/donor-view-updates/donor-view-updates.component';
import { DonorViewRequirementsComponent } from './donor/donor/donor-view-requirements/donor-view-requirements.component';
import { DonorCreateItemComponent } from './donor/donor/donor-create-item/donor-create-item.component';
import{DoneeComponent} from './donee/donee.component';
import {DoneeCreateItemComponent} from './donee/donee-create-item/donee-create-item.component';
import {DoneeViewDonationsComponent} from './donee/donee-view-donations/donee-view-donations.component';
import {DoneeViewUpdatesComponent} from './donee/donee-view-updates/donee-view-updates.component';
import { DoneeViewDonationDetailsComponent } from './donee/donee-view-donations/donee-view-donation-details/donee-view-donation-details.component';
import { DonorViewRequirementDetailsComponent } from './donor/donor/donor-view-requirements/donor-view-requirement-details/donor-view-requirement-details.component';
const routes: Routes = [
  {path:'login',component:AppLoginComponent},
  {path:'register',component:AppRegisterComponent},
  {path:'admin',component:AdminComponent},
  {path:'donor',component:DonorComponent,children:
[
  {path:'updates',component:DonorViewUpdatesComponent},
  {path:'requirements',component:DonorViewRequirementsComponent,children:[
    {path:'details',component:DonorViewRequirementDetailsComponent}
  ]},
  {path:'donate',component:DonorCreateItemComponent}
]
},
{path:'donee',component:DoneeComponent,children:[
  {path:'create',component:DoneeCreateItemComponent},
  {path:'requirements',component:DoneeViewUpdatesComponent,children:[
    {path:'details',component:DoneeViewDonationDetailsComponent}
  ]
},
  {path:'allrequirements',component:DoneeViewDonationsComponent}
]},
{path:'',redirectTo:'login',pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
