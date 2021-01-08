import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigurationService } from './configuration.service';
import { EndpointFactory } from './endpoint-factory.service';

@Injectable()


// module Types : 
// Customer : 1
// Vendor : 2 
// Company or Legacy : 3 

export class CapabilityTypeService {
    baseUrl = this.configurations.baseUrl
    constructor(private http: HttpClient, private configurations: ConfigurationService, private authService: EndpointFactory) { }



    getAllCapabilityTypeEndpoint() {

        return this.http.get<any>(`${this.baseUrl}/api/CapabilityType/Get`, this.authService.getRequestHeaders())


    }

    getNewCapabilityTypeEndpoint(object) {
        return this.http.post(`${this.baseUrl}/api/CapabilityType/capabilityTypeSave`, JSON.stringify(object), this.authService.getRequestHeaders())
    }
    getStatusCapabilityTypeEndpoint<T>(id: number, updatedBy: string, isActive: boolean) {
        return this.http.put<any>(`${this.baseUrl}/api/CapabilityType/capabilityTypeStatusUpdate/${id}?status=${isActive}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())

    }

    getDeleteCapabilityTypeEndpoint<T>(id: number, updatedBy: string) {

        return this.http.delete<any>(`${this.baseUrl}/api/CapabilityType/CapabilityTypeDelete/${id}?updatedBy=${updatedBy}`, this.authService.getRequestHeaders());
 

    }


    getAllCapabilityTypeAudit(id: number) {

        return this.http.get<any>(`${this.baseUrl}/api/CapabilityType/CapabilityTypeAuditHistory/${id}`, this.authService.getRequestHeaders())


    }
    
}