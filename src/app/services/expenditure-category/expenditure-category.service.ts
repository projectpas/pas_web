import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { ExpenditureCategory } from '../../models/expenditure-category.model';
import { ExpenditureCategoryEndpointService } from './expenditure-category-endpoint.service';
@Injectable()
export class ExpenditureCategoryService {

    constructor(private endpointService: ExpenditureCategoryEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.endpointService.getAllItems<ExpenditureCategory[]>()
        );
    }

    getById(id: number) {
        return Observable.forkJoin(
            this.endpointService.getItemById<ExpenditureCategory>(id)
        );
    }

    add(item: ExpenditureCategory) {
        return Observable.forkJoin(
            this.endpointService.addItem<ExpenditureCategory>(item)
        );
    }

    update(item: ExpenditureCategory) {
        return Observable.forkJoin(
            this.endpointService.updateItem<ExpenditureCategory>(item)
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