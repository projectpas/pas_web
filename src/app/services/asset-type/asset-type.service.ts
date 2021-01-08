import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetType } from '../../models/asset-type.model';
import { AssetTypeEndpointService } from './asset-type-endpoint.service';
@Injectable()
export class AssetTypeService {

    constructor(private endpointService: AssetTypeEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<AssetType[]>()
        );
    }

    getAllActive() {
        return Observable.forkJoin(
            this.endpointService.getAllItemsActive<AssetType[]>()
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<AssetType>(id)
        );
    }

    add(item: AssetType) {
        return Observable.forkJoin(
            this.endpointService.addItem<AssetType>(item)
        );
    }

    update(item: AssetType) {
        return Observable.forkJoin(
            this.endpointService.updateItem<AssetType>(item)
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