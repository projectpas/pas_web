
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneralledgerPageComponent } from "./generalledgerpages.component";
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { LegalEntityStructureComponent } from "../components/general-ledger/entity/entity-list/entity-list.component";
import { AccountingCalendarComponent } from "../components/general-ledger/accounting-calendar/accounting-calendar.component";
import { JournalsComponent } from "../components/general-ledger/journals/journals.component";
import { OpenClosePeriodComponent } from "../components/general-ledger/open-close-period/open-close-period.component";
import { AccountReportsComponent } from "../components/general-ledger/account-reports/account-reports.component";
import { AccountSetupComponent } from "../components/general-ledger/account-setup/account-setup.component";
import { ManagementStructureComponent } from '../components/general-ledger/entity/entity-setup/entity-setup.component';
import { EntityEditComponent } from '../components/general-ledger/entity/legal-entity-list/legal-entity-list.component';
import { NodeSetupComponent } from "../components/accounting/general-ledger/node-setup/node-setup.component";
import { GlaccountListComponent } from '../components/general-ledger/glaccount-list/glaccount-list.component';
import { GlaccountCreateComponent } from '../components/general-ledger/glaccount-create/glaccount-create.component';
import { PoRoCategoryComponent } from '../components/general-ledger/po-ro-category/po-ro-category.component';
import { InterCompanySetupComponent } from '../components/general-ledger/intercompany-setup/intercompany-setup.component';
//import { GLAccountCategoryComponent } from '../components/gl-account-categories/gl-account-categories.component';
import { AccountListingComponent } from '../components/general-ledger/account-listing/account-listing.component';
import { AccountListingCreateComponent } from '../components/general-ledger/account-listing-create/account-listing-create.component';
import { AccountingListingCalendarComponent } from '../components/general-ledger/accounting-listing-calendar/accounting-listing-calendar.component';
import { OpenCloseLedgerComponent } from '../components/general-ledger/open-close-ledger/open-close-ledger.component';

import { LegalEntityStepsComponent } from '../components/general-ledger/entity/legal-entity-steps/legal-entity-steps.component';
import { LegalEntityGeneralInformationComponent } from '../components/general-ledger/entity/legal-entity-general-information/legal-entity-general-information.component';

const generalledgerpageRoutes: Routes = [
    {


        path: 'generalledgerpage',
        component: GeneralledgerPageComponent,
        children: [
            { path: "app-legalentity-structure", component: LegalEntityStructureComponent, data: { title: "EntityListComponent" } },
            { path: "app-managemententity-structure", component: ManagementStructureComponent, data: { title: "EntitySetupComponent" } },
            { path: "app-legal-entity-list", component: EntityEditComponent, data: { title: "EntityListComponent" } },
            { path: "legal-entity-general-information", component: LegalEntityGeneralInformationComponent, data: { title: "EntityGeneralComponent" } },
            { path: "app-legal-entity-add", component: LegalEntityStepsComponent, data: { title: "EntityAddComponent" }},
            { path: "app-legal-entity-edit/:id", component: LegalEntityStepsComponent, data: { title: "EntityAddComponent" }},
           
            { path: "app-accounting-calendar", component: AccountingCalendarComponent, data: { title: "AccountingCalendarComponent" } },
            { path: "app-entity-edit-component", component: JournalsComponent, data: { title: "JournalsComponent" } },
            { path: "app-entity-edit-component", component: JournalsComponent, data: { title: "JournalsComponent" } },
            { path: "app-entity-edit-component", component: OpenClosePeriodComponent, data: { title: "OpenClosePeriodComponent" } },
            { path: "app-entity-edit-component", component: AccountReportsComponent, data: { title: "AccountReportsComponent" } },
            { path: "app-entity-edit-component", component: AccountSetupComponent, data: { title: "AccountSetupComponent" } },
            { path: "app-node-setup", component: NodeSetupComponent, data: { title: "NodeSetupComponent" } },
            { path: "app-glaccount-list", component: GlaccountListComponent, data: { title: "GlAccountList" } },
            { path: "app-glaccount-create", component: GlaccountCreateComponent, data: { title: "GlAccountCreate" } },
            { path: "app-po-ro-category", component: PoRoCategoryComponent, data: { title: "POROCategory" } },
            { path: "app-intercompany-setup", component: InterCompanySetupComponent, data: { title: "InterCompanySetup" } },
            { path: "app-account-listing", component: AccountListingComponent, data: { title: "AccountListing" } },
            { path: "app-account-listing-create", component: AccountListingCreateComponent, data: { title: "AccountListingCreate" } },
            { path: "app-account-listing-create/:id", component: AccountListingCreateComponent, data: { title: "AccountListingEdit" } },
            { path: "app-accounting-listing-calendar", component: AccountingListingCalendarComponent, data: { title: "AccountingCalendarList", mode: "listing" } },
            { path: "app-open-close-ledger", component: OpenCloseLedgerComponent, data: { title: "OpenCloseLedger" } }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(generalledgerpageRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class GeneralledgerPageRoutingModule { }