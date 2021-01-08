// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetLocation } from '../../models/asset-location.model';
import { AssetLocationEndpointService } from './asset-location-endpoint.service';

@Injectable()
export class AssetLocationService {

    constructor(private assetLocationEndpoint: AssetLocationEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.assetLocationEndpoint.getAllAssets<any>());
    }

    getDeleted() {
        return Observable.forkJoin(
            this.assetLocationEndpoint.getAllAssets<any>());
    }

    getById(assetLocationId: number) {
        return Observable.forkJoin(
            this.assetLocationEndpoint.getAssetById<AssetLocation>(assetLocationId)
        );
    }

    add(assetLocation: AssetLocation) {
        return this.assetLocationEndpoint.addAsset<AssetLocation>(assetLocation);
    }

    update(assetLocation: AssetLocation) {
        return this.assetLocationEndpoint.updateAsset<AssetLocation>(assetLocation);
    }

    remove(assetLocationId: number) {     
        return this.assetLocationEndpoint.removeAssetById(assetLocationId);
    }
    updateActive(assetLocation: any) {
        return this.assetLocationEndpoint.getUpdateForActive(assetLocation, assetLocation.id);
    }
    getAssetAudit(assetId:number) {
        return this.assetLocationEndpoint.getAssetLocationAuditById<any[]>(assetId);
    }
    
    AssetLocationCustomUpload(file) {
        return this.assetLocationEndpoint.AssetLocationCustomUpload(file);
    }

    getAssetLocationsList() {
        return this.assetLocationEndpoint.getAssetLocationsList();
    }
}