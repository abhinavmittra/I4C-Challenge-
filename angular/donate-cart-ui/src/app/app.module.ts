import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLoginComponent } from './auth/app-login/app-login.component';
import { AppRegisterComponent } from './auth/app-register/app-register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin/admin.component';
import { DonorComponent } from './donor/donor/donor.component';
import { DonorViewUpdatesComponent } from './donor//donor/donor-view-updates/donor-view-updates.component';
import { DonorViewRequirementsComponent } from './donor/donor/donor-view-requirements/donor-view-requirements.component';
import { DonorCreateItemComponent } from './donor/donor/donor-create-item/donor-create-item.component';
import { DoneeComponent } from './donee/donee.component';
import { DoneeCreateItemComponent } from './donee/donee-create-item/donee-create-item.component';
import { DoneeViewUpdatesComponent } from './donee/donee-view-updates/donee-view-updates.component';
import { DoneeViewDonationsComponent } from './donee/donee-view-donations/donee-view-donations.component';
import { DoneeViewDonationDetailsComponent } from './donee/donee-view-donations/donee-view-donation-details/donee-view-donation-details.component';
import { DonorViewRequirementDetailsComponent } from './donor/donor/donor-view-requirements/donor-view-requirement-details/donor-view-requirement-details.component';
import { DonorViewRequirementsListComponent } from './donor/donor/donor-view-requirements/donor-view-requirements-list/donor-view-requirements-list.component';
import { DoneeViewDonationListComponent } from './donee/donee-view-donations/donee-view-donation-list/donee-view-donation-list.component';
import { DonorViewUpdateDetailsComponent } from './donor/donor/donor-view-updates/donor-view-update-details/donor-view-update-details.component';
import { DonorViewUpdatesListComponent } from './donor/donor/donor-view-updates/donor-view-updates-list/donor-view-updates-list.component';
import { DoneeViewUpdateDetailsComponent } from './donee/donee-view-updates/donee-view-update-details/donee-view-update-details.component';
import { DoneeViewUpdatesListComponent } from './donee/donee-view-updates/donee-view-update-list/donee-view-updates-list.component';
import { DonorViewNotificationsComponent } from './donor/donor/donor-view-notifications/donor-view-notifications.component';
import { DoneeViewNotificationsComponent } from './donee/donee-view-notifications/donee-view-notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLoginComponent,
    AppRegisterComponent,
    AdminComponent,
    DonorComponent,
    DonorViewUpdatesComponent,
    DonorViewRequirementsComponent,
    DonorCreateItemComponent,
    DoneeComponent,
    DoneeCreateItemComponent,
    DoneeViewUpdatesComponent,
    DoneeViewDonationsComponent,
    DoneeViewDonationDetailsComponent,
    DonorViewRequirementDetailsComponent,
    DonorViewRequirementsListComponent,
    DoneeViewDonationListComponent,
    DonorViewUpdateDetailsComponent,
    DonorViewUpdatesListComponent,
    DoneeViewUpdateDetailsComponent,
    DoneeViewUpdatesListComponent,
    DonorViewNotificationsComponent,
    DoneeViewNotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
