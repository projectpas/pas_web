import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigurationService } from './configuration.service';
import { EndpointFactory } from './endpoint-factory.service';

@Injectable()



export class StageCodeService {
    baseUrl = this.configurations.baseUrl
    constructor(private http: HttpClient, private configurations: ConfigurationService, private authService: EndpointFactory) { }


    getWorkOrderStageList() {
        return this.http.get<any>(`${this.baseUrl}/api/workOrderStage/workorderstagelist`, this.authService.getRequestHeaders())

    }
    createWorkOrderStageCode(object) {
        return this.http.post<any>(`${this.baseUrl}/api/workOrderStage/createworkorderstage`, JSON.stringify(object), this.authService.getRequestHeaders())
    }
    updateWorkOrderStageCode(object) {
        return this.http.post<any>(`${this.baseUrl}/api/workOrderStage/updateworkorderstage`, JSON.stringify(object), this.authService.getRequestHeaders())
    }
    updateWorkOrderStageCodeStatus(workOrderStageId, status, updatedBy) {
        return this.http.get<any>(`${this.baseUrl}/api/workOrderStage/updateworkorderstagestatus?workOrderStageId=${workOrderStageId}&status=${status}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())
    }
    deleteWorkOrderStageCode(workOrderStageId, updatedBy) {
        return this.http.get<any>(`${this.baseUrl}/api/workOrderStage/deleteworkorderstage?workOrderStageId=${workOrderStageId}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())

    }

}
