import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { ExpenditureCategory } from '../../models/expenditure-category.model';
import { ExpenditureCategoryEndpointService } from './expenditure-category-endpoint.service';
@Injectable()
export class ExpenditureCategoryService {

    constructor(private endpointService: ExpenditureCategoryEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.endpointService.getAllItems<ExpenditureCategory[]>()
        );
    }

    getById(id: number) {
        return forkJoin(
            this.endpointService.getItemById<ExpenditureCategory>(id)
        );
    }

    add(item: ExpenditureCategory) {
        return forkJoin(
            this.endpointService.addItem<ExpenditureCategory>(item)
        );
    }

    update(item: ExpenditureCategory) {
        return forkJoin(
            this.endpointService.updateItem<ExpenditureCategory>(item)
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