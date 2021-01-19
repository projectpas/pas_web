import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-Keys';

@Injectable()
export class PublicationEndpointService extends EndpointFactory {
  private readonly _publicationGetUrl: string = this.configurations.baseUrl + '/api/Publication/getpublicationslist';
  private readonly _publicationGetUrlNew: string = this.configurations.baseUrl + '/api/Publication/getpublicationslistnew';
  private readonly _publicationGetByIdUrl: string = this.configurations.baseUrl + '/api/Publication/GetPublicationByID';

  private readonly _publicationUrlNew: string = this.configurations.baseUrl +
    '/api/Publication/publicationpost';
  private readonly _actionsUrlAuditHistory: string = this.configurations.baseUrl +
    '/api/Publication/auditHistoryById';
  private readonly getPublicationAuditById: string = '/api/Publication/audits';

  private readonly _publicationPNACNEW: string = this.configurations.baseUrl +
    '/api/Publication/PubPNACMappingPost';
  private readonly _publicationPNATANEW: string = this.configurations.baseUrl +
    '/api/Publication/PubPNATAMappingPost';
  private readonly _PostPNMapping: string = this.configurations.baseUrl + '/api/Publication/PNIMMappingPost';
  private readonly _getAirMappingByPublicationID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAircraftMappedByPublcationID';
  private readonly _getAtaMappingByPublicationID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAtaMappedByPublcationID';
  private readonly _getAirMappingByMultiTypeID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeID';
  private readonly _getAirMappingByMultiModelID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAirMappedByPublicationIdMultiModelID';
  private readonly _getAirMappingByMultiDashID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAirMappedByPublicationIdMultiDashID';
  private readonly _getAirMappingByMultiTypeIDModelID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeIDModelID';
  private readonly _getAirMappingByMultiTypeIDModelIDDashID: string = this.configurations.baseUrl +
    '/api/Publication/getItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _getATAMappingByMultiChapterIDSubID: string = this.configurations.baseUrl +
    '/api/Publication/getItemATAMappedByPublicationIdMultiATAIDSubChapterID';
  private readonly _deleteItemMasterMappingByID: string = this.configurations.baseUrl +
    '/api/Publication/deletePublicationItemMasterMapping';
  private readonly _deletepublicationtagtypeEndPoint: string = this.configurations.baseUrl +
    '/api/Publication/deletepublicationtagtype';
  private readonly _getATAMappingByMultiChapterID: string = this.configurations.baseUrl +
    '/api/Publication/getItemATAMappedByPublicationIdMultiChapterID';
  private readonly _getATAMappingByMultiSubChapterID: string = this.configurations.baseUrl +
    '/api/Publication/getItemATAMappedByPublicationIdMultiSubChapterID';
  private readonly _getFilesBypublication: string = this.configurations.baseUrl +
    '/api/Publication/getFilesBypublication';
  private readonly _getFilesBypublicationNew: string = this.configurations.baseUrl +
    '/api/Publication/getfiledetailsbypublicationNew';

  private readonly _getPublishedByModuleListEndPointUrl: string = this.configurations.baseUrl + '/api/Publication/publishedbymodulelist';
  private readonly _publicationPNMappingData: string = this.configurations.baseUrl +
    '/api/Publication/GetPubPNMappedDataByPublicationRecordIds';
  private readonly _AircraftInformationSearch: string = this.configurations.baseUrl +
    '/api/Publication/searchGetItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _searchgetAirMappingByMultiTypeIDModelIDDashID: string = this.configurations.baseUrl +
    '/api/Publication/searchGetItemAirMappedByPublicationIdMultiTypeIDModelIDDashID';

  private readonly _searchgetATAMappingByMultiChapterIDSubID: string = this.configurations.baseUrl +
    '/api/Publication/searchGetItemATAMappedByPublicationIdMultiATAIDSubChapterID';

  private readonly _publicationStatus: string = this.configurations.baseUrl +
    '/api/Publication/publicationstatus';
  private readonly _publicationGetByIdViewUrl: string = this.configurations.baseUrl + '/api/Publication/publicationview';
  private readonly _publicationGlobalSearchUrl: string = this.configurations.baseUrl + '/api/Publication/publicationsglobalsearch';
  private readonly _getpublicationslistadvancesearchUrl: string = this.configurations.baseUrl + '/api/Publication/getpublicationslistadvancesearch';
  private readonly _publicationTypes: string = this.configurations.baseUrl + '/api/Publication/getpublicationtypes';
  private readonly _publicationForWorkflowURL: string = this.configurations.baseUrl + '/api/Publication/GetPublicationDropdownData';
  private readonly _publicationURL: string = this.configurations.baseUrl + '/api/Publication/getPublicationForWorkFlowById';
  private readonly _excelUpload: string = this.configurations.baseUrl + "/api/Publication/uploadpublicationcustomdata";
  private readonly _auditsUrl: string = this.configurations.baseUrl + "/api/Publication/publicationhistory";


  // get getCodeUrl() {
  //   return this.configurations.baseUrl + this._publicationGetUrl;
  // }

  // get getPublicationsListUrl() {
  //   return this.configurations.baseUrl + this._publicationGetUrlNew;
  // }

  // get getPublicationForWorkFlowURL() {
  //   return this.configurations.baseUrl + this._publicationForWorkflowURL;
  // }

  // get getPublicationURL() {
  //   return this.configurations.baseUrl + this._publicationURL;
  // }


  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getpublicationEndpoint<T>(): Observable<T> {
    return this.http
      .get<T>(this._publicationGetUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationEndpoint());
      });
  }
  getpublicationbyIdEndpoint<T>(id): Observable<T> {
    return this.http
      .get<T>(`${this._publicationGetByIdUrl}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationbyIdEndpoint(id));
      });
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
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getEditActionEndpoint(actionId)
        );
      });
  }

  getUpdateActionEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let endpointUrl = `${this._publicationUrlNew}`;

    return this.http
      .put<T>(endpointUrl, file)
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getUpdateActionEndpoint(file)
        );
      });
  }

  getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
    let endpointUrl = `${this._publicationUrlNew}/${actionId}`;

    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getDeleteActionEndpoint(actionId)
        );
      });
  }

  publicationStatusEndpoint<T>(id, status, updatedBy): Observable<T> {
    return this.http
      .get<T>(`${this._publicationStatus}?publicationRecordId=${id}&status=${status}&updatedBy=${updatedBy}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.publicationStatusEndpoint(id, status, updatedBy));
      });
  }


  getHistoryActionEndpoin<T>(actionId: number): Observable<T> {
    let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getHistoryActionEndpoin(actionId)
        );
      });
  }

  getPublincationAuditById<T>(publicationId: number): Observable<T> {
    let endpointUrl = `${this.getPublicationAuditById}/${publicationId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getPublincationAuditById(publicationId)
        );
      });
  }

  postPNACMapping<T>(userObject: any): Observable<T> {
    return this.http
      .post<T>(
        this._publicationPNACNEW,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.postPNACMapping(userObject));
      });
  }
  postPNATAMapping<T>(userObject: any): Observable<T> {
    return this.http
      .post<T>(
        this._publicationPNATANEW,
        JSON.stringify(userObject),
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () => this.postPNATAMapping(userObject));
      });
  }

  getPubPNById<T>(PNid: number): Observable<T> {
    let endpointUrl = `${this._publicationPNMappingData}/${PNid}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPubPNById(PNid));
      });
  }

  // Save Part Number Mapping
  postPartNumberMappedData<T>(object): Observable<T> {
    return this.http
      .post<T>(
        this._PostPNMapping,
        JSON.stringify(object),
        this.getRequestHeaders()
      )
      .catch(err => {
        return this.handleErrorCommon(err, () =>
          this.postPartNumberMappedData(object)
        );
      });
  }

  getAircraftInformationBySearch<T>(searchUrl, publicationId): Observable<T> {
    console.log(searchUrl);
    return this.http
      .get<T>(
        `${this._AircraftInformationSearch}/${publicationId}?${searchUrl}`
      )
      .catch(err => {
        return this.handleErrorCommon(err, () =>
          this.getAircraftInformationBySearch(searchUrl, publicationId)
        );
      });
  }

  getAirMappedByPubId<T>(PublicationID: number): Observable<T> {
    let endpointUrl = `${this._getAirMappingByPublicationID}/${PublicationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAirMappedByPubId(PublicationID)
        );
      });
  }
  getAtaMappedByPubId<T>(PublicationID: number): Observable<T> {
    let endpointUrl = `${this._getAtaMappingByPublicationID}/${PublicationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByPubId(PublicationID)
        );
      });
  }
  getAirMappedByMultiTypeId<T>(
    PublicationID: number,
    AircraftTypeId: string
  ): Observable<T> {
    let endpointUrl = `${this._getAirMappingByMultiTypeID
      }/${PublicationID}${AircraftTypeId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAirMappedByMultiTypeId(PublicationID, AircraftTypeId)
        );
      });
  }
  getAtaMappedByMultiModelId<T>(
    PublicationID: number,
    AircraftModelID: string
  ): Observable<T> {
    let endpointUrl = `${this._getAirMappingByMultiModelID
      }/${PublicationID}${AircraftModelID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiModelId(PublicationID, AircraftModelID)
        );
      });
  }
  getAtaMappedByMultiDashId<T>(
    PublicationID: number,
    DashNumberId: string
  ): Observable<T> {
    let endpointUrl = `${this._getAirMappingByMultiDashID
      }/${PublicationID}${DashNumberId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiDashId(PublicationID, DashNumberId)
        );
      });
  }
  getAtaMappedByMultiTypeIDModelID<T>(
    PublicationID: number,
    AircraftTypeId: string,
    AircraftModelID: string
  ): Observable<T> {
    let endpointUrl = `${this._getAirMappingByMultiTypeIDModelID
      }/${PublicationID}${AircraftTypeId}/${AircraftModelID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiTypeIDModelID(
            PublicationID,
            AircraftTypeId,
            AircraftModelID
          )
        );
      });
  }
  getAtaMappedByMultiTypeIDModelIDDashID<T>(
    PublicationID: number,
    AircraftTypeId: string,
    AircraftModelID: string,
    DashNumberId: string
  ): Observable<T> {
    let endpointUrl = `${this._getAirMappingByMultiTypeIDModelIDDashID
      }/${PublicationID}${AircraftTypeId}/${AircraftModelID}/${DashNumberId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiTypeIDModelIDDashID(
            PublicationID,
            AircraftTypeId,
            AircraftModelID,
            DashNumberId
          )
        );
      });
  }

  getAtaMappedByMultiATAIDSubChapterID<T>(
    PublicationID: number,
    ChapterID: string,
    SubChapterID
  ): Observable<T> {
    let endpointUrl = `${this._getATAMappingByMultiChapterIDSubID
      }/${PublicationID}/${ChapterID}/${SubChapterID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiATAIDSubChapterID(
            PublicationID,
            ChapterID,
            SubChapterID
          )
        );
      });
  }
  getAtaMappedByMultiChapterID<T>(
    PublicationID: number,
    ChapterID: string
  ): Observable<T> {
    let endpointUrl = `${this._getATAMappingByMultiChapterID
      }/${PublicationID}/${ChapterID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiChapterID(PublicationID, ChapterID)
        );
      });
  }
  getAtaMappedByMultiSubChapterID<T>(
    PublicationID: number,
    SubChapterID: string
  ): Observable<T> {
    let endpointUrl = `${this._getATAMappingByMultiSubChapterID
      }/${PublicationID}/${SubChapterID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getAtaMappedByMultiSubChapterID(PublicationID, SubChapterID)
        );
      });
  }
  // http://localhost:5050/api/Publication/getFilesBypublication/4(PublicationId)
  getFilesBypublicationEndPoint<T>(
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${this._getFilesBypublication
      }/${PublicationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getFilesBypublicationEndPoint(PublicationID)
        );
      });
  }

  getFilesBypublicationEndPointNew<T>(
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${this._getFilesBypublicationNew
      }/${PublicationID}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getFilesBypublicationEndPointNew(PublicationID)
        );
      });
  }

  getPublishedByModuleListEndPoint<T>() {
    let endpointUrl = `${this._getPublishedByModuleListEndPointUrl
      }`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.getPublishedByModuleListEndPoint()
        );
      });
  }


  deleteitemMasterMappedEndpoint<T>(PublicationItemMasterMappingId: any): Observable<T> {
    return this.http
      .post<T>(
        `${this._deleteItemMasterMappingByID}/${PublicationItemMasterMappingId}`,
        //JSON.stringify(userObject),
        {},
        this.getRequestHeaders()
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.deleteitemMasterMappedEndpoint(PublicationItemMasterMappingId)
        );
      });
  }

  deletepublicationtagtypeEndPoint<T>(tagTypeId: any): Observable<T> {
    return this.http
      .delete<T>(
        `${this._deletepublicationtagtypeEndPoint}/${tagTypeId}?updatedBy=` + DBkeys.UPDATED_BY,
        //JSON.stringify(userObject),
        {},
      )
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.deletepublicationtagtypeEndPoint(tagTypeId)
        );
      });
  }

  searchgetAirMappedByMultiTypeIDModelIDDashID<T>(
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${this._searchgetAirMappingByMultiTypeIDModelIDDashID
      }/${PublicationID}`;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.searchgetAirMappedByMultiTypeIDModelIDDashID(PublicationID)
        );
      });
  }
  searchgetAtaMappedByMultiSubChapterID<T>(
    searchUrl: string,
    PublicationID: number
  ): Observable<T> {
    let endpointUrl = `${this._searchgetATAMappingByMultiChapterIDSubID
      }/${PublicationID}?${searchUrl}`;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () =>
          this.searchgetAtaMappedByMultiSubChapterID(searchUrl, PublicationID)
        );
      });
  }

  getpublicationbyIdViewEndpoint<T>(id): Observable<T> {
    return this.http
      .get<T>(`${this._publicationGetByIdViewUrl}/${id}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationbyIdViewEndpoint(id));
      });
  }

  getpublicationListEndpoint<T>(data): Observable<T> {
    return this.http.post(this._publicationGetUrl, JSON.stringify(data), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationListEndpoint(data));
      });
  }
  getpublicationListEndpointNew<T>(data): Observable<T> {
    return this.http.post(this._publicationGetUrlNew, JSON.stringify(data), this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationListEndpointNew(data));
      });
  }

  getpublicationGlobalSearchEndpoint<T>(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize): Observable<T> {
    return this.http
      .get<T>(`${this._publicationGlobalSearchUrl}/?ataChapterId=${ataChapterId}&ataSubChapterId=${ataSubChapterId}&airCraftId=${airCraftId}&modelId=${modelId}&dashNumberId=${dashNumberId}&pageNumber=${pageNumber}&pageSize=${pageSize}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationGlobalSearchEndpoint(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize));
      });
  }

  getpublicationslistadvancesearchEndPoint<T>(data): Observable<T> {
    return this.http
      .post<T>(this._getpublicationslistadvancesearchUrl, data, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationslistadvancesearchEndPoint(data));
      });
  }

  getpublicationTypesEndpoint<T>(): Observable<T> {
    return this.http
      .get<T>(`${this._publicationTypes}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationTypesEndpoint());
      });
  }

  getAllPublicationsDropdownEndPoint<T>(): Observable<T> {
    return this.http
      .get<T>(this._publicationForWorkflowURL, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getAllPublicationsDropdownEndPoint());
      });
  }

  getPublicationForWorkFlowEndpoint<T>(publicationId: number): Observable<T> {
    return this.http.get<T>(`${this._publicationURL}/${publicationId}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPublicationForWorkFlowEndpoint(publicationId));
      });
  }

  publicationCustomUpload(file) {
    return this.http.post(`${this.configurations.baseUrl}${this._excelUpload}`, file)
  }

  getPublicationAuditDetails<T>(Id: number): Observable<T> {
    let endPointUrl = `${this._auditsUrl}?publicationId=${Id}`;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPublicationAuditDetails(Id));
      });
  }

  getpublicationListBySearchEndpoint<T>(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location): Observable<T> {
    return this.http
      .get<T>(`${this._publicationGetUrl}?pageNumber=${pageIndex}&pageSize=${pageSize}&publicationId=${publicationId}&description=${description}&publicationType=${publicationType}&publishedBy=${publishby}&employee=${employeeName}&location=${location}`, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getpublicationListBySearchEndpoint(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location));
      });
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
