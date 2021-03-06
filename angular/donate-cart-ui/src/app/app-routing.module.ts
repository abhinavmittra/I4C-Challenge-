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
import { DonorViewRequirementsListComponent } from './donor/donor/donor-view-requirements/donor-view-requirements-list/donor-view-requirements-list.component';
import { DoneeViewDonationListComponent } from './donee/donee-view-donations/donee-view-donation-list/donee-view-donation-list.component';
import {AuthGuard} from './auth/auth.guard';
import { DoneeViewUpdateDetailsComponent } from './donee/donee-view-updates/donee-view-update-details/donee-view-update-details.component';
import { DoneeViewUpdatesListComponent } from './donee/donee-view-updates/donee-view-update-list/donee-view-updates-list.component';
import { DonorViewUpdateDetailsComponent } from './donor/donor/donor-view-updates/donor-view-update-details/donor-view-update-details.component';
import { DonorViewUpdatesListComponent } from './donor/donor/donor-view-updates/donor-view-updates-list/donor-view-updates-list.component';
import { DoneeViewNotificationsComponent } from './donee/donee-view-notifications/donee-view-notifications.component';
import { DonorViewNotificationsComponent } from './donor/donor/donor-view-notifications/donor-view-notifications.component';
const routes: Routes = [
  
  {path:'login',component:AppLoginComponent},
  {path:'register',component:AppRegisterComponent},
  {path:'admin',component:AdminComponent,canActivate:[AuthGuard]},
  {path:'donor',component:DonorComponent,children:
[
  {path:'updates',component:DonorViewUpdatesComponent,children:[
    {path:'details/:id',component:DonorViewUpdateDetailsComponent},
    {path:'list',component:DonorViewUpdatesListComponent}
  ]
},
  {path:'requirements',component:DonorViewRequirementsComponent,children:[
    {path:'details/:id',component:DonorViewRequirementDetailsComponent},
    {path:'list',component:DonorViewRequirementsListComponent}
  ]},
  {path:'donate',component:DonorCreateItemComponent},
  {path:'notifications',component:DonorViewNotificationsComponent}
],canActivate:[AuthGuard]
},
{path:'donee',component:DoneeComponent,children:[
  {path:'create',component:DoneeCreateItemComponent},
  {path:'donations',component:DoneeViewDonationsComponent,children:[
    {path:'details/:id',component:DoneeViewDonationDetailsComponent},
    {path:'list',component:DoneeViewDonationListComponent}
  ]
},
  {
    path:'updates',component:DoneeViewUpdatesComponent,children:[
    {path:'details/:id',component:DoneeViewUpdateDetailsComponent},
    {path:'list',component:DoneeViewUpdatesListComponent}
  ]
},
{path:'notifications',component:DoneeViewNotificationsComponent}
], canActivate:[AuthGuard]},
{path:'',redirectTo:'/login',pathMatch:'full'},
{path:'**',redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
