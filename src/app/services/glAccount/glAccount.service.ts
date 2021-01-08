
import { Injectable } from '@angular/core';
import { Observable,forkJoin } from 'rxjs';



import { GlAccountEndpointService } from './glAccount-endpoint.service';
import { GlAccount } from '../../models/GlAccount.model';

@Injectable()
export class GlAccountService {

    glAccountEditCollection: any;
    constructor(private glAccountEndpoint: GlAccountEndpointService) {
    }

    getAll() {
        return forkJoin(
            this.glAccountEndpoint.getAllGlAccounts<GlAccount[]>());
    }

    getById(glAccountId: number) {
        return forkJoin(
            this.glAccountEndpoint.getGlAccountById<GlAccount>(glAccountId)
        );
    }

    add(glAccount: any) {
     //   alert(JSON.stringify(glAccount));
        return this.glAccountEndpoint.addGlAccount<any>(glAccount);
    }

    update(glAccount: GlAccount) {
        return this.glAccountEndpoint.updateGlAccount<GlAccount>(glAccount);
    }

    remove(glAccountId: number) {
        return this.glAccountEndpoint.removeGlAccountById(glAccountId);
    }
    getMiscdata() {
        return forkJoin(
            this.glAccountEndpoint.getMiscData<GlAccount[]>());
    }
    search1(serverSidePagesData: any) {
    return forkJoin(
        this.glAccountEndpoint.glAccountEndpoint<any[]>(serverSidePagesData));

}


    //deleteAssetType(glAccountId: number) {

    //    return this.glAccountEndpoint.removeGlAccountById(glAccountId);

    //}
}