// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { AssetStatus } from '../../models/asset-status.model';
import { AssetStatusEndpointService } from './assetstatus-endpoint.service';

@Injectable()
export class AssetStatusService {

    constructor(private assetStatusEndpoint: AssetStatusEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.assetStatusEndpoint.getAllAssets<any>());
    }

    getById(assetStatusId: number) {
        return forkJoin(
            this.assetStatusEndpoint.getAssetById<AssetStatus>(assetStatusId)
        );
    }

    add(assetStatus: AssetStatus) {
        return this.assetStatusEndpoint.addAsset<AssetStatus>(assetStatus);
    }

    update(assetStatus: AssetStatus) {
        return this.assetStatusEndpoint.updateAsset<AssetStatus>(assetStatus);
    }

    remove(assetStatusId: number) {     
        return this.assetStatusEndpoint.removeAssetById(assetStatusId);
    }
    updateActive(assetStatus: any) {
        return this.assetStatusEndpoint.getUpdateForActive(assetStatus, assetStatus.id);
    }
    getAssetAudit(assetId:number) {
        return this.assetStatusEndpoint.getAssetStatusAuditById<any[]>(assetId);
    }
    
    AssetStatusCustomUpload(file) {
        return this.assetStatusEndpoint.AssetStatusCustomUpload(file);
    }
}