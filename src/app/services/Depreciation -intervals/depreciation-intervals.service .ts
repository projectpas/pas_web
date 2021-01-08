import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { DepreciationIntervalsEndpoint } from './depreciation-intervals-endpoint.service';
import { DepreciationIntervals } from '../../models/depriciationIntervals.model';
@Injectable()
export class DepreciationIntervalsService {

    constructor(private depreciationIntervalsEndpoint: DepreciationIntervalsEndpoint) {
    }

    getAll() {
        return Observable.forkJoin(
            this.depreciationIntervalsEndpoint.getAlldepreciationIntervals<any>());
    }

    getById(assetDepreciationIntervalTypeId: number) {
        return Observable.forkJoin(
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