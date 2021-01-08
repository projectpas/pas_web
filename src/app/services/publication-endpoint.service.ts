import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-Keys';
import {catchError} from 'rxjs/operators';
@Injectable()
export class PublicationEndpointService extends EndpointFactory {
  private readonly _publicationGetUrl: string = '/api/Publication/getpublicationslist';
  private readonly _publicationGetUrlNew: string = '/api/Publication/getpublicationslistnew';
  private readonly _publicationGetByIdUrl: string = '/api/Publication/GetPublicationByID';

  private readonly _publicationUrlNew: string =
    '/api/Publication/publicationpost';
  private readonly _actionsUrlAuditHistory: string =
    '/api/Publication/auditHistoryById';
  private readonly getPublicationAuditById: string = '/api/Publication/audits';

  private readonly _publicationPNACNEW: string =
    '/api/Publication/PubPNACMappingPost';
  private readonly _publicationPNATANEW: string =
    '/api/Publication/PubPNATAMappingPost';
  private readonly _PostPNMapping: string = '/api/Publication/PNIMMappingPost';
  private readonly _getAirMappingByPublicationID: string =
    '/api/Publication/getItemAircraftMappedByPublcationID';
  private readonly _getAtaMappingByPublicationID: string =
    '/api/Publication/getItemAtaMappedByPublcationID';
  private readonly _getAirMappingByMultiTypeID: string =
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeID';
  private readonly _getAirMappingByMultiModelID: string =
    '/api/Publication/getItemAirMappedByPublicationIdMultiModelID';
  private readonly _getAirMappingByMultiDashID: string =
    '/api/Publication/getItemAirMappedByPublicationIdMultiDashID';
  private readonly _getAirMappingByMultiTypeIDModelID: string =
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeIDModelID';
  private readonly _getAirMappingByMultiTypeIDModelIDDashID: string =
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _getATAMappingByMultiChapterIDSubID: string =
    '/api/Publication/getItemATAMappedByPublicationIdMultiATAIDSubChapterID';
  private readonly _deleteItemMasterMappingByID: string =
    '/api/Publication/deletePublicationItemMasterMapping';
  private readonly _deletepublicationtagtypeEndPoint: string =
    '/api/Publication/deletepublicationtagtype';
  private readonly _getATAMappingByMultiChapterID: string =
    '/api/Publication/getItemATAMappedByPublicationIdMultiChapterID';
  private readonly _getATAMappingByMultiSubChapterID: string =
    '/api/Publication/getItemATAMappedByPublicationIdMultiSubChapterID';
  private readonly _getFilesBypublication: string =
        '/api/Publication/getFilesBypublication';
    private readonly _getFilesBypublicationNew: string =
        '/api/Publication/getfiledetailsbypublicationNew';

  private readonly _getPublishedByModuleListEndPointUrl: string = '/api/Publication/publishedbymodulelist';
  private readonly _publicationPNMappingData: string =
    '/api/Publication/GetPubPNMappedDataByPublicationRecordIds';
  private readonly _AircraftInformationSearch: string =
    '/api/Publication/searchGetItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _searchgetAirMappingByMultiTypeIDModelIDDashID: string =
    '/api/Publication/searchGetItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _searchgetATAMappingByMultiChapterIDSubID: string =
    '/api/Publication/searchGetItemATAMappedByPublicationIdMultiATAIDSubChapterID';

  private readonly _publicationStatus: string =
    '/api/Publication/publicationstatus';
  private readonly _publicationGetByIdViewUrl: string = '/api/Publication/publicationview';
  private readonly _publicationGlobalSearchUrl: string = '/api/Publication/publicationsglobalsearch';
  private readonly _getpublicationslistadvancesearchUrl: string = '/api/Publication/getpublicationslistadvancesearch';
  private readonly _publicationTypes: string = '/api/Publication/getpublicationtypes';
  private readonly _publicationForWorkflowURL: string = '/api/Publication/GetPublicationDropdownData';
  private readonly _publicationURL: string = '/api/Publication/getPublicationForWorkFlowById';
  private readonly _excelUpload: string = "/api/Publication/uploadpublicationcustomdata";
  private readonly _auditsUrl: string = "/api/Publication/publicationhistory";


  get getCodeUrl() {
    return this.configurations.baseUrl + this._publicationGetUrl;
  }

  get getPublicationsListUrl() {
    return this.configurations.baseUrl + this._publicationGetUrlNew;
  }

  get getPublicationForWorkFlowURL() {
    return this.configurations.baseUrl + this._publicationForWorkflowURL;
  }

  get getPublicationURL() {
    return this.configurations.baseUrl + this._publicationURL;
  }


  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getpublicationEndpoint<T>(): Observable<T> {
    return this.http
      .get<any>(this.getCodeUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationEndpoint());
      }));
  }
  getpublicationbyIdEndpoint<T>(id): Observable<T> {
    return this.http
      .get<any>(`${this._publicationGetByIdUrl}/${id}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationbyIdEndpoint(id));
      }));
  }



  getNewpublicationEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http
      .post<T>(`${this._publicationUrlNew}`, file)


    // return this.http
    //   .post<T>(
    //     this._publicationUrlNew,
    //     JSON.stringify(userObject),
    //     this.getRequestHeaders()
    //   )
    //   .catch(error => {
    //     return this.handleError(error, () =>
    //       this.getNewpublicationEndpoint(userObject)
    //     );
    //   });
  }

  getEditActionEndpoint<T>(actionId?: number): Observable<T> {
    let endpointUrl = actionId
      ? `${this._publicationUrlNew}/${actionId}`
      : this._publicationUrlNew;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getEditActionEndpoint(actionId)
        );
      }));
  }

  getUpdateActionEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let endpointUrl = `${this._publicationUrlNew}`;

    return this.http
      .put<any>(endpointUrl, file)
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getUpdateActionEndpoint(file)
        );
      }));
  }

  getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
    let endpointUrl = `${this._publicationUrlNew}/${actionId}`;

    return this.http
      .delete<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getDeleteActionEndpoint(actionId)
        );
      }));
  }

  publicationStatusEndpoint<T>(id, status, updatedBy): Observable<T> {
    return this.http
      .get<any>(`${this._publicationStatus}?publicationRecordId=${id}&status=${status}&updatedBy=${updatedBy}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.publicationStatusEndpoint(id, status, updatedBy));
      }));
  }


  getHistoryActionEndpoin<T>(actionId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getHistoryActionEndpoin(actionId)
        );
      }));
  }

  getPublincationAuditById<T>(publicationId: number): Observable<T> {
    let endpointUrl = `${this.getPublicationAuditById}/${publicationId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getPublincationAuditById(publicationId)
        );
      }));
  }

  postPNACMapping<T>(userObject: any): Observable<T> {
    return this.http
      .post<any>(
        this._publicationPNACNEW,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.postPNACMapping(userObject));
      }));
  }
  postPNATAMapping<T>(userObject: any): Observable<T> {
    return this.http
      .post<any>(
        this._publicationPNATANEW,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () => this.postPNATAMapping(userObject));
      }));
  }

  getPubPNById<T>(PNid: number): Observable<T> {
    let endpointUrl = `${this._publicationPNMappingData}/${PNid}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getPubPNById(PNid));
      }));
  }

  // Save Part Number Mapping
  postPartNumberMappedData<T>(object): Observable<T> {
    return this.http
      .post<any>(
        this._PostPNMapping,
        JSON.stringify(object),
        this.getRequestHeaders()
      )
      .pipe(catchError(err => {
        return this.handleError(err, () =>
          this.postPartNumberMappedData(object)
        );
      }));
  }

  getAircraftInformationBySearch<T>(searchUrl, publicationId): Observable<T> {
    console.log(searchUrl);
    return this.http
      .get<any>(
        `${this._AircraftInformationSearch}/${publicationId}?${searchUrl}`
      )
      .pipe(catchError(err => {
        return this.handleError(err, () =>
          this.getAircraftInformationBySearch(searchUrl, publicationId)
        );
      }));
  }

  getAirMappedByPubId<T>(PublicationID: number): Observable<T> {
    let endpointUrl = `${this._getAirMappingByPublicationID}/${PublicationID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAirMappedByPubId(PublicationID)
        );
      }));
  }
  getAtaMappedByPubId<T>(PublicationID: number): Observable<T> {
    let endpointUrl = `${this._getAtaMappingByPublicationID}/${PublicationID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByPubId(PublicationID)
        );
      }));
  }
  getAirMappedByMultiTypeId<T>(
    PublicationID: number,
    AircraftTypeId: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getAirMappingByMultiTypeID
      }/${PublicationID}${AircraftTypeId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAirMappedByMultiTypeId(PublicationID, AircraftTypeId)
        );
      }));
  }
  getAtaMappedByMultiModelId<T>(
    PublicationID: number,
    AircraftModelID: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getAirMappingByMultiModelID
      }/${PublicationID}${AircraftModelID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiModelId(PublicationID, AircraftModelID)
        );
      }));
  }
  getAtaMappedByMultiDashId<T>(
    PublicationID: number,
    DashNumberId: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getAirMappingByMultiDashID
      }/${PublicationID}${DashNumberId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiDashId(PublicationID, DashNumberId)
        );
      }));
  }
  getAtaMappedByMultiTypeIDModelID<T>(
    PublicationID: number,
    AircraftTypeId: string,
    AircraftModelID: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getAirMappingByMultiTypeIDModelID
      }/${PublicationID}${AircraftTypeId}/${AircraftModelID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiTypeIDModelID(
            PublicationID,
            AircraftTypeId,
            AircraftModelID
          )
        );
      }));
  }
  getAtaMappedByMultiTypeIDModelIDDashID<T>(
    PublicationID: number,
    AircraftTypeId: string,
    AircraftModelID: string,
    DashNumberId: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getAirMappingByMultiTypeIDModelIDDashID
      }/${PublicationID}${AircraftTypeId}/${AircraftModelID}/${DashNumberId}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiTypeIDModelIDDashID(
            PublicationID,
            AircraftTypeId,
            AircraftModelID,
            DashNumberId
          )
        );
      }));
  }

  getAtaMappedByMultiATAIDSubChapterID<T>(
    PublicationID: number,
    ChapterID: string,
    SubChapterID
  ): Observable<T> {
    let endpointUrl = `${
      this._getATAMappingByMultiChapterIDSubID
      }/${PublicationID}/${ChapterID}/${SubChapterID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiATAIDSubChapterID(
            PublicationID,
            ChapterID,
            SubChapterID
          )
        );
      }));
  }
  getAtaMappedByMultiChapterID<T>(
    PublicationID: number,
    ChapterID: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getATAMappingByMultiChapterID
      }/${PublicationID}/${ChapterID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiChapterID(PublicationID, ChapterID)
        );
      }));
  }
  getAtaMappedByMultiSubChapterID<T>(
    PublicationID: number,
    SubChapterID: string
  ): Observable<T> {
    let endpointUrl = `${
      this._getATAMappingByMultiSubChapterID
      }/${PublicationID}/${SubChapterID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getAtaMappedByMultiSubChapterID(PublicationID, SubChapterID)
        );
      }));
  }
  // http://localhost:5050/api/Publication/getFilesBypublication/4(PublicationId)
  getFilesBypublicationEndPoint<T>(
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${
      this._getFilesBypublication
      }/${PublicationID}`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getFilesBypublicationEndPoint(PublicationID)
        );
      }));
    }

    getFilesBypublicationEndPointNew<T>(
        PublicationID: number
    ): Observable<T> {
        let endpointUrl = `${
            this._getFilesBypublicationNew
            }/${PublicationID}`;

        return this.http
            .get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () =>
                    this.getFilesBypublicationEndPointNew(PublicationID)
                );
            }));
    }

  getPublishedByModuleListEndPoint<T>() {
    let endpointUrl = `${
      this._getPublishedByModuleListEndPointUrl
      }`;

    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.getPublishedByModuleListEndPoint()
        );
      }));
  }


  deleteitemMasterMappedEndpoint<T>(PublicationItemMasterMappingId: any): Observable<T> {
    return this.http
      .post<any>(
        `${this._deleteItemMasterMappingByID}/${PublicationItemMasterMappingId}`,
        //JSON.stringify(userObject),
        {},
        this.getRequestHeaders()
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.deleteitemMasterMappedEndpoint(PublicationItemMasterMappingId)
        );
      }));
  }

  deletepublicationtagtypeEndPoint<T>(tagTypeId: any): Observable<T> {
    return this.http
      .delete<any>(
        `${this._deletepublicationtagtypeEndPoint}/${tagTypeId}?updatedBy=` + DBkeys.UPDATED_BY,
        //JSON.stringify(userObject),
        {},
      )
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.deletepublicationtagtypeEndPoint(tagTypeId)
        );
      }));
  }

  searchgetAirMappedByMultiTypeIDModelIDDashID<T>(
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${
      this._searchgetAirMappingByMultiTypeIDModelIDDashID
      }/${PublicationID}`;
    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.searchgetAirMappedByMultiTypeIDModelIDDashID(PublicationID)
        );
      }));
  }
  searchgetAtaMappedByMultiSubChapterID<T>(
    searchUrl: string,
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${
      this._searchgetATAMappingByMultiChapterIDSubID
      }/${PublicationID}?${searchUrl}`;
    return this.http
      .get<any>(endpointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () =>
          this.searchgetAtaMappedByMultiSubChapterID(searchUrl, PublicationID)
        );
      }));
  }

  getpublicationbyIdViewEndpoint<T>(id): Observable<T> {
    return this.http
      .get<any>(`${this._publicationGetByIdViewUrl}/${id}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationbyIdViewEndpoint(id));
      }));
  }

  getpublicationListEndpoint<T>(data): Observable<T> {
    return this.http.post<any>(this.getCodeUrl, JSON.stringify(data), this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationListEndpoint(data));
      }));
  }
  getpublicationListEndpointNew<T>(data): Observable<T> {
    return this.http.post<any>(this.getPublicationsListUrl, JSON.stringify(data), this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationListEndpointNew(data));
      }));
  }

  getpublicationGlobalSearchEndpoint<T>(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize): Observable<T> {
    return this.http
      .get<any>(`${this._publicationGlobalSearchUrl}/?ataChapterId=${ataChapterId}&ataSubChapterId=${ataSubChapterId}&airCraftId=${airCraftId}&modelId=${modelId}&dashNumberId=${dashNumberId}&pageNumber=${pageNumber}&pageSize=${pageSize}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationGlobalSearchEndpoint(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize));
      }));
  }

  getpublicationslistadvancesearchEndPoint<T>(data): Observable<T> {
    return this.http
      .post<any>(this._getpublicationslistadvancesearchUrl, data, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationslistadvancesearchEndPoint(data));
      }));
  }

  getpublicationTypesEndpoint<T>(): Observable<T> {
    return this.http
      .get<any>(`${this._publicationTypes}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationTypesEndpoint());
      }));
  }

  getAllPublicationsDropdownEndPoint<T>(): Observable<T> {
    return this.http
      .get<any>(this.getPublicationForWorkFlowURL, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getAllPublicationsDropdownEndPoint());
      }));
  }

  getPublicationForWorkFlowEndpoint<T>(publicationId: number): Observable<T> {
    return this.http.get<any>(`${this.getPublicationURL}/${publicationId}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getPublicationForWorkFlowEndpoint(publicationId));
      }));
  }

  publicationCustomUpload(file) {
    return this.http.post(`${this.configurations.baseUrl}${this._excelUpload}`, file)
  }

  getPublicationAuditDetails<T>(Id: number): Observable<T> {
    let endPointUrl = `${this._auditsUrl}?publicationId=${Id}`;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getPublicationAuditDetails(Id));
      }));
  }

  getpublicationListBySearchEndpoint<T>(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location): Observable<T> {
    return this.http
      .get<any>(`${this.getCodeUrl}?pageNumber=${pageIndex}&pageSize=${pageSize}&publicationId=${publicationId}&description=${description}&publicationType=${publicationType}&publishedBy=${publishby}&employee=${employeeName}&location=${location}`, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getpublicationListBySearchEndpoint(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location));
      }));
  }
  getAircraftManfacturerByPublicationId(itemMasterId, publicationRecordId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Publication/aircraftlistbypublicationidanditemmasterid?itemMasterId=${itemMasterId}&publicationId=${publicationRecordId}`)
  }

  getAircraftModelByAircraftManfacturerId(itemMasterId, publicationRecordId, aircraftTypeId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Publication/aircraftmodelslistbyitemmasteridandaircrafttypeid?itemMasterId=${itemMasterId}&publicationId=${publicationRecordId}&aircraftTypeId=${aircraftTypeId}`)
  }

  getDashNumberByModelandAircraftIds(itemMasterId, publicationRecordId, aircraftTypeId, aircraftModelId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Publication/aircraftmodelslistbyitemmasteridandaircraftmodelid?itemMasterId=${itemMasterId}&publicationId=${publicationRecordId}&aircraftTypeId=${aircraftTypeId}&aircraftModelId=${aircraftModelId}`)

  }


}
