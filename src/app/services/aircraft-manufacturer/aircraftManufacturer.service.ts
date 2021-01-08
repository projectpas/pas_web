// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { AircraftManufacturerEndpointService } from './aircraftManufacturer-endpoint.service';
import { AircraftType } from '../../models/AircraftType.model';

@Injectable()
export class AircraftManufacturerService {

    constructor(private aircraftManufacturerEndpoint: AircraftManufacturerEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.aircraftManufacturerEndpoint.getAllAircraftManufacturer<AircraftType[]>());
    }

    getById(aircraftManufacturerId: number) {
        return forkJoin(
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
        return forkJoin(
            this.aircraftManufacturerEndpoint.getAircraftManufacturerRecords<AircraftType[]>(serverSidePagesData));
    }

    getPageSerach(serverSidePagesData: any)
    {
        return forkJoin(
            this.aircraftManufacturerEndpoint.getAircraftManufacturerPages<AircraftType[]>(serverSidePagesData));
    }
}