import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { AssetDepConvention } from '../../models/assetDepConvention.model';
import { AssetDepConventionTypeEndpointService } from './assetDepConventionType-endpoint.service';
@Injectable()
export class AssetDepConventionTypeService {

    constructor(private assetDepConventionTypeEndpointService: AssetDepConventionTypeEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.assetDepConventionTypeEndpointService.getAllAssetDeps<any>());
    }

    getById(assetDepConventionTypeId: number) {
        return forkJoin(
            this.assetDepConventionTypeEndpointService.getAssetDepById<AssetDepConvention>(assetDepConventionTypeId)
        );
    }

     add(assetDepConventionType: AssetDepConvention) {
         return this.assetDepConventionTypeEndpointService.addAssetDep<AssetDepConvention>(assetDepConventionType);
     }

     update(assetDepConventionType: AssetDepConvention) {
         return this.assetDepConventionTypeEndpointService.updateAssetDep<AssetDepConvention>(assetDepConventionType);
     }

    remove(assetDepConventionTypeId: number) {
        return this.assetDepConventionTypeEndpointService.removeAssetDepById(assetDepConventionTypeId);
    }

    getAudit(assetDepConventionTypeId: number) {
        return this.assetDepConventionTypeEndpointService.getDepAudit<any[]>(assetDepConventionTypeId);
    }

    AssetDepConvCustomUpload(file) {
        return this.assetDepConventionTypeEndpointService.AssetDepConvCustomUpload(file);
    }
}