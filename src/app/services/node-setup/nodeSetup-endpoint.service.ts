import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { GLAccountNodeSetup } from '../../models/node-setup.model';

@Injectable()
export class NodeSetupEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/nodesetup/getAll";
    private readonly getByIdURL: string = "/api/nodesetup/getById";
    private readonly shareWithOtherEntityByIdURL: string = "/api/nodesetup/shareWithOtherEntityById";
    private readonly addURL: string = "/api/nodesetup/add";
    private readonly updateURL: string = "/api/nodesetup/update";
    private readonly removeByIdURL: string = "/api/nodesetup/removeById";
    private readonly removeByIdMapperURL: string = "/api/StockLine/removeMapperById";
    private readonly addEntityMapperURL: string = "/api/nodesetup/addEntityMapper";



    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get shareWithOtherEntityById() { return this.configurations.baseUrl + this.shareWithOtherEntityByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }
    get removeMapperById() { return this.configurations.baseUrl + this.removeByIdMapperURL; }
    get addEntityMapper() { return this.configurations.baseUrl + this.addEntityMapperURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllNodesSetup<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllNodesSetup());
            });
    }

    getNodeSetupById<T>(nodeId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${nodeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNodeSetupById(nodeId));
            });
    }

    getShareWithOtherEntitysDataEndPoint<T>(nodeId: number): Observable<T> {
        let endpointUrl = `${this.shareWithOtherEntityById}/${nodeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getShareWithOtherEntitysDataEndPoint(nodeId));
            });
    }

    addNode<T>(node: any): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(node), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addNode(node));
            });
    }

    addGLAccountNodeShareWithEntityMapper<T>(data: any): Observable<T> {
        let endpointUrl = this.addEntityMapper;

        return this.http.post<T>(endpointUrl, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addNode(data));
            });
    }

    updateNode<T>(node: GLAccountNodeSetup): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(node), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateNode(node));
            });
    }

    removeNodeById<T>(nodeId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${nodeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeNodeById(nodeId));
            });
    }

    removeNodeShareEntityMapper<T>(nodeId: number): Observable<T> {
        let endpointUrl = `${this.removeMapperById}/${nodeId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeNodeShareEntityMapper(nodeId));
            });
    }

    getHistory(GLAccountNodeId : number) {        
        return this.http.get<any>(`${this.configurations.baseUrl}/api/nodesetup/nodeshistory?id=${GLAccountNodeId}`)
        .catch(error => {
          return this.handleError(error, () => this.getHistory(GLAccountNodeId));
        }); 
      }


}