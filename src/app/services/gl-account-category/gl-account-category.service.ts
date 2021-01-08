import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { GLAccountCategory } from '../../models/gl-account-category.model';
import { GLAccountCategoryEndpointService } from './gl-account-category-endpoint.service';
@Injectable()
export class GLAccountCategoryService {

    constructor(private endpointService: GLAccountCategoryEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<GLAccountCategory[]>()
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<GLAccountCategory>(id)
        );
    }

    add(action: any) {
        return Observable.forkJoin(
            this.endpointService.addItem<any>(action)
        );
    }

    update(action: any) {
        return Observable.forkJoin(
            this.endpointService.updateItem(action, action.glAccountCategoryId)
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