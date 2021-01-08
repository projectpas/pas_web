import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AssetIntangibleAttributeType } from '../../models/asset-intangible-attribute-type.model';
import { AssetIntangibleAttributeTypeEndpointService } from './asset-intangible-attribute-type-endpoint.service';
@Injectable()
export class AssetIntangibleAttributeTypeService {

    constructor(private endpointService: AssetIntangibleAttributeTypeEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<AssetIntangibleAttributeType[]>()
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<AssetIntangibleAttributeType>(id)
        );
    }

    add(item: AssetIntangibleAttributeType) {
        return Observable.forkJoin(
            this.endpointService.addItem<AssetIntangibleAttributeType>(item)
        );
    }

    update(item: AssetIntangibleAttributeType) {
        return Observable.forkJoin(
            this.endpointService.updateItem<AssetIntangibleAttributeType>(item)
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