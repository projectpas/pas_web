import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { DepreciationIntervalsEndpoint } from './depreciation-intervals-endpoint.service';
import { DepreciationIntervals } from '../../models/depriciationIntervals.model';
@Injectable()
export class DepreciationIntervalsService {

    constructor(private depreciationIntervalsEndpoint: DepreciationIntervalsEndpoint) {
    }

    getAll() {
        return forkJoin(
            this.depreciationIntervalsEndpoint.getAlldepreciationIntervals<any>());
    }

    getById(assetDepreciationIntervalTypeId: number) {
        return forkJoin(
            this.depreciationIntervalsEndpoint.getdepreciationIntervalById<DepreciationIntervals>(assetDepreciationIntervalTypeId)
        );
    }

    add(depreciationIntervals: DepreciationIntervals) {
        return this.depreciationIntervalsEndpoint.adddepreciationInterval<DepreciationIntervals>(depreciationIntervals);
    }

    update(depreciationIntervals: DepreciationIntervals) {
        return this.depreciationIntervalsEndpoint.updatedepreciationInterval<DepreciationIntervals>(depreciationIntervals);
    }

    remove(assetDepreciationIntervalTypeId: number) {
        return this.depreciationIntervalsEndpoint.removedepreciationIntervalById(assetDepreciationIntervalTypeId);
    }

    getAudit(assetDepreciationIntervalId: number) {
        return this.depreciationIntervalsEndpoint.getAudit<any[]>(assetDepreciationIntervalId);
    }

    DepIntervalCustomUpload(file) {
        return this.depreciationIntervalsEndpoint.DepIntervalCustomUpload(file);
    }
}