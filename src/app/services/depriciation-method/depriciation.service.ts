// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DepriciationMethod } from '../../models/depriciation-method.model';
import { DepriciationMethodEndpointService } from './depriciationmethod-endpoint.service';

@Injectable()
export class DepriciationMethodService {

    constructor(private depriciationMethodEndpointService: DepriciationMethodEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.depriciationMethodEndpointService.getAlldepriciationMethod<any>());
    }

    getById(assetDepreciationMethodId: number) {
        return Observable.forkJoin(
            this.depriciationMethodEndpointService.getdepriciationMethodById<DepriciationMethod>(assetDepreciationMethodId)
        );
    }

    add(depriciationMethod: DepriciationMethod) {
        return this.depriciationMethodEndpointService.adddepriciationMethod<DepriciationMethod>(depriciationMethod);
    }

    update(depriciationMethod: DepriciationMethod) {
        return this.depriciationMethodEndpointService.updatedepriciationMethod<DepriciationMethod>(depriciationMethod);
    }

    remove(assetDepreciationMethodId: number) {
        return this.depriciationMethodEndpointService.removedepriciationMethodById(assetDepreciationMethodId);
    }

    getAssetDepriciationMethodAudits(assetDepriciationMethodId: number) {
        return this.depriciationMethodEndpointService.getAssetDepreciationAudits<any[]>(assetDepriciationMethodId);
    }

    DepMethodCustomUpload(file) {
        return this.depriciationMethodEndpointService.DepMethodCustomUpload(file);
    }
}