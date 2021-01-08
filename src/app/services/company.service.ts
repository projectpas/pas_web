
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';



import { CompanyEndpoint } from './company-endpoint.service';
import { Company } from '../models/company.model';


@Injectable()
export class CompanyService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private companyEndpoint: CompanyEndpoint) {

    }

    getCompanyById(companyId: number) {
        return forkJoin(
            this.companyEndpoint.getCustomerEndpoint<Company>(companyId));
    }
    getallCompanyData() {
        return forkJoin(
            this.companyEndpoint.getallCompanyData<Company>());
    }

    addNewShippingAddress(object) {
        return this.companyEndpoint.postNewShippingAddress<any>(object);
    }
    addNewBillingAddress(object) {
        return this.companyEndpoint.postNewBillingAddress<any>(object);
    }
    getShippingCompanySiteNames(legalEntityId) {
        return this.companyEndpoint.getShippingCompanySiteNames(legalEntityId);
    }

    getBillingCompanySiteNames(legalEntityId) {
        return this.companyEndpoint.getBillingCompanySiteNames(legalEntityId);
    }
    getShippingAddress(legalEntityAddressId) {        
        return this.companyEndpoint.getShippingAddress(legalEntityAddressId);
    }
    getBillingAddress(legalEntityAddressId) {
        return this.companyEndpoint.getBillingAddress(legalEntityAddressId)
    }
    getCompanyContacts(legalEntityId) {
        return this.companyEndpoint.getCompanyContacts(legalEntityId);
    }
}