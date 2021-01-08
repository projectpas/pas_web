import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { AssetType } from '../../models/asset-type.model';
import { AssetTypeEndpointService } from './asset-type-endpoint.service';
@Injectable()
export class AssetTypeService {

    constructor(private endpointService: AssetTypeEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.endpointService.getAllItems<AssetType[]>()
        );
    }

    getAllActive() {
        return forkJoin(
            this.endpointService.getAllItemsActive<AssetType[]>()
        );
    }

    getById(id: number) {
        return forkJoin(
            this.endpointService.getItemById<AssetType>(id)
        );
    }

    add(item: AssetType) {
        return forkJoin(
            this.endpointService.addItem<AssetType>(item)
        );
    }

    update(item: AssetType) {
        return forkJoin(
            this.endpointService.updateItem<AssetType>(item)
        );
    }

    remove(id: number) {
        return forkJoin(
            this.endpointService.removeItemById(id)
        );
    }

    getItemAuditById(id: number) {
        return forkJoin(
            this.endpointService.getItemAudit<any[]>(id)
        );
    }

    bulkUpload(file: any): Observable<object> {
        return this.endpointService.bulkItemUpload(file);
    }
}