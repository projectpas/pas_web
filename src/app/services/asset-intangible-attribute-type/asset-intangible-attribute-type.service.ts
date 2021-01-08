import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { AssetIntangibleAttributeType } from '../../models/asset-intangible-attribute-type.model';
import { AssetIntangibleAttributeTypeEndpointService } from './asset-intangible-attribute-type-endpoint.service';
@Injectable()
export class AssetIntangibleAttributeTypeService {

    constructor(private endpointService: AssetIntangibleAttributeTypeEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.endpointService.getAllItems<AssetIntangibleAttributeType[]>()
        );
    }

    getById(id: number) {
        return forkJoin(
            this.endpointService.getItemById<AssetIntangibleAttributeType>(id)
        );
    }

    add(item: AssetIntangibleAttributeType) {
        return forkJoin(
            this.endpointService.addItem<AssetIntangibleAttributeType>(item)
        );
    }

    update(item: AssetIntangibleAttributeType) {
        return forkJoin(
            this.endpointService.updateItem<AssetIntangibleAttributeType>(item)
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