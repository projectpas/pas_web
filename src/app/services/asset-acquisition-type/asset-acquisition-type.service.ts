// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetAcquisitionType } from '../../models/asset-acquisition-type.model';
import { AssetAcquisitionTypeEndpointService } from './asset-acquisition-type-endpoint.service';

@Injectable()
export class AssetAcquisitionTypeService {

    constructor(private AssetAcquisitionTypeEndpoint: AssetAcquisitionTypeEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.AssetAcquisitionTypeEndpoint.getAllAssets<any>());
    }

    getById(AssetAcquisitionTypeId: number) {
        return Observable.forkJoin(
            this.AssetAcquisitionTypeEndpoint.getAssetById<AssetAcquisitionType>(AssetAcquisitionTypeId)
        );
    }

    add(AssetAcquisitionType: AssetAcquisitionType) {
        return this.AssetAcquisitionTypeEndpoint.addAsset<AssetAcquisitionType>(AssetAcquisitionType);
    }

    update(AssetAcquisitionType: AssetAcquisitionType) {
        return this.AssetAcquisitionTypeEndpoint.updateAsset<AssetAcquisitionType>(AssetAcquisitionType);
    }

    remove(AssetAcquisitionTypeId: number) {     
        return this.AssetAcquisitionTypeEndpoint.removeAssetById(AssetAcquisitionTypeId);
    }
    updateActive(AssetAcquisitionType: any) {
        return this.AssetAcquisitionTypeEndpoint.getUpdateForActive(AssetAcquisitionType, AssetAcquisitionType.id);
    }
    getAssetAudit(assetId:number) {
        return this.AssetAcquisitionTypeEndpoint.getAssetAcquisitionTypeAuditById<any[]>(assetId);
    }
    
    AssetAcquisitionTypeCustomUpload(file) {
        return this.AssetAcquisitionTypeEndpoint.AssetAcquisitionTypeCustomUpload(file);
    }
}