import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetIntangibleType } from '../../models/asset-intangible-type.model';
import { AssetIntangibleTypeEndpointService } from './asset-intangible-type-endpoint.service';
@Injectable()
export class AssetIntangibleTypeService {

    constructor(private endpointService: AssetIntangibleTypeEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<AssetIntangibleType[]>()
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<AssetIntangibleType>(id)
        );
    }

    add(item: AssetIntangibleType) {
        return Observable.forkJoin(
            this.endpointService.addItem<AssetIntangibleType>(item)
        );
    }

    update(item: AssetIntangibleType) {
        return Observable.forkJoin(
            this.endpointService.updateItem<AssetIntangibleType>(item)
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