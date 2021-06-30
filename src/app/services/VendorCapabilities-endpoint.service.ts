import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class VendorCapabilitiesEndpoint extends EndpointFactory {




    private readonly _vendorcapabilitiesUrl: string = "/api/VendorCapabilities/Get";
    private readonly _vendorcapabilitiesUrlNew: string = "/api/VendorCapabilities/vendorcapabilitypost";
    private readonly _vendorcapabilitiesUrlAuditHistory: string = "/api/ActionAttribute/auditHistoryById";
    private readonly _auditUrl: string = '/api/VendorCapabilities/audits'
    private readonly _vendorItemMasterAircraftMappedDelete: string = "/api/Vendor/vendorAircrafDelete";
    private readonly _VendorMasterAircraftPostUrlNew: string = "/api/Vendor/VendorAircraftPost";


    get vendorcapabilitiesUrl() { return this.configurations.baseUrl + this._vendorcapabilitiesUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getvendorcapabilitiesEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.vendorcapabilitiesUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getvendorcapabilitiesEndpoint());
            });
    }
    getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._vendorcapabilitiesUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            });
    }

    getEditvendorcapabilitiesEndpoint<T>(VendorCapabilityId?: number): Observable<T> {
        let endpointUrl = VendorCapabilityId ? `${this._vendorcapabilitiesUrlNew}/${VendorCapabilityId}` : this._vendorcapabilitiesUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditvendorcapabilitiesEndpoint(VendorCapabilityId));
            });
    }

    getUpdatevendorcapabilitiesEndpoint<T>(roleObject: any, VendorCapabilityId: number): Observable<T> {
        let endpointUrl = `${this._vendorcapabilitiesUrlNew}/${VendorCapabilityId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdatevendorcapabilitiesEndpoint(roleObject, VendorCapabilityId));
            });
    }

    getDeletevendorcapabilitiesEndpoint<T>(vendorCapabilityId: number): Observable<T> {
        let endpointUrl = `${this._vendorcapabilitiesUrlNew}/${vendorCapabilityId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeletevendorcapabilitiesEndpoint(vendorCapabilityId));
            });
    }
    getHistoryvendorcapabilitiesEndpoint<T>(vendorCapabilityId: number): Observable<T> {
        let endpointUrl = `${this._vendorcapabilitiesUrlAuditHistory}/${vendorCapabilityId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryvendorcapabilitiesEndpoint(vendorCapabilityId));
            });
    }

    getVendorCapabilityAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getVendorCapabilityAuditDetails(Id));
            });
    }

    getVendorCapesById(vendorId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/vendorcapabilities?vendorId=${vendorId}`)
    }

    getVendorCapabilitybyId(vendorCapesId) {
        let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/getVendorCapabilitybyId/${vendorCapesId}`
        return this.http.get<any>(endpointUrl,this.getRequestHeaders()) 
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getVendorCapabilitybyId(vendorCapesId));
        });
    }

    getVendorAircraftGetDataByCapsId(vendorCapesId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/VendorAircraftGetDataByCapsId/${vendorCapesId}`)
              .catch(error => {
                   return this.handleErrorCommon(error, () => this.getVendorAircraftGetDataByCapsId(vendorCapesId));
              });
    }

    searchAirMappedByMultiTypeIDModelIDDashID<T>(vendorCapesId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/searchForGetAirCraftByVendorCapsId/${vendorCapesId}?${searchUrl}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.searchAirMappedByMultiTypeIDModelIDDashID(vendorCapesId, searchUrl));
            });
    }

    deleteAirCraftEndpoint<T>(id: any, updatedBy: any): Observable<T> {
        return this.http.put<T>(`${this._vendorItemMasterAircraftMappedDelete}/?id=${id}&updatedBy=${updatedBy}`, JSON.stringify({}), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteAirCraftEndpoint(id, updatedBy));
            });
    }
    auditHistoryForAircraft(vendorCapabilityAircraftId) {
        let url = `${this.configurations.baseUrl}/api/Vendor/vendorAircraftAuditDataByCapsId?vendorCapabilityAircraftId=${vendorCapabilityAircraftId}`;
        return this.http.get<any>(url, this.getRequestHeaders());
    }

    getNewitemVendorAircraftEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._VendorMasterAircraftPostUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewitemVendorAircraftEndpoint(userObject));
            })
    }
    vendorAircraftupdateMemo(vendorCapabilityAirCraftId, memo, updatedBy) {
        let url = `${this.configurations.baseUrl}/api/vendor/vendorAircraftupdateMemo?id=${vendorCapabilityAirCraftId}&memo=${memo}&updatedBy=${updatedBy}`
        return this.http.put(url, {}, this.getRequestHeaders());

    }
    uploadVendorCapabilitiesList(file) {
        let url = `${this.configurations.baseUrl}/api/vendor/uploadvendorcaps`
        return this.http.post(url, file)
    }
    uploadAircraftInfoFile(vendorId, vendorCapabilityId, file) {
        let url = `${this.configurations.baseUrl}/api/vendor/UploadVendorCapsAircraftCustomData?vendorId=${vendorId}&vendorCapabilityId=${vendorCapabilityId}`;

        return this.http.post(url, file)
    }

}