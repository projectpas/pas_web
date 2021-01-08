// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================


import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { NodeSetupEndpointService } from './nodeSetup-endpoint.service';
import { GLAccountNodeSetup } from '../../models/node-setup.model';

@Injectable()
export class NodeSetupService {

    constructor(private nodeSetupEndpoint: NodeSetupEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.nodeSetupEndpoint.getAllNodesSetup<GLAccountNodeSetup[]>());
    }

    getById(nodeId: number) {
        return forkJoin(
            this.nodeSetupEndpoint.getNodeSetupById<GLAccountNodeSetup>(nodeId)
        );
    }
    getShareWithOtherEntitysData(nodeId: number) {
        return forkJoin(
            this.nodeSetupEndpoint.getShareWithOtherEntitysDataEndPoint<any>(nodeId)
        );
    }

    add(assetStatus) {
        return this.nodeSetupEndpoint.addNode<GLAccountNodeSetup>(assetStatus);
    }
    addGLAccountNodeShareWithEntityMapper(data: any) {
        return this.nodeSetupEndpoint.addGLAccountNodeShareWithEntityMapper<any>(data);
    }

    update(assetStatus) {
        return this.nodeSetupEndpoint.updateNode<GLAccountNodeSetup>(assetStatus);
    }

    remove(nodeId: number) {
        return this.nodeSetupEndpoint.removeNodeById(nodeId);
    }

    removeNodeShareEntityMapper(nodeId: number) {
        return this.nodeSetupEndpoint.removeNodeShareEntityMapper(nodeId);
    }

}