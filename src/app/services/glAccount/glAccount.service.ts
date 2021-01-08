
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { GlAccountEndpointService } from './glAccount-endpoint.service';
import { GlAccount } from '../../models/GlAccount.model';

@Injectable()
export class GlAccountService {

    glAccountEditCollection: any;
    constructor(private glAccountEndpoint: GlAccountEndpointService) {
    }

    getAll() {
        return Observable.forkJoin(
            this.glAccountEndpoint.getAllGlAccounts<GlAccount[]>());
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
        return Observable.forkJoin(
            this.glAccountEndpoint.getMiscData<GlAccount[]>());
    }    
    updatestatusactive(id,status, userName)
    {
        return this.glAccountEndpoint.updatestatusactive(id,status, userName);
    }
    deleteRestoreGL(id,status, userName)
    {
        return this.glAccountEndpoint.deleteRestoreGL(id,status, userName);
    }

    getglAccountList(serverSidePagesData: any) {
    return this.glAccountEndpoint.getglAccountList(serverSidePagesData);
    }
    getHistory(id) {
        return this.glAccountEndpoint.getHistory(id);
    }   
   
    getById(glAccountId) {       
       return this.glAccountEndpoint.getGlAccountById(glAccountId);        
    }       
    

  

    //deleteAssetType(glAccountId: number) {

    //    return this.glAccountEndpoint.removeGlAccountById(glAccountId);

    //}
}