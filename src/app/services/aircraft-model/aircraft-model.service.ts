// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { AircraftModelEndpointService } from "./aircraft-model-endpoint.service";
import { AircraftModel } from "../../models/aircraft-model.model";

@Injectable()
export class AircraftModelService {
  constructor(private aircraftModelEndpoint: AircraftModelEndpointService) { }

  getAll(masterCompanyId?) {
    return Observable.forkJoin(
      this.aircraftModelEndpoint.getAllAircraftModel<AircraftModel[]>(masterCompanyId)
    );
  }

  getById(aircraftModelId: number) {
    return Observable.forkJoin(
      this.aircraftModelEndpoint.getAircraftModelById<AircraftModel>(
        aircraftModelId
      )
    );
  }

  add(aircraftModel) {
    return this.aircraftModelEndpoint.addAircraftModel<AircraftModel>(
      aircraftModel
    );
  }

  update(aircraftModel) {
    return this.aircraftModelEndpoint.updateAircraftModel<AircraftModel>(
      aircraftModel
    );
  }

  remove(aircraftModelId: number) {
    return this.aircraftModelEndpoint.removeAircraftModelById(aircraftModelId);
  }
  updateActive(aircraftModel: any) {
    return this.aircraftModelEndpoint.getUpdateForActive(
      aircraftModel,
      aircraftModel.aircraftModelId
    );
  }
  getAudit(aircraftModelId: number) {
    return this.aircraftModelEndpoint.getAudit<any[]>(aircraftModelId);
  }

  getAircraftModelListByManufactureId(aircraftModelId: string,idlist?: string) {   
    return Observable.forkJoin( 
      this.aircraftModelEndpoint.getAircraftModelListByAircraftManufacturerId<
        AircraftModel[]
      >(aircraftModelId,idlist)
    );
  }
  getServerPages(serverSidePagesData: any) {
    return Observable.forkJoin(
      this.aircraftModelEndpoint.getAircraftModelsRecords<AircraftModel[]>(
        serverSidePagesData
      )
    );
  }
  getLandingPageList(id?) {
    return Observable.forkJoin(
      this.aircraftModelEndpoint.getLandingPageList<AircraftModel[]>(id)
    );
  }
}
