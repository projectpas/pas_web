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

import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

import { PublicationEndpointService } from './publication-endpoint.service';
import { Publication } from '../models/publication.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class PublicationService {
  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation =
    'modify';

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private publicationEndpoint: PublicationEndpointService
  ) { }

  getWorkFlows(data) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationListEndpoint<Publication[]>(data)
    )
  }
  getPublications(data) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationListEndpointNew<Publication[]>(data)
    );
  }

  getAllPublications() {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationEndpoint<Publication[]>()
    );
  }
  getAllbyIdPublications(id) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationbyIdEndpoint<any>(id)
    );
  }
  newAction(action) {
    return this.publicationEndpoint.getNewpublicationEndpoint<any>(
      action
    );
  }

  getAction(actionId?: any) {
    return this.publicationEndpoint.getEditActionEndpoint<Publication>(
      actionId
    );
  }

  updateAction(file: any) {
    return this.publicationEndpoint.getUpdateActionEndpoint<any>(
      file
    );
  }

  deleteAcion(actionId: any) {
    return this.publicationEndpoint.getDeleteActionEndpoint(actionId);
  }

  publicationStatus(publicationRecordId: number, status: boolean, updatedBy: string) {
    return this.publicationEndpoint.publicationStatusEndpoint(publicationRecordId, status, updatedBy);
  }

  historyAcion(actionId: number) {
    return Observable.forkJoin(
      this.publicationEndpoint.getHistoryActionEndpoin<AuditHistory[]>(actionId)
    );
  }

  getPublicationAudit(publicationId: number) {
    return this.publicationEndpoint.getPublincationAuditById<any>(
      publicationId
    );
  }

  newPNACMappingAction(action: Publication) {
    return this.publicationEndpoint.postPNACMapping<Publication>(action);
  }
  newPNATAMappingAction(action: Publication) {
    return this.publicationEndpoint.postPNATAMapping<Publication>(action);
  }
  getPublicationPNMapping(PNid: number) {
    return this.publicationEndpoint.getPubPNById<any>(PNid);
  }
  // Save Part Number Mapping
  postMappedPartNumbers(actionData) {
    return this.publicationEndpoint.postPartNumberMappedData(actionData);
  }
  aircraftInformationSearch(searchUrl, publicationId) {
    return this.publicationEndpoint.getAircraftInformationBySearch(
      searchUrl,
      publicationId
    );
  }
  getAircraftMappedByPublicationId(PublicationID: number) {
    return this.publicationEndpoint.getAirMappedByPubId<any>(PublicationID);
  }
  getAtaMappedByPublicationId(PublicationID: number) {
    return this.publicationEndpoint.getAtaMappedByPubId<any>(PublicationID);
  }
  getAirMappedByMultiTypeId(PublicationID: number, AircraftTypeID: string) {
    return this.publicationEndpoint.getAirMappedByMultiTypeId<any>(
      PublicationID,
      AircraftTypeID
    );
  }
  getAirMappedByMultiModelId(PublicationID: number, AircraftModelID: string) {
    return this.publicationEndpoint.getAtaMappedByMultiModelId<any>(
      PublicationID,
      AircraftModelID
    );
  }
  getAirMappedByMultiDashId(PublicationID: number, DashNumberId: string) {
    return this.publicationEndpoint.getAtaMappedByMultiDashId<any>(
      PublicationID,
      DashNumberId
    );
  }
  getAirMappedByMultiTypeIdModelID(
    PublicationID: number,
    AircraftTypeID: string,
    AircraftModelID: string
  ) {
    return this.publicationEndpoint.getAtaMappedByMultiTypeIDModelID<any>(
      PublicationID,
      AircraftTypeID,
      AircraftModelID
    );
  }

  getAirMappedByMultiTypeIdModelIDDashID(
    PublicationID: number,
    AircraftTypeID: string,
    AircraftModelID: string,
    DashNumberId: string
  ) {
    return this.publicationEndpoint.getAtaMappedByMultiTypeIDModelIDDashID<any>(
      PublicationID,
      AircraftTypeID,
      AircraftModelID,
      DashNumberId
    );
  }
  getATAMappedByMultiChapterIdSubChapterID(
    PublicationID: number,
    ChapterId: string,
    SubChapterId: string
  ) {
    return this.publicationEndpoint.getAtaMappedByMultiATAIDSubChapterID<any>(
      PublicationID,
      ChapterId,
      SubChapterId
    );
  }
  getATAMappedByMultiChapterId(PublicationID: number, ChapterId: string) {
    return this.publicationEndpoint.getAtaMappedByMultiChapterID<any>(
      PublicationID,
      ChapterId
    );
  }
  getATAMappedByMultiSubChapterId(PublicationID: number, SubChapterId: string) {
    return this.publicationEndpoint.getAtaMappedByMultiSubChapterID<any>(
      PublicationID,
      SubChapterId
    );
  }

  getFilesBypublication(PublicationID: number) {
    return this.publicationEndpoint.getFilesBypublicationEndPoint<any>(
      PublicationID
    );
  }

  getFilesBypublicationNew(PublicationID: number) {
    return this.publicationEndpoint.getFilesBypublicationEndPointNew<any>(
      PublicationID
    );
  }

  getPublishedByModuleList() {
    return this.publicationEndpoint.getPublishedByModuleListEndPoint<any>();
  }
  deleteItemMasterMapping(PublicationItemMasterMappingId: number) {
    return this.publicationEndpoint.deleteitemMasterMappedEndpoint<any>(
      PublicationItemMasterMappingId
    );
  }

  deletepublicationtagtype(tagTypeId: number) {
    return this.publicationEndpoint.deletepublicationtagtypeEndPoint<any>(
      tagTypeId
    );
  }
  searchgetAirMappedByMultiTypeIdModelIDDashID(PublicationID: number) {
    return this.publicationEndpoint.searchgetAirMappedByMultiTypeIDModelIDDashID<any>(PublicationID);
  }
  searchgetATAMappedByMultiSubChapterId(
    searchUrl: string,
    PublicationID: number
  ) {
    return this.publicationEndpoint.searchgetAtaMappedByMultiSubChapterID<any>(
      searchUrl,
      PublicationID
    );
  }

  getpublicationbyIdView(id) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationbyIdViewEndpoint<any>(id)
    );
  }

  getpublicationGlobalSearch(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationGlobalSearchEndpoint<any>(ataChapterId, ataSubChapterId, airCraftId, modelId, dashNumberId, pageNumber, pageSize)
    );
  }


  getpublicationslistadvancesearch(data) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationslistadvancesearchEndPoint<any>(data)
    );
  }

  getPublicationTypes() {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationTypesEndpoint<any>()
    );
  }

  getAllPublicationsDropdown() {
    return Observable.forkJoin(
      this.publicationEndpoint.getAllPublicationsDropdownEndPoint<any[]>()
    );
  }

  getPublicationForWorkFlow(publicationId: number) {
    return Observable.forkJoin(
      this.publicationEndpoint.getPublicationForWorkFlowEndpoint<any>(publicationId)
    );
  }

  publicationFileUpload(file) {
    return this.publicationEndpoint.publicationCustomUpload(file);
  }

  getPublicationAuditDetails(Id: number) {
    return this.publicationEndpoint.getPublicationAuditDetails<any[]>(Id);
  }

  getpublicationListBySearchEndpoint(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location) {
    return Observable.forkJoin(
      this.publicationEndpoint.getpublicationListBySearchEndpoint<Publication[]>(pageIndex, pageSize, publicationId, description, publicationType, publishby, employeeName, location)
    );
  }
  getAircraftManfacturerByPublicationId(itemMasterId, publicationRecordId,idList) {
    return this.publicationEndpoint.getAircraftManfacturerByPublicationId(itemMasterId, publicationRecordId,idList)
  }
  getAircraftModelByAircraftManfacturerId(itemMasterId, publicationRecordId, aircraftTypeId,idList) {
    return this.publicationEndpoint.getAircraftModelByAircraftManfacturerId(itemMasterId, publicationRecordId, aircraftTypeId,idList);
  }
  getDashNumberByModelandAircraftIds(itemMasterId, publicationRecordId, aircraftTypeId, aircraftModelId, idList) {
    return this.publicationEndpoint.getDashNumberByModelandAircraftIds(itemMasterId, publicationRecordId, aircraftTypeId, aircraftModelId, idList);
  }
}
