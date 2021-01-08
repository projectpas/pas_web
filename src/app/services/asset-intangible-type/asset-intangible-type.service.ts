import { Injectable } from '@angular/core';
import { Observable ,forkJoin} from 'rxjs';



import { AssetIntangibleType } from '../../models/asset-intangible-type.model';
import { AssetIntangibleTypeEndpointService } from './asset-intangible-type-endpoint.service';
@Injectable()
export class AssetIntangibleTypeService {

    constructor(private endpointService: AssetIntangibleTypeEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.endpointService.getAllItems<AssetIntangibleType[]>()
        );
    }

    getById(id: number) {
        return forkJoin(
            this.endpointService.getItemById<AssetIntangibleType>(id)
        );
    }

    add(item: AssetIntangibleType) {
        return forkJoin(
            this.endpointService.addItem<AssetIntangibleType>(item)
        );
    }

    update(item: AssetIntangibleType) {
        return forkJoin(
            this.endpointService.updateItem<AssetIntangibleType>(item)
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