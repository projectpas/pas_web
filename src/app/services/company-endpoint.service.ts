
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CompanyEndpoint extends EndpointFactory {

    private readonly _getCompany: string = "/api/LegalEntity/get";

    get getCompanyUrl() { return this.configurations.baseUrl + this._getCompany; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getCustomerEndpoint<T>(companyid: number): Observable<T> {

        return this.http.get<T>(this.getCompanyUrl + '/' + companyid, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getCustomerEndpoint(companyid));
            });
    }
    getallCompanyData<T>(): Observable<T> {

        return this.http.get<T>(this.getCompanyUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getallCompanyData());
            });
    }

    postNewShippingAddress<T>(object) {
        let url = `${this.configurations.baseUrl}/api/LegalEntity/createlegalentityshippingaddress`
        return this.http.post<T>(url, JSON.stringify(object), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.postNewShippingAddress(object));
            });
    }
    postNewBillingAddress<T>(object) {
        let url = `${this.configurations.baseUrl}/api/LegalEntity/createlegalentitybillingaddress`
        return this.http.post<T>(url, JSON.stringify(object), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.postNewBillingAddress(object));
            });
    }
    getShippingCompanySiteNames(id) {
        return this.http.get(`${this.configurations.baseUrl}/api/LegalEntity/legalentityshippingsitenames?legalEntityId=${id}`, this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingCompanySiteNames(id));
        });
    }
    getBillingCompanySiteNames(id) {
        return this.http.get(`${this.configurations.baseUrl}/api/LegalEntity/legalentitysitenames?legalEntityId=${id}`, this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getBillingCompanySiteNames(id));
        });
    }
    getShippingAddress(legalEntityaddressId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/LegalEntity/legalentityshippingaddress?addressId=${legalEntityaddressId}`)
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getShippingAddress(legalEntityaddressId));
          });
    }
    getCompanyContacts(legalEntityId) {
        return this.http.get(`${this.configurations.baseUrl}/api/LegalEntity/legalentitycontacts?legalEntityId=${legalEntityId}`)
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getCompanyContacts(legalEntityId));
        });
    }
    getBillingAddress(legalEntityaddressId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/LegalEntity/legalentitybillingaddressbyid?billingAddressId=${legalEntityaddressId}`)
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getBillingAddress(legalEntityaddressId));
        });
    }


}




