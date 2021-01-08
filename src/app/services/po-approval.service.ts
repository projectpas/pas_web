
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class POApprovalService extends EndpointFactory {
  private readonly _getPoDataUrl: string = "/api/approvalRule/approvalrulelist";
  private readonly _approvalrulelistbyTaskURL: string =
    "/api/approvalRule/approvalrulelistbyTask";
  private readonly _createOrUpdatePOApproval: string =
    "/api/approvalRule/createapprovalrule";
  private readonly _createapprovalrulecommon: string =
    "/api/approvalRule/createapprovalrulecommon";
  private readonly _approvalrulebyidwithEmployee: string =
    "/api/approvalRule/approvalrulebyidwithEmployee?approvalRuleId=";
  private readonly _getApprovalById: string =
    "/api/approvalRule/approvalrulebyid?approvalRuleId=";

  private readonly _deleteApprovalById: string =
    "/api/approvalRule/deleteapprovalrule";
    private readonly _restoreApprovalById: string =
    "/api/approvalRule/restoreApprovalRule";
  private readonly excelUpload: string =
    "/api/Provision/uploadProvisionCustomdata";

  getAllPOApprovalData<T>(): Observable<T> {
    return this.http.get<T>(this._getPoDataUrl, this.getRequestHeaders());
  }

  getAllApprovalDataByTaskId<T>(taskID,isDeleted): Observable<T> {
    return this.http
      .get<any>(
        `${this._approvalrulelistbyTaskURL}?taskID=${taskID}&isDeleted=${isDeleted}`,
        this.getRequestHeaders()
      )
      .pipe(catchError((error) => {
        return this.handleErrorCommon(error, () =>
          this.getAllApprovalDataByTaskId(taskID,isDeleted)
        );
      }));
  }

  createOrUpdatePOApproval(data) {
    return this.http.post(
      this._createOrUpdatePOApproval,
      JSON.stringify(data),
      this.getRequestHeaders()
    );
  }

  createapprovalrulecommon(data) {
    return this.http
      .post(
        this._createapprovalrulecommon,
        JSON.stringify(data),
        this.getRequestHeaders()
      )
      .pipe(catchError((error) => {
        return this.handleErrorCommon(error, () =>
          this.createapprovalrulecommon(data)
        );
      }));
  }

  getapprovalrulebyidwithEmployee<T>(id): Observable<T> {
    return this.http
      .get<any>(
        `${this._approvalrulebyidwithEmployee}${id}`,
        this.getRequestHeaders()
      )
      .pipe(catchError((error) => {
        return this.handleErrorCommon(error, () =>
          this.getapprovalrulebyidwithEmployee(id)
        );
      }));
  }

  getApprovalById<T>(id): Observable<T> {
    return this.http.get<T>(
      `${this._getApprovalById}${id}`,
      this.getRequestHeaders()
    );
  }

  restoreApprovalById(id,name) {
    return this.http.get(
      `${this._restoreApprovalById}?approvalRuleId=${id}&updatedBy=${name}`,
      this.getRequestHeaders()
    ).pipe(catchError((error) => {
      return this.handleErrorCommon(error, () =>
        this.restoreApprovalById(id,name)
      );
    }));
  }

  deleteApprovalById(id,name) {
    return this.http.get(
      `${this._deleteApprovalById}?approvalRuleId=${id}&updatedBy=${name}`,
      this.getRequestHeaders()
    ).pipe(catchError((error) => {
      return this.handleErrorCommon(error, () =>
        this.deleteApprovalById(id,name)
      );
    }));
  }
}


