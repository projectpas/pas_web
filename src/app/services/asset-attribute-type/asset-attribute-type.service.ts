import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetAttributeType } from '../../models/asset-attribute-type.model';
import { AssetAttributeTypeEndpointService } from './asset-attribute-type-endpoint.service';
@Injectable()
export class AssetAttributeTypeService {
    listCollection: any;
    constructor(private endpointService: AssetAttributeTypeEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<AssetAttributeType[]>()
        );
    }

    getByAssetTypeId(id: number) {
        return Observable.forkJoin(
            this.endpointService.getByAssetType<AssetAttributeType>(id)
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<AssetAttributeType>(id)
        );
    }

    add(item: AssetAttributeType) {
        return Observable.forkJoin(
            this.endpointService.addItem<AssetAttributeType>(item)
        );
    }

    update(item: AssetAttributeType) {
        return Observable.forkJoin(
            this.endpointService.updateItem<AssetAttributeType>(item)
        );
    }

    remove(id: number) {
        return Observable.forkJoin(
            this.endpointService.removeItemById(id)
        );
    }

    getItemAuditById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemAudit<any[]>(id)
        );
    }

    bulkUpload(file: any): Observable<object> {
        return this.endpointService.bulkItemUpload(file);
    }
}