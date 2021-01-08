import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class BinEndpoint extends EndpointFactory {
	 

	private readonly _binsUrl: string = "/api/BinComponent/Get";
	private readonly _actionsUrlNew: string = "/api/BinComponent/binPost";
	private readonly __managementShelfURL: string = "/api/BinComponent/GetManagementShelf";
	private readonly _actionsManagemetUrl: string = "/api/BinComponent/GetMangementBin"; //change
	private readonly _actionsUrlManagementPost: string = "/api/BinComponent/managementBinPost"; //change
	private readonly _actionsUrlNew1: string = "/api/BinComponent/GetAddress";
	private readonly _actionsUrlNew2: string = "/api/BinComponent/GetWarehouse";
	private readonly _actionsUrlNew3: string = "/api/BinComponent/GetLocations";
	private readonly _actionsUrlNew4: string = "/api/BinComponent/GetShelfs";
	private readonly _actionsUrlNew5: string = "/api/BinComponent/GetBins";
    private readonly _actionsUrlAuditHistory: string = "/api/BinComponent/ataauditHistoryById";

    private readonly getBinAuditById: string = "/api/BinComponent/audits";
	//private readonly _countryUrl: string = "/api/Site/GetcountryList";
	//private readonly _countryUrlNew: string = "api/Site/postCountryList";

 
	
	get binurl() { return this.configurations.baseUrl + this._binsUrl; }
	get actionsMangementBinUrl() { return this.configurations.baseUrl + this._actionsManagemetUrl; } //change

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getManagementShelfEndpoint<T>(shelfID: any): Observable<T> {
		let endpointUrl = `${this.__managementShelfURL}/${shelfID}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getManagementShelfEndpoint(shelfID));
			}));
	}

	//edit data ManagementSite Data Retrive based on location id
	getManagementBinEditEndpoint<T>(binId: number): Observable<T> {
		let endpointUrl = `${this._actionsManagemetUrl}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getManagementBinEditEndpoint(binId));
			}));
	}

	getnewManagementBinData<T>(userObject: any): Observable<T> {
		return this.http.post<any>(this._actionsUrlManagementPost, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getnewManagementBinData(userObject));
			}));
	}

	//Delete management Location Before Edit
	getDeleteManagementBinEndpoint<T>(binId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlManagementPost}/${binId}`;
		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteManagementBinEndpoint(binId));
			}));
	}


	getBinEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.binurl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getBinEndpoint());
			}));
	}

	getNewBinEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewBinEndpoint(userObject));
			}));
	}

	//getcountryListEndpoint<T>(): Observable<T> {

	//	return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
	//		.catch(error => {
	//			return this.handleError(error, () => this.getcountryListEndpoint());
	//		});
	//}

	getHistoryBinEndpoint<T>(binId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlAuditHistory}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryBinEndpoint(binId));
			}));
	}

	getEditBinEndpoint<T>(binId?: number): Observable<T> {
		let endpointUrl = binId ? `${this._actionsUrlNew}/${binId}` : this._actionsUrlNew;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getEditBinEndpoint(binId));
			}));
	}

	getUpdateBinEndpoint<T>(roleObject: any, binId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${binId}`;

		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateBinEndpoint(roleObject, binId));
			}));
	}

	getDeleteBinEndpoint<T>(binId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${binId}`;

		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteBinEndpoint(binId));
			}));
	}

	getAddressDataWarehouseEndpoint<T>(binId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew1}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getAddressDataWarehouseEndpoint(binId));
			}));
	}

	getWareHouseDataEndpoint<T>(binId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew2}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getWareHouseDataEndpoint(binId));
			}));
	}

    getWareHouseBySiteIdEndpoint<T>(siteId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew2}/${siteId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWareHouseBySiteIdEndpoint(siteId));
            }));
    }
	getLocationDataEndpoint<T>(binId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew3}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getLocationDataEndpoint(binId));
			}));
    }

    getLocationByWareHouseIdEndpoint<T>(wareHouseId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew3}/${wareHouseId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getLocationByWareHouseIdEndpoint(wareHouseId));
            }));
    }

	getShelfDataEndpoint<T>(binId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew4}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getShelfDataEndpoint(binId));
			}));
	}

    getShelfByLocationIdEndpoint<T>(locationId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew4}/${locationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShelfByLocationIdEndpoint(locationId));
            }));
    }

	getBinDataEndpoint<T>(binId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew5}/${binId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getShelfDataEndpoint(binId));
			}));
    }

    getBinByShelfIdEndpoint<T>(shelfId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew5}/${shelfId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getBinByShelfIdEndpoint(shelfId));
            }));
    }

    
    getBinAuditDataById<T>(binId: number): Observable<T> {
        let endpointUrl = `${this.getBinAuditById}/${binId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getBinAuditDataById(binId));
            }));
    }
}