
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { Url } from '../app.settings';
import { ItemMasterLoanExchange } from '../models/item-master-loan-exchange.model';
import { environment } from 'src/environments/environment';

@Injectable()

export class ItemMasterEndpoint extends EndpointFactory {
    private readonly _actionsUrl: string = environment.baseUrl + "/api/ItemMaster/Get";
    private readonly _actionsCapsUrl: string = "/api/itemmaster/getitemmastercapes";
    private readonly _aircraftmodelsurl: string = "/api/ItemMaster/GetAircarftmodelsdata";
    private readonly _aircraftmanafacturerurl: string = "/api/ItemMaster/aircraftManufacturerGet";
    private readonly _capesdata: string = "/api/ItemMaster/GetCapesDatawithMasterId";
    private readonly _listUrl: string = "/api/ItemMaster/GetitemList";
    private readonly _stockListUrl: string = "/api/ItemMaster/itemmasterstocklist";
    private readonly _getAllStockListUrl: string = "/api/ItemMaster/getallitemmasterstocklist";
    private readonly _nonStockListUrl: string = "/api/ItemMaster/itemmasternonstocklist";
    private readonly _rolesDataUrl: string = "/api/ItemMaster/GetRolesData";
    private readonly _rolesDataByRoleId: string = "/api/ItemMaster/GetRolesDatayRoleId";
    private readonly _manufUrl: string = "/api/ItemMaster/GetManfacturerDetails";
    private readonly _partUrl: string = "/api/ItemMaster/GetParntnumberlist";
    private readonly _getCountryTypeUrl: string = "/api/ItemMaster/GetCountries";
    private readonly _actionsUrlNew: string = environment.baseUrl + "/api/ItemMaster/itemMasterpost";
    private readonly _itemMasterNonStockpost: string = environment.baseUrl + "/api/ItemMaster/itemMasterNonStockpost";
    private readonly _mancapPost: string = "/api/ItemMaster/Mancapespost";
    private readonly _aircraftmodelsPost: string = "/api/ItemMaster/Aircraftpost";
    private readonly _updateDeleteStatus: string = environment.baseUrl + "/api/ItemMaster/updateDeleteStatus";
    private readonly _updateDeleteStatusNonStock: string = environment.baseUrl + "/api/ItemMaster/updateDeleteStatusNonStock";
    private readonly _manufactureNew: string = "/api/ItemMaster/manufacturerpost";
    private readonly _warnUrlNew: string = "/api/ItemMaster/warning";
    private readonly _getwarningUrl: string = "/api/ItemMaster/getwarning";
    private readonly _actionsUrlAuditHistory: string = "/api/ItemMaster/auditHistoryById";
    private readonly _getAircraftUrl: string = "/api/ItemMaster/Aircraftget";
    private readonly _aircraftTypeUrl: string = "/api/ItemMaster/aircraftTypeGet";
    private readonly _equipUrl: string = "api/ItemMaster/getEquipmentlist";
    private readonly _equipmentNew: string = "api/ItemMaster/equipmentpost";
    private readonly _listNonstockUrl: string = "api/ItemMaster/GetItemnonstocklist";
    private readonly _liststockUrl: string = "api/ItemMaster/GetItemStocklist";
    private readonly _listeqpmntUrl: string = "api/ItemMaster/GetEquipmentlist";
    private readonly _lisUrl: string = "/api/ItemMaster/GetDescriptionbypart";
    private readonly _updateActiveInactiveforstock: string = environment.baseUrl + "/api/ItemMaster/itemstockUpdateforActive";
    private readonly _updateActiveInactiveforNonstock: string = environment.baseUrl + "/api/ItemMaster/itemNonstockUpdateforActive";
    private readonly _stocksUrlNew: string = environment.baseUrl + "/api/ItemMaster/itemMasterpost";
    private readonly _getIntegrationUrl: string = "/api/ItemMaster/IntegrationGet";
    private readonly _getItemGroupListEndPointUrl: string = "/api/Itemgroup/Get/"
    private readonly _ItemMasterAircraftdataUrl: string = "/api/ItemMaster/saveItemmasteraircraftdata";
    private readonly _multiintegrationsdataUrl: string = "/api/ItemMaster/savemultiIntegrations";
    private readonly _multiintegrationurl: string = "/api/ItemMaster/savemultiintegrationTypes";
    private readonly _getCapabilityUrl: string = "/api/ItemMaster/capabilityGet";
    private readonly getAuditById: string = "/api/ItemMaster/audits";
    private readonly getAuditHistoryById: string = "/api/ItemMaster/itemMasterAuditHistoryById";
    private readonly getItemMasterNonStockAuditHistoryById: string = "/api/ItemMaster/itemMasterNonStockAuditHistoryById";
    private readonly _itemclassificationUrlNew: string = "/api/ItemMaster/itemNonStockclasspost";
    private readonly _itemNonstockclassificationGetUrl: string = "/api/ItemMaster/GetNonStockClsiifications";
    //post
    private readonly _itemPNMappingUrlNew: string = "/api/ItemMaster/PNIMMappingPost";
    private readonly _ItemMasterAircraftPostUrlNew: string = environment.baseUrl + "/api/ItemMaster/ItemMasterAircraftPost";
    private readonly _ItemMasterATAPostUrlNew: string = environment.baseUrl +"/api/ItemMaster/ItemMasterATAPost";
    private readonly _ItemMasterATAUpdateUrlNew: string = environment.baseUrl +"/api/ItemMaster/ItemMasterATAUpdate";
    private readonly _ItemMasterPurcSaleUrlNew: string = "/api/ItemMaster/ItemMasterPurcSalePost";
    //get
    private readonly _getAircraftMapped: string = environment.baseUrl + "/api/ItemMaster/getAircraftMapped";
    private readonly _getATAMapped: string = environment.baseUrl + "/api/ItemMaster/getATAMapped";
    private readonly _getExchangeLoan: string = "/api/ItemMaster/exchangeloan";
    private readonly _ItemMasterExportInfoUrlNew: string = environment.baseUrl + "/api/ItemMaster/ExportInfoPostBy_IMastID";
    //update
    private readonly _ItemMasterAircraftUpdate: string = "/api/ItemMaster/ItemMasterAircraftUpdate";
    private readonly _ItemMasterATAUpdate: string = environment.baseUrl + "/api/ItemMaster/ItemMasterAtaUpdate";
    private readonly _ItemMasterPurcSaleUpdate: string = environment.baseUrl + "/api/ItemMaster/ItemMasterPurcSaleUpdate";
    private readonly _getItemAirMappingByMultiTypeIDModelIDDashID: string = '/api/ItemMaster/getItemAirMappedByItemMasterIDMultiTypeIDModelIDDashID';
    private readonly _getItemATAMappingByMultiTypeIDModelIDDashID: string = '/api/ItemMaster/getItemATAMappedByItemMasterIDMultiATAIDATASubID';
    private readonly _ItemMasterATAMappedDelete: string = environment.baseUrl + "/api/ItemMaster/UpdateItemMasterAtaDeleteStatus";
    private readonly _ItemMasterATAMappedRestore: string = environment.baseUrl + "/api/ItemMaster/UpdateItemMasterAtaRestoreStatus";
    private readonly _ItemMasterAircraftMappedDelete: string = environment.baseUrl + "/api/ItemMaster/UpdateItemMasterAircraftDeleteStatus";
    private readonly _ItemMasterAircraftMappedRestore: string = environment.baseUrl + "/api/ItemMaster/UpdateItemMasterAircraftRestoreStatus";
    private readonly _ItemMasterPurcSaleMappedDelete: string = "/api/ItemMaster/UpdateItemMasterPurcSaletDeleteStatus";
    private readonly _searchgetItemAirMappingByMultiTypeIDModelIDDashID: string = environment.baseUrl + '/api/ItemMaster/searchgetItemAirMappedByItemMasterIDMultiTypeIDModelIDDashID';
    private readonly _searchgetItemATAMappingByMultiTypeIDModelIDDashID: string = '/api/ItemMaster/searchGetItemATAMappedByItemMasterIDMultiATAIDATASubID';
    private readonly _advanceSearchGetItemATAMappedByItemMasterIDMultiATAIDATASubID: string = environment.baseUrl + '/api/ItemMaster/advanceSearchGetItemATAMappedByItemMasterIDMultiATAIDATASubID';
    private readonly _getItemMasterDetails: string = '/api/ItemMaster/Get';
    private readonly _getPurcSaleDetails: string = environment.baseUrl + '/api/ItemMaster/getItemMasterPurchSaleByItemMasterID';
    private readonly _getExportInfoDetails: string = environment.baseUrl + '/api/ItemMaster/getItemMasterExportInfoById';
    private readonly _updateItemMasterSerialzed: string = '/api/itemmaster/itemMasterSerialized';
    private readonly _updateItemMasterTimeLife: string = '/api/itemmaster/itemMasterTimeLife';
    private readonly _getPartsDropDown: string = '/api/itemmaster/GetPartDetailsDropDown';
    private readonly _getpartdetailsWithidUrl: string = "/api/ItemMaster/GetpartdetailsWithid";
    private readonly _searchItemMaster: string = "/api/ItemMaster/search";
    private readonly _searchItemMasterfromsoqpop: string = "/api/ItemMaster/searchItemMasterfromsoqpop";
    private readonly _searchPartNumberAdvanced: string = "/api/ItemMaster/searchpartnumberadvancednew";
    private readonly _searchPartNumberUrl: string = "/api/ItemMaster/searchpartnumber";
    private readonly _searchMulitPartNumberUrl: string = "/api/ItemMaster/searchmultipleparts";
    private readonly _multiSearchItemMasterUrl: string = "/api/ItemMaster/multisearch";

    //Vendor Caps Air Craft
    private readonly _VendorMasterAircraftPostUrlNew: string = "/api/Vendor/VendorAircraftPost";
    private readonly _vendorGetAircraftMapped: string = "/api/Vendor/VendorAircraftGetDataByCapsId";
    private readonly _vendorItemMasterAircraftMappedDelete: string = "/api/Vendor/vendorAircrafDelete";

    //NTAE
    private readonly _getalterqquparts: string = "/api/itemmaster/getalterqquparts";
    private readonly _saveNtaeParts: string = "/api/itemmaster/createnhatlaaltequpart";
    private readonly _updateNtaeParts: string = "/api/itemmaster/updatenhatlaaltequpart";
    private readonly _getnhatlaaltequpartlis: string = "/api/itemmaster/nhatlaaltequpartlist";
    private readonly _getequivalencypartlist: string = "/api/itemmaster/equivalencypartlist";
    private readonly _deleteNTAERow: string = "/api/itemmaster/deletenhatlaaltequpart";
    private readonly _restoreNTAERow: string = "/api/itemmaster/restorenhatlaaltequpart";
    private readonly _createequivalencypart: string = "/api/itemmaster/createequivalencypart";
    private readonly _updateequivalencypart: string = "/api/itemmaster/updateequivalencypart";
    private readonly _partManufacturer: string = "/api/ItemMaster/GetParntnumberlistwithManufacturer";
    private readonly _deleteCapabilityRow: string = "/api/itemmaster/deleteitemmastercapes";
    private readonly _restoreCapabilityRow: string = "/api/itemmaster/restoreitemmastercapes";
    private readonly _advanceSearchstockListUrl: string = "/api/itemmaster/advancedItemSearchstocklist";
    private readonly _advanceSearchNonstockListUrl: string = "/api/itemmaster/advancedItemNonstocklist";

    get getItemMasterAircrafPosttUrl() { return this.configurations.baseUrl + this._ItemMasterAircraftPostUrlNew }
    get getAircraftUrl() { return this.configurations.baseUrl + this._getAircraftUrl }
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get actionsUrlCaps() { return this.configurations.baseUrl + this._actionsCapsUrl; }
    get aircraftmodelsurl() { return this.configurations.baseUrl + this._aircraftmodelsurl; }
    get aircraftManafacturerurl() { return this.configurations.baseUrl + this._aircraftmanafacturerurl; }
    get capesdata() { return this.configurations.baseUrl + this._capesdata; }
    get partUrl() { return this.configurations.baseUrl + this._partUrl; }
    get manufUrl() { return this.configurations.baseUrl + this._manufUrl; }
    get getCountryTypeUrl() { return this.configurations.baseUrl + this._getCountryTypeUrl; }
    get getwarningUrl() { return this.configurations.baseUrl + this._getwarningUrl; }
    get getAircraftTypeUrl() { return this.configurations.baseUrl + this._aircraftTypeUrl; }
    get listUrl() { return this.configurations.baseUrl + this._listUrl; }
    get stockListUrl() { return this.configurations.baseUrl + this._stockListUrl; }
    get getAllStockListUrl() { return this.configurations.baseUrl + this._getAllStockListUrl; }
    get nonStockListUrl() { return this.configurations.baseUrl + this._nonStockListUrl; }
    get rolesDataUrl() { return this.configurations.baseUrl + this._rolesDataUrl; }
    get rolesDataByRoleId() { return this.configurations.baseUrl + this._rolesDataByRoleId; }
    get equipUrl() { return this.configurations.baseUrl + this._equipUrl; }
    get listNonstockUrl() { return this.configurations.baseUrl + this._listNonstockUrl; }
    get liststockUrl() { return this.configurations.baseUrl + this._liststockUrl; }
    get listeqpmntUrl() { return this.configurations.baseUrl + this._listeqpmntUrl; }
    get listsUrl() { return this.configurations.baseUrl + this._lisUrl; }
    get getIntegrationUrl() { return this.configurations.baseUrl + this._getIntegrationUrl; }
    get getItemGroupListEndPointUrl() { return this.configurations.baseUrl + this._getItemGroupListEndPointUrl; }
    get getCapabilityUrl() { return this.configurations.baseUrl + this._getCapabilityUrl; }
    get getNonstockList() { return this.configurations.baseUrl + this._itemNonstockclassificationGetUrl; }
    get ItemMasterDetails() { return this.configurations.baseUrl + this._getItemMasterDetails };
    get UpdateItemMasterSerialzedURL() { return this.configurations.baseUrl + this._updateItemMasterSerialzed }
    get UpdateItemMasterTimeLifeURL() { return this.configurations.baseUrl + this._updateItemMasterTimeLife }
    get GetPartsDropDownURL() { return this.configurations.baseUrl + this._getPartsDropDown }
    get getpartdetailsWithidUrl() { return this.configurations.baseUrl + this._getpartdetailsWithidUrl };
    get ExchangeLoanUrl() { return this.configurations.baseUrl + this._getExchangeLoan };
    get getSearchUrl() { return this.configurations.baseUrl + this._searchItemMaster };
    get getSearchItemMasterfromsoqpopUrl() { return this.configurations.baseUrl + this._searchItemMasterfromsoqpop };
    get getSearchPartNumberAdvancedUrl() { return this.configurations.baseUrl + this._searchPartNumberAdvanced };
    get getSearchMulitPartNumberUrl() { return this.configurations.baseUrl + this._searchMulitPartNumberUrl };
    get getMultiSearchUrl() { return this.configurations.baseUrl + this._multiSearchItemMasterUrl };
    get searchPartNumberUrl() { return this.configurations.baseUrl + this._searchPartNumberUrl; }
    get getalterqqupartsUrl() { return this.configurations.baseUrl + this._getalterqquparts; }
    get saveNtaePartsUrl() { return this.configurations.baseUrl + this._saveNtaeParts; }
    get updateNtaePartsUrl() { return this.configurations.baseUrl + this._updateNtaeParts; }
    get getnhatlaaltequpartlisUrl() { return this.configurations.baseUrl + this._getnhatlaaltequpartlis; }
    get getequivalencypartlistUrl() { return this.configurations.baseUrl + this._getequivalencypartlist; }
    get deleteNTAERowUrl() { return this.configurations.baseUrl + this._deleteNTAERow; }
    get restoreNTAERowUrl() { return this.configurations.baseUrl + this._restoreNTAERow; }
    get createequivalencypartUrl() { return this.configurations.baseUrl + this._createequivalencypart; }
    get updateequivalencypartUrl() { return this.configurations.baseUrl + this._updateequivalencypart; }
    get partManufacturerUrl() { return this.configurations.baseUrl + this._partManufacturer; }
    get deleteCapabilityUrl() { return this.configurations.baseUrl + this._deleteCapabilityRow; }
    get restoreCapabilityUrl() { return this.configurations.baseUrl + this._restoreCapabilityRow; }
    get advancedSearchstockListUrl() { return this.configurations.baseUrl + this._advanceSearchstockListUrl; }
    get advancedSearchNonStockListUrl() { return this.configurations.baseUrl + this._advanceSearchNonstockListUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
        super(http, configurations, injector);
    }

    AddItemMasterExchangeLoanEndpoint(currentItem: ItemMasterLoanExchange) {
        let endpointUrl = `${this.ExchangeLoanUrl}`;
        return this.http.post(endpointUrl, JSON.stringify(currentItem), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.AddItemMasterExchangeLoanEndpoint(currentItem));
            });
    }

    getUpdateItemMasterExchangeLoanEndpoint<T>(exchObject: any, itemMasterId: number): Observable<T> {
        let endpointUrl = `${this.ExchangeLoanUrl}/${itemMasterId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(exchObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateItemMasterExchangeLoanEndpoint(exchObject, itemMasterId));
            });
    }
    getItemMasterExchangeLoanEndpointId<T>(id: number): Observable<T> {
        return this.http.get<T>(`${this.ExchangeLoanUrl}/${id}`, this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.getItemMasterExchangeLoanEndpointId(id));
            })
    }

    getItemMasterDetailsById<T>(id: number): Observable<T> {
        return this.http.get<T>(`${this.ItemMasterDetails}/${id}`, this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.getItemMasterDetailsById(id));
            })
    }

    getItemMasterById<T>(id: number): Observable<T> {
        let url = `${this._actionsUrl}/${id}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterById(id));
            });
    }

    getitemMasterEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemMasterEndpoint());
            });
    }

    getitemMasterCapsDataEndpoint<T>(data): Observable<T> {

        return this.http.post<T>(this.actionsUrlCaps, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemMasterCapsDataEndpoint(data));
            });
    }


    getAircraftManafacturerList<T>(itemid: any): Observable<T> {
        let url = `${this.aircraftManafacturerurl}/${itemid}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAircraftManafacturerList(itemid));
            });
    }

    getAircraftmodels<T>(id?): Observable<T> {
        let url = `${this.getAircraftUrl}/${id!==undefined ? id : 1}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAircraftmodels(id));
            });
    }

    getAircraftList<T>(itemid: any): Observable<T> {
        let url = `${this.aircraftmodelsurl}/${itemid}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAircraftList(itemid));
            });
    }

    getCpaesData<T>(itemid: any): Observable<T> {
        let url = `${this.capesdata}/${itemid}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCpaesData(itemid));
            });
    }

    getitemListEndpoint<T>(value): Observable<T> {
        let url = `${this.listUrl}/${value}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemListEndpoint(value));
            });
    }
    getItemStockListEndPoint<T>(data): Observable<T> {
        let url = `${this.stockListUrl}`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemStockListEndPoint(data));
            });
    }

    getAllStockDataforDownload<T>(): Observable<T> {
        let url = `${this.getAllStockListUrl}`;
        return this.http.post<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllStockDataforDownload());
            });
    }

    getItemNonStockListEndPoint<T>(data): Observable<T> {
        let url = `${this.nonStockListUrl}`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemNonStockListEndPoint(data));
            });
    }

    getRolesData<T>(): Observable<T> {
        return this.http.get<T>(this._rolesDataUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getRolesData());
            });
    }
    getRolesDatayRoleId<T>(event): Observable<T> {
        let url = `${this.rolesDataByRoleId}/${event}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getRolesData());
            });
    }

    getStocklist<T>(): Observable<T> {
        return this.http.get<T>(this.liststockUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getStocklist());
            });
    }

    getitemNonstockListEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.listNonstockUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemNonstockListEndpoint());
            });
    }

    getitemStockListEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.liststockUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemStockListEndpoint());
            });
    }

    getitemEquipmentListEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.listeqpmntUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemEquipmentListEndpoint());
            });
    }

    getManufacturerEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.manufUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getManufacturerEndpoint());
            });
    }

    getPartnumbersEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.partUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPartnumbersEndpoint());
            });
    }

    getEquipmentEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.equipUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEquipmentEndpoint());
            });
    }

    getAirccraftTypes<T>(selectedvalues: any): Observable<T> {
        let url = `${this.getAircraftTypeUrl}/${selectedvalues}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemMasterEndpoint());
            });
    }

    updateDeleteStatus<T>(selectedvalues: any): Observable<T> {
        let url = `${this._updateDeleteStatus}/${selectedvalues}`;
        return this.http.put<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateDeleteStatus(selectedvalues));
            });
    }

    updateDeleteStatusNonStock<T>(selectedvalues: any): Observable<T> {
        let url = `${this._updateDeleteStatusNonStock}/${selectedvalues}`;
        return this.http.put<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateDeleteStatusNonStock(selectedvalues));
            });
    }

    getwarningdataEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.getwarningUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getwarningdataEndpoint());
            });
    }

    getCountrysTypes<T>(): Observable<T> {
        return this.http.get<T>(this.getCountryTypeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCountrysTypes());
            });
    }

    getNewitemMasterEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemMasterEndpoint(userObject));
            });
    }

    saveItemMasterNonStock<T>(itemMasterNonStockObject: any): Observable<T> {
        return this.http.post<T>(this._itemMasterNonStockpost, JSON.stringify(itemMasterNonStockObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.saveItemMasterNonStock(itemMasterNonStockObject));
            });
    }

    saveItemmastercapesmaninfo<T>(data: any): Observable<T> {
        return this.http.post<T>(this._mancapPost, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.saveItemmastercapesmaninfo(data));
            });
    }

    saveAircraftinfo<T>(data: any): Observable<T> {
        return this.http.post<T>(this._aircraftmodelsPost, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.saveAircraftinfo(data));
            });
    }

    getNewManufacturerEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._manufactureNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewManufacturerEndpoint(userObject));
            });
    }

    getNewEquipmentEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._equipmentNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewEquipmentEndpoint(userObject));
            });
    }

    getHistoryitemMasterEndpoint<T>(itemMasterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${itemMasterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getHistoryitemMasterEndpoint(itemMasterId));
            });
    }

    getEdititemMasterEndpoint<T>(itemMasterId?: number): Observable<T> {
        let endpointUrl = itemMasterId ? `${this._actionsUrlNew}/${itemMasterId}` : this._actionsUrlNew;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEdititemMasterEndpoint(itemMasterId));
            });
    }

    getUpdateitemMasterEndpoint<T>(roleObject: any, itemMasterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${roleObject.itemMasterId}`;
        let finalobj = {
            'mfgHours': roleObject.mfgHours,
            'turnTimeMfg': roleObject.turnTimeMfg,
            'turnTimeBenchTest': roleObject.turnTimeBenchTest,
            'shelfLifeAvailable': roleObject.shelfLifeAvailable,
            'isOEM': roleObject.isOEM,
            'isPma': roleObject.isPma,
            'isOemPNId': roleObject.isOemPNId,
            'exportCurrencyId': roleObject.exportCurrencyId,
            'aircraftTypeId': roleObject.AircraftTypeId,
            'itemMasterId': roleObject.itemMasterId,
            'isExpirationDateAvailable': roleObject.isExpirationDateAvailable,
            'partId': roleObject.partId,
            'serialNumber': roleObject.serialNumber,
            'updatedBy': roleObject.updatedBy,
            'createdBy': roleObject.createdBy,
            'certifiedBy': roleObject.certifiedBy,
            'tagDate': roleObject.tagDate,
            'partDescription': roleObject.partDescription,
            'shelfLife': roleObject.shelfLife,
            'partAlternatePartId': roleObject.partAlternatePartId,
            'isAlternatePartChecked': roleObject.isAlternatePartChecked,
            'partNumber': roleObject.partNumber,
            'createdDate': roleObject.createdDate,
            'updatedDate': roleObject.updatedDate,
            'departmentId': roleObject.departmentId,
            'divisionId': roleObject.divisionId,
            'businessUnitId': roleObject.businessUnitId,
            'companyId': roleObject.companyId,
            'masterCompanyId': roleObject.masterCompanyId,
            'findings': roleObject.findings,
            'integrateWith': roleObject.integrateWith,
            'toleranceExpected': roleObject.toleranceExpected,
            'toleranceMaximum': roleObject.toleranceMaximum,
            'toleranceMinimum': roleObject.toleranceMinimum,
            'notes': roleObject.notes,
            'leadTime': roleObject.leadTime,
            'stockLevel': roleObject.stockLevel,
            'consumeUOM': roleObject.consumeUOM,
            'storedUOM': roleObject.storedUOM,
            'discounSalesPercent': roleObject.discounSalesPercent,
            'discountPurchasePercent': roleObject.discountPurchasePercent,
            'markUpPercent': roleObject.markUpPercent,
            'currencyId': roleObject.currencyId,
            'isRFQTracking': roleObject.isRFQTracking,
            'priceDate': roleObject.priceDate,
            'listPrice': roleObject.listPrice,
            'schematicDiagramFile': roleObject.schematicDiagramFile,
            'platformId': roleObject.platformId,
            'dateVerified': roleObject.dateVerified,
            'verifiedBy': roleObject.verifiedBy,
            'exchangeDescription': roleObject.exchangeDescription,
            'repairDescription': roleObject.repairDescription,
            'certifiedDescription': roleObject.certifiedDescription,
            'distributeDescription': roleObject.distributeDescription,
            'overhaulDescription': roleObject.overhaulDescription,
            'manufacturingDescription': roleObject.manufacturingDescription,
            'capesMemo': roleObject.capesMemo,
            'isVerified': roleObject.isVerified,
            'cmmLink': roleObject.cmmLink,
            'isCMMExist': roleObject.isCMMExist,
            'entryDate': roleObject.entryDate,
            'isCapesAvailable': roleObject.isCapesAvailable,
            'isProvisioned': roleObject.isProvisioned,
            'isActive': roleObject.isActive,
            'openDate': roleObject.openDate,
            'manufacturingDate': roleObject.manufacturingDate,
            'capabilityVerificationDate': roleObject.capabilityVerificationDate,
            'capabilityVerifiedBy': roleObject.capabilityVerifiedBy,
            'unitCost': roleObject.unitCost,
            'calibrationRequired': roleObject.calibrationRequired,
            'frequencyTypeMonths': roleObject.frequencyTypeMonths,
            'frequencyTypeDays': roleObject.frequencyTypeDays,
            'certificationRequired': roleObject.certificationRequired,
            'certificationFrequency': roleObject.certificationFrequency,
            'equipmentTypeId': roleObject.equipmentTypeId,
            'equipmentValidationTypeId': roleObject.equipmentValidationTypeId,
            'assetId': roleObject.assetId,
            'equipmentId': roleObject.equipmentId,
            'componentEquipment': roleObject.componentEquipment,
            'standAloneEquipment': roleObject.standAloneEquipment,
            'salesLastSalesDiscountPercentDate': roleObject.salesLastSalesDiscountPercentDate,
            'salesLastBaselineSalesPriceDate': roleObject.salesLastBaselineSalesPriceDate,
            'salesLastMakUpPercentOnListPriceAfterDiscDate': roleObject.salesLastMakUpPercentOnListPriceAfterDiscDate,
            'salesLastMarkUpPercentOnListPriceDate': roleObject.salesLastMarkUpPercentOnListPriceDate,
            'salesDiscountPercent': roleObject.salesDiscountPercent,
            'salesBaselineSalesPrice': roleObject.salesBaselineSalesPrice,
            'salesMarkUpOnListPriceAfterDisc': roleObject.salesMarkUpOnListPriceAfterDisc,
            'salesMarkUpOnListPrice': roleObject.salesMarkUpOnListPrice,
            'salesMarkUpOnPurchaseListPriceActive': roleObject.salesMarkUpOnPurchaseListPriceActive,
            'salesLastSalePriceDate': roleObject.salesLastSalePriceDate,
            'salesCurrencyId': roleObject.salesCurrencyId,
            'salesPrice': roleObject.salesPrice,
            'salesIsFixedPrice': roleObject.salesIsFixedPrice,
            'purchaseLastListPriceAfterDiscountDate': roleObject.purchaseLastListPriceAfterDiscountDate,
            'purchaseLastDiscountPercentDate': roleObject.purchaseLastDiscountPercentDate,
            'purchaseLastListPriceDate': roleObject.purchaseLastListPriceDate,
            'purchaseCurrencyId': roleObject.purchaseCurrencyId,
            'purchaseListPriceAfterDiscount': roleObject.purchaseListPriceAfterDiscount,
            'purchaseDiscountOffListPrice': roleObject.purchaseDiscountOffListPrice,
            'purchaseListPrice': roleObject.purchaseListPrice,
            'exportClassificationId': roleObject.exportClassificationId,
            'exportSizeUnit': roleObject.exportSizeUnit,
            'exportSizeHeight': roleObject.exportSizeHeight,
            'exportSizeWidth': roleObject.exportSizeWidth,
            'exportSizeLength': roleObject.exportSizeLength,
            'exportWeightUnit': roleObject.exportWeightUnit,
            'exportWeight': roleObject.exportWeight,
            'exportValue': roleObject.exportValue,
            'exportCountryId': roleObject.exportCountryId,
            'isExportDual': roleObject.IsExportDual,
            'isExportMilitary': roleObject.IsExportMilitary,
            'isExportNONMilitary': roleObject.IsExportNONMilitary,
            'isExportUnspecified': roleObject.IsExportUnspecified,
            'memo': roleObject.memo,
            'warningId': roleObject.warningId,
            'integrationPortalId': roleObject.IntegrationPortalId,
            'priorityId': roleObject.priorityId,
            'soCoreCharge': roleObject.soCoreCharge,
            'poCoreCharge': roleObject.poCoreCharge,
            'partListPrice': roleObject.partListPrice,
            'overheadCost': roleObject.overheadCost,
            'exchangeListPrice': roleObject.exchangeListPrice,
            'coreValue': roleObject.coreValue,
            'isExchangeInfoAvailable': roleObject.isExchangeInfoAvailable,
            'minimumOrderQuantity': roleObject.minimumOrderQuantity,
            'reorderQuantiy': roleObject.reorderQuantiy,
            'reorderPoint': roleObject.reorderPoint,
            'leadTimeHours': roleObject.leadTimeHours,
            'leadTimeDays': roleObject.leadTimeDays,
            'consumeUnitOfMeasureId': roleObject.consumeUnitOfMeasureId,
            'stockUnitOfMeasureId': roleObject.stockUnitOfMeasureId,
            'purchaseUnitOfMeasureId': roleObject.purchaseUnitOfMeasureId,
            'exportUomId': roleObject.exportUomId,
            'glAccountId': roleObject.glAccountId,
            'rfqTracking': roleObject.rfqTracking,
            'cse': roleObject.cse,
            'testHours': roleObject.testHours,
            'rpHours': roleObject.rpHours,
            'overhaulHours': roleObject.overhaulHours,
            'isSchematic': roleObject.isSchematic,
            'nationalStockNumber': roleObject.nationalStockNumber,
            'ataChapterId': roleObject.ataChapterId,
            'ataSubChapterId': roleObject.ataSubChapterId,
            'isDER': roleObject.isDER,
            'pma': roleObject.pma,
            'manufacturerId': roleObject.manufacturerId,

            'activeFlag': roleObject.activeFlag,
            'isShippedDateAvailable': roleObject.isShippedDateAvailable,
            'shippedDays': roleObject.shippedDays,
            'isOtherDateAvailable': roleObject.isOtherDateAvailable,
            'otherDays': roleObject.otherDays,
            'isAcquiredMethodBuy': roleObject.isAcquiredMethodBuy,
            'itemMasterAssetTypeId': roleObject.itemMasterAssetTypeId,
            'hotItem': roleObject.hotItem,
            'isHazardousMaterial': roleObject.isHazardousMaterial,
            'isReceivedDateAvailable': roleObject.isReceivedDateAvailable,
            'itemGroupId': roleObject.itemGroupId,
            'partsCertNum': roleObject.partsCertNum,
            'tagType': roleObject.tagType,
            'daysReceived': roleObject.daysReceived,
            'assetNumber': roleObject.assetNumber,
            'provisionId': roleObject.provisionId,
            'expirationDate': roleObject.expirationDate,
            'itemClassificationId': roleObject.itemClassificationId,

            'isManufacturingDateAvailable': roleObject.isManufacturingDateAvailable,
            'isTagDateAvailable': roleObject.isTagDateAvailable,
            'isOpenDateAvailable': roleObject.isOpenDateAvailable,
            'turnTimeOverhaulHours': roleObject.turnTimeOverhaulHours,
            'turnTimeRepairHours': roleObject.turnTimeRepairHours,
            'Core Value': roleObject.CoreValue,
            'manufacturingDays': roleObject.manufacturingDays,
            'tagDays': roleObject.tagDays,
            'openDays': roleObject.openDays,
            'nha': roleObject.nha,
            'isSerialized': roleObject.isSerialized,
            'soldUnitOfMeasureId': roleObject.soldUnitOfMeasureId,
            'isTimeLife': roleObject.isTimeLife,
            'itemTypeId': roleObject.itemTypeId,
            'revisedPartId': roleObject.revisedPartId,
            'siteId': roleObject.siteId,
            'warehouseId': roleObject.warehouseId,
            'locationId': roleObject.locationId,
            'shelfId': roleObject.shelfId,
            'binId': roleObject.binId,
            'isHotItem': roleObject.isHotItem,
        }

        return this.http.put<T>(endpointUrl, JSON.stringify(finalobj), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateitemMasterEndpoint(roleObject, itemMasterId));
            });
    }

    getUpdateitemMasterNonstockEndpoint<T>(roleObject: any): Observable<T> {
        let endpointUrl = `${this._itemMasterNonStockpost}/${roleObject.itemMasterNonStockId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateitemMasterNonstockEndpoint(roleObject));
            });
    }

    getUpdateitemMasterEquipmentEndpoint<T>(roleObject: any, itemMasterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${roleObject.itemMasterId}`;
        let equipmentobj = {
            'partId': roleObject.partId,
            'updatedBy': roleObject.updatedBy,
            'createdBy': roleObject.createdBy,
            'certifiedBy': roleObject.certifiedBy,
            'tagDate': roleObject.tagDate,
            'partdescription': roleObject.partdescription,
            'partNumber': roleObject.partNumber,
            'createdDate': roleObject.createdDate,
            'updatedDate': roleObject.updatedDate,
            'masterCompanyId': roleObject.masterCompanyId,
            'findings': roleObject.findings,
            'toleranceExpected': roleObject.toleranceExpected,
            'toleranceMaximum': roleObject.toleranceMaximum,
            'toleranceMinimum': roleObject.toleranceMinimum,
            'storedUOM': roleObject.storedUOM,
            'currencyId': roleObject.currencyId,
            'capesMemo': roleObject.capesMemo,
            'unitCost': roleObject.unitCost,
            'calibrationRequired': roleObject.calibrationRequired,
            'certificationRequired': roleObject.certificationRequired,
            'certificationFrequency': roleObject.certificationFrequency,
            'equipmentTypeId': roleObject.equipmentTypeId,
            'equipmentValidationTypeId': roleObject.equipmentValidationTypeId,
            'assetId': roleObject.assetId,
            'equipmentId': roleObject.equipmentId,
            'memo': roleObject.memo,
            'partListPrice': roleObject.partListPrice,
            'isSchematic': roleObject.isSchematic,
            'manufacturerId': roleObject.manufacturerId,
            'aircraftTypeId': roleObject.AircraftTypeId,
            'isAcquiredMethodBuy': roleObject.isAcquiredMethodBuy,
            'assetAcquistionTypeId': roleObject.assetAcquistionTypeId,
            'hotItem': roleObject.hotItem,
            'itemGroupId': roleObject.itemGroupId,
            'partsCertNum': roleObject.partsCertNum,
            'tagType': roleObject.tagType,
            'daysReceived': roleObject.daysReceived,
            'assetNumber': roleObject.assetNumber,
            'provisionId': roleObject.provisionId,
            'expirationDate': roleObject.expirationDate,
            'itemClassificationId': roleObject.itemClassificationId,
            'frequencyTypeMonths': roleObject.frequencyTypeMonths,
            'frequencyTypeDays': roleObject.frequencyTypeDays,
            'equipmentUOMId': roleObject.equipmentUOMId,
            'isManufacturingDateAvailable': roleObject.isManufacturingDateAvailable,
            'isTagDateAvailable': roleObject.isTagDateAvailable,
            'isOpenDateAvailable': roleObject.isOpenDateAvailable,
            'Core Value': roleObject.CoreValue,
            'manufacturingDays': roleObject.manufacturingDays,
            'tagDays': roleObject.tagDays,
            'openDays': roleObject.openDays,
            'isHazardousMaterial': roleObject.isHazardousMaterial,
            'isReceivedDateAvailable': roleObject.isReceivedDateAvailable,
            'isExpirationDateAvailable': roleObject.isExpirationDateAvailable,
            'isSerialized': roleObject.isSerialized,
            'parentPartId': roleObject.parentPartId,
            'standAloneEquipment': roleObject.standAloneEquipment,
            'glAccountId': roleObject.glAccountId
        }

        return this.http.put<T>(endpointUrl, JSON.stringify(equipmentobj), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateitemMasterEquipmentEndpoint(roleObject, itemMasterId));
            });
    }

    getDeleteitemMasterEndpoint<T>(itemMasterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${itemMasterId}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDeleteitemMasterEndpoint(itemMasterId));
            });
    }

    getNewwarningEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._warnUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewwarningEndpoint(userObject));
            });
    }

    getDescriptionbypart<T>(partNumber): Observable<T> {
        let url = `${this.listsUrl}/${partNumber}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDescriptionbypart(partNumber));
            });
    }

    getUpdatestockEndpointforActive<T>(itemmaster: any): Observable<T> {
        let endpointUrl = `${this._updateActiveInactiveforstock}/${itemmaster.itemMasterId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(itemmaster), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdatestockEndpointforActive<T>(itemmaster));
            });
    }

    getUpdateNonstockEndpointforActive<T>(itemmaster: any): Observable<T> {
        let endpointUrl = `${this._updateActiveInactiveforNonstock}/${itemmaster.itemMasterId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(itemmaster), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateNonstockEndpointforActive<T>(itemmaster));
            });
    }

    getUpdatecustomerEndpointforstock<T>(itemmaster: any): Observable<T> {
        let endpointUrl = `${this._stocksUrlNew}/${itemmaster.itemMasterId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(itemmaster), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdatecustomerEndpointforstock(itemmaster));
            });
    }

    getIntegrationEndpoint<T>(ItemMasterId: any): Observable<T> {
        let url = `${this.getIntegrationUrl}/${ItemMasterId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getIntegrationEndpoint(ItemMasterId));
            });
    }

    getItemGroupListEndPoint<T>(): Observable<T> {
        let url = `${this.getItemGroupListEndPointUrl}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemGroupListEndPoint());
            });
    }

    getMultiIntegrations<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._multiintegrationsdataUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getMultiIntegrations(userObject));
            });
    }

    //For Storing Item Master Aircraft Data
    getItemMasteraircrafttypeEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterAircraftdataUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasteraircrafttypeEndpoint(userObject));
            });
    }

    getMultileaves<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._multiintegrationurl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getMultileaves(userObject));
            });
    }

    getCapabilityDataEndpoint<T>(ItemMasterId: any): Observable<T> {
        let url = `${this.getCapabilityUrl}/${ItemMasterId}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCapabilityDataEndpoint(ItemMasterId));
            });
    }

    getAudit<T>(ItemMasterId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${ItemMasterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAudit(ItemMasterId));
            });
    }

    getAuditHistory<T>(ItemMasterId: number): Observable<T> {
        let endpointUrl = `${this.getAuditHistoryById}/${ItemMasterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAuditHistory(ItemMasterId));
            });
    }

    getAuditHistoryNonStock<T>(itemMasterNonStockId: number): Observable<T> {
        let endpointUrl = `${this.getItemMasterNonStockAuditHistoryById}/${itemMasterNonStockId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAuditHistoryNonStock(itemMasterNonStockId));
            });
    }

    getitemclassificationnonStockEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.getNonstockList, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getitemclassificationnonStockEndpoint());
            });
    }

    getNewitemclassificationEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._itemclassificationUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemclassificationEndpoint(userObject));
            });
    }

    getNewitemAircraftEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterAircraftPostUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemAircraftEndpoint(userObject));
            })
    }

    getNewitemATAEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterATAPostUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemATAEndpoint(userObject));
            });
    }

    getNewitemPurcSaleEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterPurcSaleUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemPurcSaleEndpoint(userObject));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._itemclassificationUrlNew}/${actionId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    // get all aircraft models
    getAllAircraftList(): any {
        const getaircraftUrl = `${Url}AircraftManufacturer/getAll`;
        return this.http.get(getaircraftUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllAircraftList());
            });
    }

    getPNIMMappingEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._itemPNMappingUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPNIMMappingEndpoint(userObject));
            });
    }

    getAircraftMappingEndpoint<T>(ItemmasterId: number, deletedStatus): Observable<T> {
        let endpointUrl = `${this._getAircraftMapped}/${ItemmasterId}?isDeleted=${deletedStatus}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAircraftMappingEndpoint(ItemmasterId, deletedStatus));
            });
    }

    getATAMappingEndpoint<T>(ItemmasterId: number, deletedStatus): Observable<T> {
        let endpointUrl = `${this._getATAMapped}/${ItemmasterId}?isDeleted=${deletedStatus}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getATAMappingEndpoint(ItemmasterId, deletedStatus));
            });
    }

    getNewitemExportInfoEndpoint<T>(Object: any): Observable<T> {
        const { ItemMasterId } = Object;
        return this.http.post<T>(`${this._ItemMasterExportInfoUrlNew}/${Object.itemMasterId}`, JSON.stringify(Object), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewitemExportInfoEndpoint(Object));
            });
    }

    updateItemMasterAircraftEndpoint<T>(ItemMasterAircraftMappingId: number,): Observable<T> {
        return this.http.put<T>(this._ItemMasterAircraftUpdate, JSON.stringify(ItemMasterAircraftMappingId), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterAircraftEndpoint(ItemMasterAircraftMappingId));
            });
    }

    updateItemMasterATAEndpoint<T>(ItemMasterATAMappingId: number,): Observable<T> {
        return this.http.put<T>(this._ItemMasterATAUpdate, JSON.stringify(ItemMasterATAMappingId), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterATAEndpoint(ItemMasterATAMappingId));
            });
    }

    updateItemMasterPurchaseSaleEndpoint<T>(ItemMasterPurchaseSaleId: number, data): Observable<T> {
        return this.http.put<T>(`${this._ItemMasterPurcSaleUpdate}/${ItemMasterPurchaseSaleId}`, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterPurchaseSaleEndpoint(ItemMasterPurchaseSaleId, data));
            });
    }

    saveATAMapping<T>(mappedData: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterATAPostUrlNew, JSON.stringify(mappedData), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.saveATAMapping(mappedData));
            })
    }

    updateATAMapping<T>(mappedData: any, ItemMasterATAMappingId): Observable<T> {
        return this.http.put<T>(`${this._ItemMasterATAUpdateUrlNew}/${ItemMasterATAMappingId}`, JSON.stringify(mappedData), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.saveATAMapping(mappedData));
            })
    }

    searchAirMappedByMultiTypeIDModelIDDashID<T>(ItemmasterId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this._searchgetItemAirMappingByMultiTypeIDModelIDDashID}/${ItemmasterId}?${searchUrl}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.searchAirMappedByMultiTypeIDModelIDDashID(ItemmasterId, searchUrl));
            });
    }

    searchATAMappedByMultiATAIDATASUBID<T>(ItemmasterId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this._searchgetItemATAMappingByMultiTypeIDModelIDDashID}/${ItemmasterId}?${searchUrl}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.searchATAMappedByMultiATAIDATASUBID(ItemmasterId, searchUrl));
            });
    }

    searchItemMasterATAMappedByMultiATAIDATASUBID<T>(ItemmasterId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this._advanceSearchGetItemATAMappedByItemMasterIDMultiATAIDATASubID}/${ItemmasterId}?${searchUrl}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.searchItemMasterATAMappedByMultiATAIDATASUBID(ItemmasterId, searchUrl));
            });
    }

    getPurcSaleByItemMasterID<T>(ItemmasterId: number): Observable<T> {
        let endpointUrl = `${this._getPurcSaleDetails}/${ItemmasterId}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPurcSaleByItemMasterID(ItemmasterId));
            });
    }

    getItemMasterExportInfoById<T>(ItemmasterId: number): Observable<T> {
        let endpointUrl = `${this._getExportInfoDetails}/${ItemmasterId}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterExportInfoById(ItemmasterId));
            });
    }

    deleteitemMasterMappedATAEndpoint<T>(id: any): Observable<T> {
        return this.http.post<T>(`${this._ItemMasterATAMappedDelete}/${id}`, JSON.stringify({}), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteitemMasterMappedAirEndpoint(id));
            });
    }

    restoreATAMappedEndpoint<T>(id: any): Observable<T> {
        return this.http.post<T>(`${this._ItemMasterATAMappedRestore}/${id}`, JSON.stringify({}), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.restoreATAMappedEndpoint(id));
            });
    }

    deleteitemMasterMappedAirEndpoint<T>(id: any): Observable<T> {
        return this.http.post<T>(`${this._ItemMasterAircraftMappedDelete}/${id}`, JSON.stringify({}), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteitemMasterMappedAirEndpoint(id));
            });
    }

    restoreAircraftRow<T>(id: any): Observable<T> {
        return this.http.post<T>(`${this._ItemMasterAircraftMappedRestore}/${id}`, JSON.stringify({}), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.restoreAircraftRow(id));
            });
    }


    deleteitemMasterMappedPurcSaleEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._ItemMasterPurcSaleMappedDelete, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteitemMasterMappedPurcSaleEndpoint(userObject));
            });
    }

    updateItemMasterSerialized<T>(itemMasterId: number, active: boolean): Observable<T> {
        let endpointUrl = `${this.UpdateItemMasterSerialzedURL}/${itemMasterId}/${active}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterSerialized<T>(itemMasterId, active));
            });
    }

    updateItemMasterTimeLife<T>(itemMasterId: number, active: boolean): Observable<T> {
        let endpointUrl = `${this.UpdateItemMasterTimeLifeURL}/${itemMasterId}/${active}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterTimeLife<T>(itemMasterId, active));
            });
    }

    getPartDetailsDropdown<T>(): Observable<T> {
        return this.http.get<T>(this.GetPartsDropDownURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPartDetailsDropdown<T>());
            });
    }

    getPartDetailsByid<T>(action: any): Observable<T> {
        return this.http.get<T>(`${this.getpartdetailsWithidUrl}/${action}`, this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.getPartDetailsByid(action));
            });
    }

    searchItemMaster<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(this.getSearchUrl, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.searchItemMaster(searchParameters));
            })
    }

    searchitemmasterfromsoqpop<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(this.getSearchItemMasterfromsoqpopUrl, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.searchItemMaster(searchParameters));
            })
    }
    
    searchMultiPartNumbers<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(this.getSearchMulitPartNumberUrl, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.searchMultiPartNumbers(searchParameters));
            })
    }

    multiSearch<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(this.getMultiSearchUrl, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.multiSearch(searchParameters));
            })
    }

    searchPartNumberAdvanced<T>(searchParameters: any): Observable<T> {
        return this.http.post<T>(this.getSearchPartNumberAdvancedUrl, JSON.stringify(searchParameters), this.getRequestHeaders())
            .catch(err => {
                return this.handleErrorCommon(err, () => this.searchPartNumberAdvanced(searchParameters));
            })
    }

    searchPartNumber<T>(partNumber: string): Observable<T> {
        let url = `${this.searchPartNumberUrl}/${partNumber}`;
        return this.http.get<T>(url, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.searchPartNumber(partNumber));
            });
    }

    getalterqquparts<T>(itemMasterId: number): Observable<T> {
        let endpointUrl = `${this.getalterqqupartsUrl}/?itemMasterId=${itemMasterId}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getalterqquparts(itemMasterId));
            });
    }

    createnhatlaaltequpart<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this.saveNtaePartsUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.createnhatlaaltequpart(userObject));
            })

    }
    updatenhatlaaltequpart<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this.updateNtaePartsUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updatenhatlaaltequpart(userObject));
            })
    }

    getnhatlaaltequpartlis<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this.getnhatlaaltequpartlisUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getnhatlaaltequpartlis(userObject));
            })
    }

    getequivalencypartlist<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this.getequivalencypartlistUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getequivalencypartlist(userObject));
            })
    }

    deleteNTAERow<T>(itemMasterId: number, userId: string): Observable<T> {
        let endpointUrl = `${this.deleteNTAERowUrl}?mappingId=${itemMasterId}&updatedBy=${userId}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteNTAERow(itemMasterId, userId));
            });
    }

    restoreNTAERow<T>(itemMasterId: number, userId: string): Observable<T> {
        let endpointUrl = `${this.restoreNTAERowUrl}?mappingId=${itemMasterId}&updatedBy=${userId}`;
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.restoreNTAERow(itemMasterId, userId));
            });
    }

    // createequivalencypart
    createNTAEFileUploadForEquivalency(file) {
        return this.http.post(`${this.createequivalencypartUrl}`, file)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.createNTAEFileUploadForEquivalency(file));
            });
    }

    // updateequivalencypart
    updateNTAEFileUploadForEquivalency(file) {
        return this.http.post(`${this.updateequivalencypartUrl}`, file)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateNTAEFileUploadForEquivalency(file));
            });
    }

    getPartnumberswithManufacturerEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.partManufacturerUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPartnumberswithManufacturerEndpoint());
            });
    }


    saveItemMasterCapes(data) {
        const url = `${this.configurations.baseUrl}/api/itemMaster/createitemmastercapes`;
        return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.saveItemMasterCapes(data));
            });
    }

    updateItemMasterCapes(capId, data) {
        const url = `${this.configurations.baseUrl}/api/ItemMaster/updateitemmastercapes/${capId}`;
        return this.http.put<any>(url, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterCapes(capId, data));
            });
    }

    //deleteCapabilityById
    deleteCapabilityById<T>(capabilityId: number, user): Observable<T> {
        let endpointUrl = `${this.deleteCapabilityUrl}?itemMasterCapesId=${capabilityId}&updatedBy=${user}`

        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteCapabilityById(capabilityId, user));
            });
    }

    //restoreCapabilityById
    restoreCapabilityById<T>(capabilityId: number, user): Observable<T> {
        let endpointUrl = `${this.restoreCapabilityUrl}?itemMasterCapesId=${capabilityId}&updatedBy=${user}`
        return this.http
            .get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.restoreCapabilityById(capabilityId, user));
            });
    }

    //getItemMasterCapabilityAuditHistory
    getItemMasterCapabilityAuditHistory(capabilityId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/itemmastercapesAudit/${capabilityId}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterCapabilityAuditHistory(capabilityId));
            });
    }

    //getnhatlaaltequparthistory
    getnhatlaaltequparthistory(itemMappingId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/nhatlaaltequparthistory?itemMappingId=${itemMappingId}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getnhatlaaltequparthistory(itemMappingId));
            });
    }

    getItemMasterAircraftAuditHistory(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getItemMasterAircraftMappedAudit?itemMasterAircraftMappingId=${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterAircraftAuditHistory(id));
            });            
    }

    getATAMappedAudit(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getATAMappedAudit/${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getATAMappedAudit(id));
            });
    }

    getItemMasterAltEquiMappingParts(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/itemmaster/getItemMasterAltEquiMappingParts?itemMasterId=${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterAltEquiMappingParts(id));
            });
    }

    updateItemMasterAircraftById(data) {
        const url = `${this.configurations.baseUrl}/api/ItemMaster/itemMasterAircraftUpdate/${data.itemMasterAircraftMappingId}`;
        return this.http.put<any>(url, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItemMasterAircraftById(data));
            });
    }

    getItemMasterNonStockDataById(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/GetNonStockDataById/${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterNonStockDataById(id));
            });
    }

    advancedSerachStockListEndPoint<T>(data): Observable<T> {
        let url = `${this.advancedSearchstockListUrl}`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.advancedSerachStockListEndPoint(data));
            });
    }

    advancedSearchNonStockListEndPoint<T>(data): Observable<T> {
        let url = `${this.advancedSearchNonStockListUrl}`;
        return this.http.post<T>(url, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.advancedSearchNonStockListEndPoint(data));
            });
    }

    deleteItemMasterPurcSaleEndpoint<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/api/ItemMaster/itemmasterpurcsaledelete/${id}?updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteItemMasterPurcSaleEndpoint(id, updatedBy));
            });
    }

    getItemMasterNhaMappingParts(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/itemmaster/GetItemMasterNhaMappingParts?itemMasterId=${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterNhaMappingParts(id));
            });
    }

    getItemMasterTlaMappingParts(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/itemmaster/getItemMasterTlaMappingParts?itemMasterId=${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterTlaMappingParts(id));
            });
    }

    getDataForStocklineByItemMasterId(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getdataforstockline/${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDataForStocklineByItemMasterId(id));
            });
    }

    getItemMasterDataById(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getitemmasterdatabyid/${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterDataById(id));
            });
    }

    getActivePartListByItemType(type) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getactivepartlist/${type}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getActivePartListByItemType(type));
            });
    }

    getItemMasterClassificationByType(type) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/itemmasterclassificationdropdown?type=${type}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterClassificationByType(type));
            });
    }

    getItemMasterMappingPart(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/get-itemmaster-mappingpart/${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemMasterMappingPart(id));
            });
    }
    GetManufacturerByitemMasterId(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ItemMaster/getmanufacturebyitemmasterid?itemMasterId=${id}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.GetManufacturerByitemMasterId(id));
            });
    }
}