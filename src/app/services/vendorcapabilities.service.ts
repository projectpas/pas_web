import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { VendorCapabilitiesEndpoint } from './vendorcapabilities-endpoint.service';
import { VendorCapabilities } from '../models/vendorcapabilities.model';


//import { VendorCapabilitiesEndpoint } from './vendorcapabilities-endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class VendorCapabilitiesService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private vendorCapabilitiesEndpoint: VendorCapabilitiesEndpoint) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.vendorCapabilitiesEndpoint.getvendorcapabilitiesEndpoint<any[]>());
    }

    historyvendorcapabilities(VendorCapabilityId: number) {
        return Observable.forkJoin(this.vendorCapabilitiesEndpoint.getHistoryvendorcapabilitiesEndpoint<any>(VendorCapabilityId));
    }

    newvendorcapabilities(action: any) {
        return this.vendorCapabilitiesEndpoint.getNewGatecodeEndpoint<any>(action);
    }

    getvendorcapabilities(VendorCapabilityId?: number) {
        return this.vendorCapabilitiesEndpoint.getEditvendorcapabilitiesEndpoint<any>(VendorCapabilityId);
    }

    updatevendorcapabilities(action: any) {
        return this.vendorCapabilitiesEndpoint.getUpdatevendorcapabilitiesEndpoint(action, action.vendorCapabilityId);
    }

    deletevendorcapabilities(vendorCapabilityId: number) {

        return this.vendorCapabilitiesEndpoint.getDeletevendorcapabilitiesEndpoint(vendorCapabilityId);

    }



    getVendorCapabilityAuditDetails(Id: number) {
        return this.vendorCapabilitiesEndpoint.getVendorCapabilityAuditDetails<any[]>(Id);
    }

    getVendorCapesById(vendorId) {
        return this.vendorCapabilitiesEndpoint.getVendorCapesById(vendorId);
    }

    getVendorCapabilitybyId(vendorCapesId) {
        return this.vendorCapabilitiesEndpoint.getVendorCapabilitybyId(vendorCapesId);
    }

    getVendorAircraftGetDataByCapsId(vendorCapesId) {
        return this.vendorCapabilitiesEndpoint.getVendorAircraftGetDataByCapsId(vendorCapesId);
    }

    searchAirMappedByMultiTypeIdModelIDDashID(vendorCapesId: number, searchUrl: string) {
        return this.vendorCapabilitiesEndpoint.searchAirMappedByMultiTypeIDModelIDDashID<any>(vendorCapesId, searchUrl);
    }

    newIVendorAircarftClass(action: any) {
        return this.vendorCapabilitiesEndpoint.getNewitemVendorAircraftEndpoint<any>(action);
    }

    deleteAirCraft(ItemMasterAirMappingId: number, updatedBy: string) {
        return this.vendorCapabilitiesEndpoint.deleteAirCraftEndpoint<any>(ItemMasterAirMappingId, updatedBy);
    }
    auditHistoryForAircraft(vendorCapabilityAircraftId) {
        return this.vendorCapabilitiesEndpoint.auditHistoryForAircraft(vendorCapabilityAircraftId);
    }
    vendorAircraftupdateMemo(vendorCapabilityAirCraftId, memo, updatedBy) {
        return this.vendorCapabilitiesEndpoint.vendorAircraftupdateMemo(vendorCapabilityAirCraftId, memo, updatedBy);
    }
    uploadVendorCapabilitiesList(file) {
        return this.vendorCapabilitiesEndpoint.uploadVendorCapabilitiesList(file);
    }
    uploadAircraftInfoFile(fileData) {
        return this.vendorCapabilitiesEndpoint.uploadAircraftInfoFile(fileData.vendorId, fileData.vendorCapabilityId, fileData);
    }
}