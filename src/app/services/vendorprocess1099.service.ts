import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigurationService } from './configuration.service';
import { EndpointFactory } from './endpoint-factory.service';

@Injectable()


// module Types : 
// Customer : 1
// Vendor : 2 
// Company or Legacy : 3 

export class VendorProcess1099Service {
    baseUrl = this.configurations.baseUrl
    constructor(private http: HttpClient, private configurations: ConfigurationService, private authService: EndpointFactory) { }


    getAllVendorProcess1099Endpoint(companyId: number)  {

        return this.http.get<any>(`${this.baseUrl}/api/Vendor/getVendorProcess1099List?companyId=${companyId}`, this.authService.getRequestHeaders())


    }
    getNewVendorProcess1099Endpoint(object) {
        return this.http.post(`${this.baseUrl}/api/Vendor/vendorProcessSave`, JSON.stringify(object), this.authService.getRequestHeaders())
    }
    getStatusVendorProcess1099Endpoint<T>(master1099Id: number, updatedBy: string, isActive: boolean) {
        return this.http.put<any>(`${this.baseUrl}/api/Vendor/vendorProcessStatus?id=${master1099Id}&status=${isActive}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())

    }
    getDeleteVendorProcess1099Endpoint<T>(master1099Id: number, updatedBy: string){

        return this.http.put<any>(`${this.baseUrl}/api/Vendor/vendorProcessDelete?id=${master1099Id}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders());

       
    }
    getAllVendorProcess1099Audit(Master1099Id: number) {
    
        return this.http.get<any>(`${this.baseUrl}/api/Vendor/getVendorProcess1099Audit?id=${Master1099Id}`, this.authService.getRequestHeaders())


    }
   
}