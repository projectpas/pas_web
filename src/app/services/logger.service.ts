import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Role } from "../models/role.model";
import { LoggerEndpointService } from "./logger-endpoint.service copy";
import { ILogSearchParameters } from "../models/sales/ILogSearchParameters";
import { ILogListView } from "../models/sales/ILogListView";
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = {
  roles: Role[] | string[];
  operation: RolesChangedOperation;
};

@Injectable()
export class LoggerService {
  constructor(private loggerEndPointSevice: LoggerEndpointService) {
  }
  
  search(
    logSearchParameters: ILogSearchParameters
  ): Observable<ILogListView[]> {
    return Observable.forkJoin(
      this.loggerEndPointSevice.search(logSearchParameters)
    );
  }
}