
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerPagesComponent } from "./customerpages.component";
import { CustomersListComponent } from "../components/customer/customers-list/customers-list.component";
import { CustomerGeneralInformationComponent } from "../components/customer/customer-general-information/customer-general-information.component";
import { CustomerContactsComponent } from "../components/customer/customer-contacts/customer-contacts.component";
import { CustomerFinancialInformationComponent } from "../components/customer/customer-financial-information/customer-financial-information.component";
import { CustomerBillingInformationComponent } from "../components/customer/customer-billing-information/customer-billing-information.component";
import { CustomerShippingInformationComponent } from "../components/customer/customer-shipping-information/customer-shipping-information-component";
import { CustomerSalesPersonComponent } from "../components/customer/customer-sales-person/customer-sales-person.component";
import { CustomerWarningsComponent } from "../components/customer/customer-warnings/customer-warnings.component";
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { CustomerAircraftComponent } from '../components/customer/customer-aircraft-information/customer-aircraft.component';
import { CustomerATAInformationComponent } from '../components/customer/customer-ata-information/customer-ata.component';
import { CustomerStepsPrimengComponent } from '../components/customer/customer-steps-primeng/customer-steps-primeng.component';

import { CrmCreateComponent } from '../components/crm/crm-create/crm-create.component';
import { DealSetupComponent } from '../components/crm/deal-setup/deal-setup.component';



import {LeadStepsPrimengComponent } from '../components/crm/lead-steps-primeng/lead-steps-primeng.component';


import { OpportunitySetupComponent } from '../components/crm/opportunity-setup/opportunity-setup.component';


import { CrmListComponent } from "../components/crm/crm-list/crm-list.component";

import { DealsListComponent } from "../components/crm/deals-list/deals-list.component";

import { LeadsListComponent } from "../components/crm/leads-list/leads-list.component";

import { OpportunityListComponent } from "../components/crm/opportunity-list/opportunity-list.component";
import { RolesGuardService } from '../services/roles-guard.service';


const customerPagesRoutes: Routes = [
    {
        path: 'customerpages',
        component: CustomerPagesComponent,
        children: [
            { path: 'app-customer-create', component: CustomerStepsPrimengComponent,canActivate:[RolesGuardService] },
            { path: 'app-customer-edit/:id', component: CustomerStepsPrimengComponent },
            { path: "app-customers-list", component: CustomersListComponent, data: { title: "Customer's List" } },
            { path: 'app-crm-create', component: CrmCreateComponent },
            { path: 'app-crm-edit/:id', component: CrmCreateComponent },
            { path: 'app-deal-setup', component: DealSetupComponent },
            { path: 'app-deal-edit/:id', component: DealSetupComponent },

            { path: 'app-lead-create', component: LeadStepsPrimengComponent },
            { path: 'app-lead-edit/:id', component: LeadStepsPrimengComponent },

            
            { path: 'app-opportunity-setup', component: OpportunitySetupComponent },
            { path: "app-crm-list", component: CrmListComponent, data: { title: "CRM List" } },
            { path: "app-deals-list", component: DealsListComponent, data: { title: "Deals List" } },
            { path: "app-leads-list", component: LeadsListComponent, data: { title: "Leads List" } },
            { path: "app-opportunity-list", component: OpportunityListComponent, data: { title: "Opportunity List" } },

        ]
    }
]; 

@NgModule({
    imports: [
        RouterModule.forChild(customerPagesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class CustomerPagesRoutingModule { }