// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AircraftManufacturerEndpointService } from './aircraftManufacturer-endpoint.service';
import { AircraftType } from '../../models/AircraftType.model';

@Injectable()
export class AircraftManufacturerService {

    constructor(private aircraftManufacturerEndpoint: AircraftManufacturerEndpointService) {
    }

    getAll(masterCompanyId?) {
        return Observable.forkJoin(
            this.aircraftManufacturerEndpoint.getAllAircraftManufacturer<AircraftType[]>(masterCompanyId));
    }

    getById(aircraftManufacturerId: number) {
        return Observable.forkJoin(
            this.aircraftManufacturerEndpoint.getAircraftManufacturerById<AircraftType>(aircraftManufacturerId)
        );
    }

    add(aircraftManufacturer) {
        return this.aircraftManufacturerEndpoint.addAircraftManufacturer<AircraftType>(aircraftManufacturer);
    }

    update(aircraftManufacturer) {
        return this.aircraftManufacturerEndpoint.updateAircraftManufacturer<AircraftType>(aircraftManufacturer);
    }

    remove(aircraftManufacturerId: number) {
        return this.aircraftManufacturerEndpoint.removeAircraftManufacturerById(aircraftManufacturerId);
    }
    updateActive(data: any) {
        return this.aircraftManufacturerEndpoint.getUpdateForActive(data, data.aircraftTypeId);
    }
    getAudit(aircraftManufacturerId: number) {
        return this.aircraftManufacturerEndpoint.getAudit<any[]>(aircraftManufacturerId);
    }
    getServerPages(serverSidePagesData: any) {
        return Observable.forkJoin(
            this.aircraftManufacturerEndpoint.getAircraftManufacturerRecords<AircraftType[]>(serverSidePagesData));
    }

    getPageSerach(serverSidePagesData: any)
    {
        return Observable.forkJoin(
            this.aircraftManufacturerEndpoint.getAircraftManufacturerPages<AircraftType[]>(serverSidePagesData));
    }
}