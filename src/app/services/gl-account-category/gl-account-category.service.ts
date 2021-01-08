import { Injectable } from '@angular/core';
import { Observable ,forkJoin} from 'rxjs';



import { GLAccountCategory } from '../../models/gl-account-category.model';
import { GLAccountCategoryEndpointService } from './gl-account-category-endpoint.service';
@Injectable()
export class GLAccountCategoryService {

    constructor(private endpointService: GLAccountCategoryEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.endpointService.getAllItems<GLAccountCategory[]>()
        );
    }

    getById(id: number) {
        return forkJoin(
            this.endpointService.getItemById<GLAccountCategory>(id)
        );
    }

    add(action: any) {
        return forkJoin(
            this.endpointService.addItem<any>(action)
        );
    }

    update(action: any) {
        return forkJoin(
            this.endpointService.updateItem(action, action.glAccountCategoryId)
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