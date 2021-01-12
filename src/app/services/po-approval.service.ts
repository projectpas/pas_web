
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class POApprovalService extends EndpointFactory {
  private readonly _getPoDataUrl: string = environment.baseUrl + "/api/approvalRule/approvalrulelist";
  private readonly _approvalrulestatusUrl: string = environment.baseUrl + "/api/approvalRule/approvalrulestatus";
  private readonly _approvalrulelistbyTaskURL: string =
  environment.baseUrl + "/api/approvalRule/approvalrulelistbyTask";
  private readonly _createOrUpdatePOApproval: string =
  environment.baseUrl + "/api/approvalRule/createapprovalrule";
  private readonly _createapprovalrulecommon: string =
  environment.baseUrl + "/api/approvalRule/createapprovalrulecommon";
  private readonly _approvalrulebyidwithEmployee: string =
  environment.baseUrl + "/api/approvalRule/approvalrulebyidwithEmployee?approvalRuleId=";
  private readonly _getApprovalById: string =
  environment.baseUrl + "/api/approvalRule/approvalrulebyid?approvalRuleId=";
    private readonly _getApprovalRuleHistorycommon?: string =
    environment.baseUrl + "/api/approvalRule/getApprovalRuleHistorycommon?approvalRuleId=";  
  private readonly _deleteApprovalById: string =
  environment.baseUrl + "/api/approvalRule/deleteapprovalrule";
    private readonly _restoreApprovalById: string =
    environment.baseUrl + "/api/approvalRule/restoreApprovalRule";
  private readonly excelUpload: string =
  environment.baseUrl + "/api/Provision/uploadProvisionCustomdata";

  getAllPOApprovalData<T>(): Observable<T> {
    return this.http.get<T>(this._getPoDataUrl, this.getRequestHeaders());
  }

  getAllApprovalDataByTaskId<T>(taskID,isDeleted,currentStatus): Observable<T> {
    return this.http
      .get<T>(
        `${this._approvalrulelistbyTaskURL}?taskID=${taskID}&currentStatus=${currentStatus}&isDeleted=${isDeleted}`,
        this.getRequestHeaders()
      )
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.getAllApprovalDataByTaskId(taskID,isDeleted,currentStatus)
        );
      });
  }

  
  updateActionforActive<T>(ruleId,status,user): Observable<T> {
    return this.http
      .get<T>(
        `${this._approvalrulestatusUrl}?approvalRuleId=${ruleId}&status=${status}&updatedBy=${user}`,
        this.getRequestHeaders()
      )
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.updateActionforActive<T>(ruleId,status,user)
        );
      });
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
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.createapprovalrulecommon(data)
        );
      });
  }

  getapprovalrulebyidwithEmployee<T>(id): Observable<T> {
    return this.http
      .get<T>(
        `${this._approvalrulebyidwithEmployee}${id}`,
        this.getRequestHeaders()
      )
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.getapprovalrulebyidwithEmployee(id)
        );
      });
  }

  getApprovalRuleHistorycommon<T>(id): Observable<T> {
    return this.http
      .get<T>(
        `${this._getApprovalRuleHistorycommon}${id}`,
        this.getRequestHeaders()
      )
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.getApprovalRuleHistorycommon(id)
        );
      });
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
    ).catch((error) => {
      return this.handleErrorCommon(error, () =>
        this.restoreApprovalById(id,name)
      );
    });
  }

  deleteApprovalById(id,name) {
    return this.http.get(
      `${this._deleteApprovalById}?approvalRuleId=${id}&updatedBy=${name}`,
      this.getRequestHeaders()
    ).catch((error) => {
      return this.handleErrorCommon(error, () =>
        this.deleteApprovalById(id,name)
      );
    });
  }
}


