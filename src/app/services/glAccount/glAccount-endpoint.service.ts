import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { EndpointFactory } from "../endpoint-factory.service";
import { ConfigurationService } from "../configuration.service";
import { GlAccount } from "../../models/GlAccount.model";

@Injectable()
export class GlAccountEndpointService extends EndpointFactory {
  private readonly getAllURL: string = "/api/GlAccount/getAllGLAccount";
  private readonly getByIdURL: string = "/api/GlAccount/getById";
  private readonly addURL: string = "/api/GlAccount/add";
  private readonly updateURL: string = "/api/GlAccount/update";
  private readonly removeglId: string = "/api/GlAccount/removeGlaccountId";
  private readonly getAllGlAccount: string = "/api/GlAccount/GLAccountList";
  private readonly deleteRestoreGLURL: string = "/api/GlAccount/DeleteRestoreGL";
  private readonly getMiscdataURL: string = "/api/GlAccount/getMiscData";  
  private readonly _glCashFlowClassificationsUrlAuditHistory: string = "/api/GlAccount/auditHistoryById";
  private readonly glaccountstatus: string = "/api/GlAccount/GlAccountstatus";

  get getAll() {
    return this.configurations.baseUrl + this.getAllURL;
  }
  get getById() {
    return this.configurations.baseUrl + this.getByIdURL;
  }
  get add() {
    return this.configurations.baseUrl + this.addURL;
  }
  get update() {
    return this.configurations.baseUrl + this.updateURL;
  }
  get removeglaccount() {
    return this.configurations.baseUrl + this.removeglId;
  }
  get getMiscdata() {
    return this.configurations.baseUrl + this.getMiscdataURL;
  }
  get getAllGlAccountList() {
    return this.configurations.baseUrl + this.getAllGlAccount;
  }
  get glaccountstatusList() {
    return this.configurations.baseUrl + this.glaccountstatus;
  }

  constructor(
    http: HttpClient,
    configurations: ConfigurationService,
    injector: Injector
  ) {
    super(http, configurations, injector);
  }

  getAllGlAccounts<T>(): Observable<T> {
    let endpointUrl = this.getAll;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch((error) => {
        return this.handleErrorCommon(error, () => this.getAllGlAccounts());
      });
  }



  getglAccountList(data) {       
		return this.http.post(this.getAllGlAccountList, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getglAccountList(data));
			});
  }
  
  addGlAccount<T>(data: any): Observable<T> {  
    return this.http
      .post<T>(this.add, JSON.stringify(data), this.getRequestHeaders())
      .catch((error) => {
        return this.handleErrorCommon(error, () => this.addGlAccount(data));
      });
  }

  updateGlAccount<T>(glAccount: GlAccount): Observable<T> {
    let endpointUrl = this.update;
    return this.http
      .post<T>(endpointUrl, JSON.stringify(glAccount), this.getRequestHeaders())
      .catch((error) => {
        return this.handleErrorCommon(error, () => this.updateGlAccount(glAccount));
      });
  }

  removeGlAccountById<T>(glAccountId: number): Observable<T> {
    let endpointUrl = `${this.removeglaccount}/${glAccountId}`;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch((error) => {
        return this.handleErrorCommon(error, () =>
          this.removeGlAccountById(glAccountId)
        );
      });
  }
  getMiscData<T>(): Observable<T> {
    let endpointUrl = this.getMiscdata;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .catch((error) => {
        return this.handleErrorCommon(error, () => this.getMiscData());
      });
  }

  deleteRestoreGL(id,status, userName){
    return this.http.post(this.configurations.baseUrl + `${this.deleteRestoreGLURL}?id=${id}&status=${status}&userName=${userName}`, this.getRequestHeaders())
    .catch(error => {
        return this.handleErrorCommon(error, () => this.deleteRestoreGL(id,status,userName));
    });
  }

  updatestatusactive(id,status, userName) {
    let endpointUrl = `${this.glaccountstatusList}?glAccountId=${id}&status=${status}&updatedBy=${userName}`;
    return this.http.post(endpointUrl,  this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.updatestatusactive(id,status, userName));
        });
  }

  getHistory(accountId): Observable<any> {
    let endpointUrl = this.configurations.baseUrl + `${this._glCashFlowClassificationsUrlAuditHistory}/${accountId}`;
    
    return this.http.get(endpointUrl, this.getRequestHeaders())
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getHistory(accountId));
        });
 }

 
 getGlAccountById(glAccountId): Observable<any> {
  let endpointUrl = `${this.getById}/${glAccountId}`;

  return this.http.get(endpointUrl, this.getRequestHeaders())
      .catch(error => {
          return this.handleErrorCommon(error, () => this.getGlAccountById(glAccountId));
      });
}

 
}
