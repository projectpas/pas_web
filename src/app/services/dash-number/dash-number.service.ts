import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DashNumberEndpointService } from './dash-number-endpoint.service';
import { AircraftDashNumber } from '../../models/dashnumber.model';

@Injectable()
export class DashNumberService {
  constructor(private dashNumberEndpoint: DashNumberEndpointService) { }

  getAll() {
    return Observable.forkJoin(
      this.dashNumberEndpoint.getAllDashNumbers<any>()
    );
  }

  getById(DashNumberId: number) {
    return Observable.forkJoin(
      this.dashNumberEndpoint.getDashNumberById<AircraftDashNumber>(
        DashNumberId
      )
    );
    }

    getByModelId(AircraftModelId: number) {
        return Observable.forkJoin(
            this.dashNumberEndpoint.getDashNumberByModelId<AircraftDashNumber>(
                AircraftModelId
            )
        );
    }

  add(DashNumber) {
    return this.dashNumberEndpoint.addDashNumber<AircraftDashNumber>(
      DashNumber
    );
  }

  update(DashNumber) {
    return this.dashNumberEndpoint.updateDashNumber<AircraftDashNumber>(
      DashNumber
    );
  }

  remove(DashNumberId: number) {
    return this.dashNumberEndpoint.removeDashNumberById(DashNumberId);
  }
  updateActive(dashNumber: any) {
    return this.dashNumberEndpoint.getUpdateForActive(
      dashNumber,
      dashNumber.dashNumberId
    );
  }
  getDashNumberAudit(DashNumberId: number) {
    return this.dashNumberEndpoint.getDashNumberStatusAuditById<any>(
      DashNumberId
    );
  }

  getServerPages(serverSidePagesData: any) {
    return Observable.forkJoin(
      this.dashNumberEndpoint.getAircraftDashNumberRecords<
        AircraftDashNumber[]
      >(serverSidePagesData)
    );
  }
  getAllDashModels(Mid: string, Tid: number, Did: string) {
    return this.dashNumberEndpoint.getDASHLISTByID<any>(Mid, Tid, Did);
  }
  getDashNumberByModelTypeId(Mid: string, Tid: string) {
    return this.dashNumberEndpoint.getDashNumberByModelTypeId<any>(Mid, Tid);
    }
    getCapesDashNumberByModelTypeId(Mid: string, Tid: string) {
        return this.dashNumberEndpoint.getCapesDashNumberByModelTypeId<any>(Mid, Tid);
    }
  getAllDashModels_MultiID(Mid: string, Tid: number, Did: string) {
    return this.dashNumberEndpoint.getDASHLISTByID<any>(Mid, Tid, Did);
    }
    CustomerDashNumberUpload(file) {
        return this.dashNumberEndpoint.CustomerDashNumberUpload(file);
    }
    getDashNumByModelTypeId(Mid: string, Tid: string) {
        return this.dashNumberEndpoint.getDashNumByModelTypeId<any>(Mid, Tid);
    }
}
