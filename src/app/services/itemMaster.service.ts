// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ItemMasterEndpoint } from './itemMaster-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
//import { ItemMaster } from '../models/itemMaster.model';
import { AuditHistory } from '../models/audithistory.model';
import { ItemMasterLoanExchange } from '../models/item-master-loan-exchange.model';

export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export type RolesChangedEventArg = {
    roles: Role[] | string[];
    operation: RolesChangedOperation;
};

@Injectable()
export class ItemMasterService {


    enableExternal: boolean = false;
    listEquipmentCollection: any;
    itemmasterObj: any[];
    listNonStockCollection: any;
    listCollection: any;
    isEditMode: boolean = false;
    listNonstock: boolean;
    listEquipment: boolean;
    listStock: boolean = true;
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";
    public indexObj = new Subject<any>();
    private _rolesChanged = new Subject<RolesChangedEventArg>();
    public currentUrl = this.router.url;
    public alertObj = new Subject<any>();
    public alertChangeObject$ = this.alertObj.asObservable();
    public bredcrumbObj = new Subject<any>();
    public bredcrumbObjChangeObject$ = this.bredcrumbObj.asObservable();
    public stockable = new Subject<any>();
    public stockableObjChangeObject$ = this.stockable.asObservable();
    isCapsEditMode: boolean;
    capabilityCollection: any;
    capsCollection: any;
    ataDeletedStatus:boolean = false;
    airCraftDeletedStatus:boolean = false;

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private itemMasterEndpoint: ItemMasterEndpoint) { }



    getExchangeLoan(itemMasterId: number) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getItemMasterExchangeLoanEndpointId<ItemMasterLoanExchange>(itemMasterId));
    }
    updateExchangeLoan(item: ItemMasterLoanExchange) {
        return this.itemMasterEndpoint.getUpdateItemMasterExchangeLoanEndpoint(item, item.itemMasterId);
    }
    AddExchangeLoan(currentItem: ItemMasterLoanExchange) {
        return this.itemMasterEndpoint.AddItemMasterExchangeLoanEndpoint(currentItem);
    }
    getItemMasterById(id: number) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getItemMasterById<any[]>(id));
    }

    getItemMasterByItemMasterId(id: number) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getItemMasterById<any>(id));
    }

    getItemMasterList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemMasterEndpoint<any[]>());
    }

    getItemMasterCapsList(data) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemMasterCapsDataEndpoint<any[]>(data));
    }

    getAircaftManafacturerList(itemid: any) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getAircraftManafacturerList<any[]>(itemid));
    }

    getAircaftList(itemid: any) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getAircraftList<any[]>(itemid));
    }
    getCpaesData(itemid: any) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getCpaesData<any[]>(itemid));
    }
    getItemStockList(value) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemListEndpoint<any[]>(value));
    }
    getItemMasterStockListData(data){
        return Observable.forkJoin(
            this.itemMasterEndpoint.getItemStockListEndPoint<any[]>(data));
    }

    getAllStockDataforDownload(){
        return Observable.forkJoin(
            this.itemMasterEndpoint.getAllStockDataforDownload<any[]>());
    }

    getItemMasterNonStockListData(data){
        return Observable.forkJoin(
            this.itemMasterEndpoint.getItemNonStockListEndPoint<any[]>(data));
    }
    getRolesData() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getRolesData<any[]>());
    }
    getRolesDataByUserId(event) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getRolesDatayRoleId<any[]>(event));
    }
    getItemstock() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getStocklist<any[]>());
    }


    getItemNonstockList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemNonstockListEndpoint<any[]>());
    }

    updaateEquipmentDelete(action: any) {
        return this.itemMasterEndpoint.updateDeleteStatus(action);
    }

    updateDeleteStatusNonStock(action: any) {
        return this.itemMasterEndpoint.updateDeleteStatusNonStock(action);
    }

    getItemeStockList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemStockListEndpoint<any[]>());
    }

    getItemEquipmentList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemEquipmentListEndpoint<any[]>());
    }

    getManufacturerList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getManufacturerEndpoint<any[]>());
    }

    getPrtnumberslistList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getPartnumbersEndpoint<any>());
    }

    geteuipmentList() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getEquipmentEndpoint<any[]>());
    }


    getAircraft(id?) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getAircraftmodels<any[]>(id));
    }

    getAircraftTypes(selectedvalues) {

        return Observable.forkJoin(
            this.itemMasterEndpoint.getAirccraftTypes<any>(selectedvalues));
    }

    getWarningdata() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getwarningdataEndpoint<any[]>());
    }

    getCountrydata() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getCountrysTypes<any>());
    }
    newItemMaster(itemMaster: any) {
        return this.itemMasterEndpoint.getNewitemMasterEndpoint<any>(itemMaster);
    }
    saveItemMasterNonStock(itemMaster: any) {
        return this.itemMasterEndpoint.saveItemMasterNonStock<any>(itemMaster);
    }
    saveManfacturerinforcapes(data) {
        return this.itemMasterEndpoint.saveItemmastercapesmaninfo<any>(data);
    }
    saveAircraftinfo(data) {
        return this.itemMasterEndpoint.saveAircraftinfo<any>(data);
    }

    savemanufacutrer(itemMaster: any) {
        return this.itemMasterEndpoint.getNewManufacturerEndpoint<any>(itemMaster);
    }

    saveequipment(itemMaster: any) {
        return this.itemMasterEndpoint.getNewEquipmentEndpoint<any>(itemMaster);
    }


    historyItemMaster(itemMasterId: number) {
        return Observable.forkJoin(this.itemMasterEndpoint.getHistoryitemMasterEndpoint<AuditHistory[]>(itemMasterId));
    }

    getItemMaster(itemMasterId?: number) {
        return this.itemMasterEndpoint.getEdititemMasterEndpoint<any>(itemMasterId);
    }

    updateItemMaster(itemMaster: any) {
        return this.itemMasterEndpoint.getUpdateitemMasterEndpoint<any>(itemMaster, itemMaster);
    }

    updateNonStockItemMaster(itemMaster: any) {
        return this.itemMasterEndpoint.getUpdateitemMasterNonstockEndpoint<any>(itemMaster);
    }


    updateEquipment(itemMaster: any) {
        return this.itemMasterEndpoint.getUpdateitemMasterEquipmentEndpoint<any>(itemMaster, itemMaster);
    }

    deleteItemMaster(itemMasterId: number) {

        return this.itemMasterEndpoint.getDeleteitemMasterEndpoint(itemMasterId);

    }
    newWarning(itemMaster: any) {
        return this.itemMasterEndpoint.getNewwarningEndpoint<any>(itemMaster);
    }

    getDescriptionbypart(partNumber) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getDescriptionbypart<any[]>(partNumber));
    }

    updateActionforActiveforstock(itemmaster: any) {
        return this.itemMasterEndpoint.getUpdatestockEndpointforActive(itemmaster);
    }

    updateActionforNonstock(itemmaster: any) {
        return this.itemMasterEndpoint.getUpdateNonstockEndpointforActive(itemmaster);
    }

    getintegrationtypes(itemMasterId: any) {
        return this.itemMasterEndpoint.getIntegrationEndpoint<any[]>(itemMasterId);
    }
    getItemGroupList() {
        return this.itemMasterEndpoint.getItemGroupListEndPoint<any[]>();
    }
    Addmultiintegrations(action: any) {
        return this.itemMasterEndpoint.getMultiIntegrations<any>(action);
    }

    //for Storing Air craft Type,Data
    AddItemMasteraircrafttype(action: any) {
        return this.itemMasterEndpoint.getItemMasteraircrafttypeEndpoint<any>(action);
    }
    Addmultileaves(action: any) {
        return this.itemMasterEndpoint.getMultileaves<any>(action);
    }

    getCapabilityData(itemMasterId?: number) {
        return this.itemMasterEndpoint.getCapabilityDataEndpoint<any>(itemMasterId);
    }

    getAudit(itemMasterId: number) {
        return this.itemMasterEndpoint.getAudit<any[]>(itemMasterId);
    }
    getAuditHistory(itemMasterId: number) {
        return this.itemMasterEndpoint.getAuditHistory<any[]>(itemMasterId);
    }

    getAuditHistoryNonStock(itemMasterNonStockId: number) {
        return this.itemMasterEndpoint.getAuditHistoryNonStock<any[]>(itemMasterNonStockId);
    }

    getAllNonStockitems() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getitemclassificationnonStockEndpoint<any[]>());
    }

    newNonstockClass(action: any) {
        return this.itemMasterEndpoint.getNewitemclassificationEndpoint<any>(action);
    }


    updateNonstockClass(action: any) {
        return this.itemMasterEndpoint.getUpdateActionEndpoint(action, action.itemNonClassificationId);
    }
    // get all aircraft models
    getAllAirCraftModels() {
        return this.itemMasterEndpoint.getAllAircraftList();
    }
    newPNIMMapping(action: any) {
        return this.itemMasterEndpoint.getPNIMMappingEndpoint<any>(action);
    }
    newItemMasterAircarftClass(action: any) {
        return this.itemMasterEndpoint.getNewitemAircraftEndpoint<any>(action);
    }    
    newItemMasterATAClass(action: any) {
        return this.itemMasterEndpoint.getNewitemATAEndpoint<any>(action);
    }
    newItemMasterPurcSaleClass(action: any) {
        return this.itemMasterEndpoint.getNewitemPurcSaleEndpoint<any>(action);
    }
    newItemMasterExportInformation(action: any) {
        return this.itemMasterEndpoint.getNewitemExportInfoEndpoint<any>(action);
    }
    getMappedAirCraftDetails(ItemmasterId: number) {
        return this.itemMasterEndpoint.getAircraftMappingEndpoint<any>(ItemmasterId, this.airCraftDeletedStatus);
    }
    getDeletdMappedAirCraftDetails(ItemmasterId: number, airCraftDeletedStatus: boolean) {
        return this.itemMasterEndpoint.getAircraftMappingEndpoint<any>(ItemmasterId, airCraftDeletedStatus);
    }
    getMappedATADetails(ItemmasterId: number) {
        return this.itemMasterEndpoint.getATAMappingEndpoint<any>(ItemmasterId, this.ataDeletedStatus);
    }
    getDeletedMappedATADetails(ItemmasterId: number, ataDeletedStatus: boolean) {
        return this.itemMasterEndpoint.getATAMappingEndpoint<any>(ItemmasterId, ataDeletedStatus);
    }

    updateItemMasterAircraft(ItemMasterAircraftMappingId: number) {
        return this.itemMasterEndpoint.updateItemMasterAircraftEndpoint<any>(ItemMasterAircraftMappingId);
    }
    updateItemMasterATA(ItemMasterATAMappingId: number) {
        return this.itemMasterEndpoint.updateItemMasterATAEndpoint<any>(ItemMasterATAMappingId);
    }
    updateItemMasterPurchaseSale(ItemMasterPurchaseSaleId: number, data) {
        return this.itemMasterEndpoint.updateItemMasterPurchaseSaleEndpoint<any>(ItemMasterPurchaseSaleId, data);
    }
    postATAMapping(action: any) {
        return this.itemMasterEndpoint.saveATAMapping<any>(action);
    }
    updateATAMapping(action: any, ItemMasterATAMappingId) {
        return this.itemMasterEndpoint.updateATAMapping<any>(action,ItemMasterATAMappingId);
    }
    searchAirMappedByMultiTypeIdModelIDDashID(ItemmasterId: number, searchUrl: string) {
        return this.itemMasterEndpoint.searchAirMappedByMultiTypeIDModelIDDashID<any>(ItemmasterId, searchUrl);
    }
    searchATAMappedByMultiTypeIdModelIDDashID(ItemmasterId: number, searchUrl: string, ) {
        return this.itemMasterEndpoint.searchATAMappedByMultiATAIDATASUBID<any>(ItemmasterId, searchUrl);
    }
    searchItemMasterATAMappedByMultiTypeIdModelIDDashID(ItemmasterId: number, searchUrl: string, ) {
        return this.itemMasterEndpoint.searchItemMasterATAMappedByMultiATAIDATASUBID<any>(ItemmasterId, searchUrl);
    }
    deleteItemMasterATA(ItemMasterATAMappingId: number) {
        return this.itemMasterEndpoint.deleteitemMasterMappedATAEndpoint<any>(ItemMasterATAMappingId);
    }
    restoreATAMapped(ItemMasterATAMappingId: number) {
        return this.itemMasterEndpoint.restoreATAMappedEndpoint<any>(ItemMasterATAMappingId);
    }
    deleteItemMasterAir(ItemMasterAirMappingId: number) {
        return this.itemMasterEndpoint.deleteitemMasterMappedAirEndpoint<any>(ItemMasterAirMappingId);
    }  
    restoreAircraftRow(ItemMasterAirMappingId: number) {
        return this.itemMasterEndpoint.restoreAircraftRow<any>(ItemMasterAirMappingId);
    }    
    deleteItemMasterPurcSale(ItemMasterPurcSaleId: number) {
        return this.itemMasterEndpoint.deleteitemMasterMappedPurcSaleEndpoint<any>(ItemMasterPurcSaleId);
    }
    // searchgetAirMappedByMultiTypeIDModelIDDashID(ItemmasterId: number) {
    //     return this.itemMasterEndpoint.searchGetAirMappedByMultiTypeIDModelIDDashID<any>(ItemmasterId);
    // }
    // searchgetATAMappedByMultiTypeIDModelIDDashID(ItemmasterId: number) {
    //     return this.itemMasterEndpoint.searchgetATAMappedByMultiATAIDATASUBID<any>(ItemmasterId);
    // }
    getItemMasterDetailById(ItemMasterId: number) {
        return this.itemMasterEndpoint.getItemMasterDetailsById<any>(ItemMasterId);
    }
    getPurcSaleDetailById(ItemMasterId: number) {
        return this.itemMasterEndpoint.getPurcSaleByItemMasterID<any>(ItemMasterId);
    }

    getItemMasterExportInfoById(ItemMasterId: number) {
        return this.itemMasterEndpoint.getItemMasterExportInfoById<any>(ItemMasterId);
    }

    updateItemMasterSerialized<T>(itemMasterId: number, active: boolean): Observable<T> {
        return this.itemMasterEndpoint.updateItemMasterSerialized(itemMasterId, active);
    }

    updateItemMasterTimeLife<T>(itemMasterId: number, active: boolean): Observable<T> {
        return this.itemMasterEndpoint.updateItemMasterTimeLife(itemMasterId, active);
    }

    getPartDetailsDropdown<T>() {
        return this.itemMasterEndpoint.getPartDetailsDropdown<any[]>();
    }

    getPartDetailsByid(partListArray: number) {
        return this.itemMasterEndpoint.getPartDetailsByid<any>(partListArray);
    }

    search(searchParameters: any) {
        return this.itemMasterEndpoint.searchItemMaster(searchParameters);
    }
    searchPartNumberAdvanced(searchParameters: any) {
        return this.itemMasterEndpoint.searchPartNumberAdvanced(searchParameters);
    }
    searchitemmasterfromsoqpop(searchParameters: any) {
        return this.itemMasterEndpoint.searchitemmasterfromsoqpop(searchParameters);
    }
    searchMultiPartNumbers(searchParameters: any) {
        return this.itemMasterEndpoint.searchMultiPartNumbers(searchParameters);
    }
    multiSearch(searchParameters: any) {
        return this.itemMasterEndpoint.multiSearch(searchParameters);
    }

    searchPartNumber(partNumber: string) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.searchPartNumber<any[]>(partNumber));
    }

    getalterqquparts(ItemMasterId: number){
        return Observable.forkJoin(
            this.itemMasterEndpoint.getalterqquparts<any>(ItemMasterId));
    }

    createnhatlaaltequpart(data: any) {
        return this.itemMasterEndpoint.createnhatlaaltequpart<any>(data);
    }
    updatenhatlaaltequpart(data: any) {
        return this.itemMasterEndpoint.updatenhatlaaltequpart<any>(data);
    }

    getnhatlaaltequpartlis(data: any) {
        return this.itemMasterEndpoint.getnhatlaaltequpartlis<any>(data);
    }

    deleteNTAERow(ItemMasterId: any, userId: any) {
        return this.itemMasterEndpoint.deleteNTAERow<any>(ItemMasterId,userId);
    }

    restoreNTAERow(ItemMasterId: any, userId: any) {
        return this.itemMasterEndpoint.restoreNTAERow<any>(ItemMasterId,userId);
    }
    
    createNTAEFileUploadForEquivalency(file){
        return this.itemMasterEndpoint.createNTAEFileUploadForEquivalency(file);
    }
    updateNTAEFileUploadForEquivalency(file){
        return this.itemMasterEndpoint.updateNTAEFileUploadForEquivalency(file);
    }

    getequivalencypartlist(data: any) {
        return this.itemMasterEndpoint.getequivalencypartlist<any>(data);
    }
    getPrtnumberslistListwithManufacturer() {
        return Observable.forkJoin(
            this.itemMasterEndpoint.getPartnumberswithManufacturerEndpoint<any>());
    }

    saveItemMasterCapes(data){
        return this.itemMasterEndpoint.saveItemMasterCapes(data)
    }
    updateItemMasterCapes(itemMasterCapId, data){
        return this.itemMasterEndpoint.updateItemMasterCapes(itemMasterCapId, data)
    }
    deleteCapabilityById(capabilityId, user) {
        return this.itemMasterEndpoint.deleteCapabilityById<any>(capabilityId, user);
    }
    restoreCapabilityById(capabilityId, user) {
        return this.itemMasterEndpoint.restoreCapabilityById<any>(capabilityId, user);
    }
    getItemMasterCapabilityAuditHistory(capabilityId){
        return this.itemMasterEndpoint.getItemMasterCapabilityAuditHistory(capabilityId)
    }
    getnhatlaaltequparthistory(itemMappingId){
        return this.itemMasterEndpoint.getnhatlaaltequparthistory(itemMappingId)   
    }

    getItemMasterAircraftAuditHistory(id){
        return this.itemMasterEndpoint.getItemMasterAircraftAuditHistory(id);
    }
    getATAMappedAudit(id){
        return this.itemMasterEndpoint.getATAMappedAudit(id);
    }
    updateItemMasterAircraftById(data) {
        return this.itemMasterEndpoint.updateItemMasterAircraftById(data);
    }
    getItemMasterNonStockDataById(id){
        return this.itemMasterEndpoint.getItemMasterNonStockDataById(id);
    }

    advancedSearchStockListData(data) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.advancedSerachStockListEndPoint<any[]>(data));
    }
    
    advancedSearchNonStockListData(data) {
        return Observable.forkJoin(
            this.itemMasterEndpoint.advancedSearchNonStockListEndPoint<any[]>(data));
    }

    deleteItemMasterPurcSaleRecord(id: number, updatedBy: string) {
        return this.itemMasterEndpoint.deleteItemMasterPurcSaleEndpoint(id, updatedBy);
    }
    getItemMasterAltEquiMappingParts(id) {
        return this.itemMasterEndpoint.getItemMasterAltEquiMappingParts(id);
    }
    getItemMasterNhaMappingParts(id){
        return this.itemMasterEndpoint.getItemMasterNhaMappingParts(id);
    }
    getItemMasterTlaMappingParts(id){
        return this.itemMasterEndpoint.getItemMasterTlaMappingParts(id);
    }
    getDataForStocklineByItemMasterId(id){
        return this.itemMasterEndpoint.getDataForStocklineByItemMasterId(id);
    }
    getItemMasterDataById(id){
        return this.itemMasterEndpoint.getItemMasterDataById(id);
    }
    getActivePartListByItemType(type,masterCompanyId){
        return this.itemMasterEndpoint.getActivePartListByItemType(type,masterCompanyId);
    }
    getItemMasterClassificationByType(type, masterCompanyId){
        return this.itemMasterEndpoint.getItemMasterClassificationByType(type,masterCompanyId);
    }
    getItemMasterMappingPart(id){
        return this.itemMasterEndpoint.getItemMasterMappingPart(id);
    }
    GetManufacturerByitemMasterId(id){
        return this.itemMasterEndpoint.GetManufacturerByitemMasterId(id);
    }
    searchitemmasterfromExchangeQuotepop(searchParameters: any) {
        return this.itemMasterEndpoint.searchitemmasterfromExchangeQuotepop(searchParameters);
    }
    
}