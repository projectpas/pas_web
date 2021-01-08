import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { POROCategory } from '../../models/po-ro-category.model';
import { POROCategoryEndpoint } from './po-ro-category-endpoint.service';

@Injectable()
export class POROCategoryService {

    public currentUrl = this.router.url;
    public bredcrumbObj = new Subject<any>();

    constructor(private router: Router, private POROCategoryEndpointService: POROCategoryEndpoint) {
    }

    getAll() {
        return Observable.forkJoin(
            this.POROCategoryEndpointService.getAllPOROCategory<POROCategory[]>());
    }

    getById(poroCategoryId: number) {
        return Observable.forkJoin(
            this.POROCategoryEndpointService.getPOROCategoryById<POROCategory>(poroCategoryId)
        );
    }

    add(POROCategory: POROCategory) {
        return this.POROCategoryEndpointService.addPOROCategory<POROCategory>(POROCategory);
    }

    update(poroCategory) {
        return this.POROCategoryEndpointService.updatePOROCategory<POROCategory>(poroCategory);
    }

    remove(poroCategoryId: number) {
        return this.POROCategoryEndpointService.removePOROCategoryById(poroCategoryId);
    }

    updateActionforActivePORO(poroCategory: any) {
        return this.POROCategoryEndpointService.getUpdatePORPEndpointforActive(poroCategory);
    }

    //getRolesData() {
    //    return Observable.forkJoin(
    //        this.POROCategoryEndpointService.getRolesData<any[]>());
    //}
    //getRolesDataByUserId(event) {
    //    return Observable.forkJoin(
    //        this.POROCategoryEndpointService.getRolesDatayRoleId<any[]>(event));
    //}
    getAudit(poroCategoryId: number) {
        return this.POROCategoryEndpointService.getAudit<any[]>(poroCategoryId);
    }

    getGLCashFlowClassificationFileUpload(file) {
        return this.POROCategoryEndpointService.getGLCashFlowClassificationFileUpload(file);
    }

    search(serverSidePagesData: any) {
        return Observable.forkJoin(
            this.POROCategoryEndpointService.getMaster1099searchEndpoint<any[]>(serverSidePagesData));
    }
}