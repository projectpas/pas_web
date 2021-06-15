import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { environment } from '../../environments/environment';

@Injectable()
export class EmployeeEndpoint extends EndpointFactory {
	private readonly _actionsUrl: string = "/api/Employee/Get";
	private readonly _employeeCommonDatatUrl: string = "/api/Employee/empcommondata"
	private readonly _actionsNameUrl: string = "/api/employee/GetAllEmployeeNames";
	private readonly _getView: string = "/api/Employee/GetforView";
	private readonly _rolesUrl: string = "/api/Employee/RolesGet";
	private readonly _userRolelevelList: string = "/api/Employee/UserRolelevelList";
	private readonly _shiftUrl: string = "/api/Employee/shiftGet";
	private readonly _CountriesUrl: string = "/api/Employee/CountriesGet";
	private readonly _EmployeeLeaveTypeUrl: string = "/api/Employee/EmployeeLeaveTypeGet";
	private readonly _EmployeeTrainingTypeUrl: string = "/api/Employee/GetEmployeeTrainingType";
	private readonly _actionsUrlNew: string = "/api/Employee/employeepost";
	private readonly _actionsUrlNewUpdate: string = "/api/Employee/employeelistgpost";
	private readonly _certificationUrlNew: string = "/api/Employee/getemployeecertification";
	private readonly _actionsUrlLeaveTypeMap: string = "/api/Employee/employeepostAddLeaveType";
	private readonly _actionsUrlLeaveTypeMapRemove: string = "/api/Employee/employeepostRemoveLeaveType";
	private readonly _actionsUrlShiftTypeMapRemove: string = "/api/Employee/employeepostRemoveShiftType";
	private readonly _actionsUrlShiftTypeMap: string = "/api/Employee/employeepostAddShiftType";
	private readonly _trainUrlNew: string = "/api/Employee/EmpTrainingGet";
	private readonly _trainingTypeUrlNew: string = "/api/Employee/empTrainingTypesGet";
	private readonly _actionsUrlAuditHistory: string = "/api/Employee/auditHistoryById";
	private readonly _certifiUrlNew: string = "/api/Employee/employeecertifi";
	private readonly _addRolesData: string = "/api/Employee/AddRolesData";
	private readonly _trainingUrlNew: string = "/api/Employee/employeetraingpost";
	private readonly _employeeUpdateUrl: string = "/api/Employee/employeelistgpost";
	private readonly _certifiUpdateUrl: string = "/api/Employee/certifilistgpost";
	private readonly _trainingUpdateUrl: string = "/api/Employee/traininglistgpost";
	private readonly _updateActiveInactive: string = "/api/Employee/employeeUpdateforActive";
	private readonly _deleteRoleById: string = "/api/Employee/DeleteRoleById";
	private readonly _getMultipleShiftvaluesUrl: string = "/api/Employee/multiShiftValuesGet";
	private readonly _aircraftTypeUrl: string = "/api/Employee/aircraftTypeGet";
	private readonly _getLeaveListUrl: string = "/api/Employee/leaveListGet";
	private readonly _newLeavesUrlNew: string = "/api/Employee/newLeavepost";
	private readonly _multishiftsdataUrl: string = "/api/Employee/saveShifts";
	private readonly _getemployeeshifturl: string = "/api/Employee/getshiftdata";
	private readonly _getemployeeLeaveurl: string = "/api/Employee/getleavelistdata";
	private readonly _multileavesurl: string = "/api/Employee/savemultileavetypes";
	private readonly _shiftsurl: string = "/api/Employee/saveShifts";
	private readonly _getMultiLeaveListUrl: string = "/api/Employee/GetLeaveData";
	private readonly _getAllEmployeeInfoURL: string = "/api/Employee/GetAllEmployeeInfo";
	private readonly _getEmpTrainingInfo: string = "/api/Employee/EmpTrainingGet";
	private readonly _getEmpDataByid: string = "/api/Employee/employeedata";
	private readonly _getAllEmployeeRoles: string = "/api/userrolepermission/getAllUserRole";
	private readonly _getStoreEmployeeRolesUrl: string = "/api/Employee/employeeroles";
	private readonly _getEmployeeRolesUrl: string = "/api/Employee/getEmployeeRoles";
	private readonly _getStoreEmployeeManagementStructure: string = "/api/Employee/employeeManagementStructure";
	private readonly _getEmployeeManagementStructure: string = "/api/Employee/getemployeeManagementStructure";
	private readonly _getEmployeeAuditHistoryByEmpId: string = "/api/Employee/GetEmployeeAuditHistory";
	private readonly _actionsUrlEmployeeMemoUpdate: string = "/api/Employee/employeeupdatememo";
	private readonly _addEmployeeTrainingFileUpload: string = "/api/Employee/employeeDocumentUpload";
	private readonly _getEmployeeDetailsByEmpId: string = "/api/Employee/employeeDetailsById";
	private readonly _employeeListsUrl: string = "/api/Employee/employeelist";
	private readonly _employeeTotallistUrl: string = "/api/Employee/exportemployeelist";
	private readonly _employeeUpdatePasswordUrl: string = environment.baseUrl + "/api/Employee/updateemployeepassword";
	private readonly _employeeGlobalSrchUrl: string = "/api/Employee/employeeglobalsearch";
	private readonly _forgotpasswordUrl: string = "/api/employee/forgotpassword";
	private readonly _resetpasswordUrl: string = "/api/employee/resetpassword";

	get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
	get getEmployeeCommonDataUrl() { return this.configurations.baseUrl + this._employeeCommonDatatUrl; }
	//get actionsNameUrl() { return environment.baseUrl + this._actionsNameUrl; }
	get actionsNameUrl() { return this.configurations.baseUrl + this._actionsNameUrl; }
	get getView() { return this.configurations.baseUrl + this._getView; }
	get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
	get userrolevelList() { return this.configurations.baseUrl + this._userRolelevelList; }
	get getshiftUrl() { return this.configurations.baseUrl + this._shiftUrl; }
	get getCountriesUrl() { return this.configurations.baseUrl + this._CountriesUrl; }
	get getEmployeeLeaveTypeUrl() { return this.configurations.baseUrl + this._EmployeeLeaveTypeUrl; }
	get getEmployeeTrainingTypeUrl() { return this.configurations.baseUrl + this._EmployeeTrainingTypeUrl; }
	get certificationUrlNew() { return this.configurations.baseUrl + this._certificationUrlNew; }
	get trainUrlNew() { return this.configurations.baseUrl + this._trainUrlNew; }
	get trainingTypeUrlNew() { return this.configurations.baseUrl + this._trainingTypeUrlNew; }
	//get certifiUrlNew() { return this.configurations.baseUrl + this._certifiUrlNew; }
	// get trainingUrlNew() { return this.configurations.baseUrl + this._trainingUrlNew; }
	get getShiftvaluesUrl() { return this.configurations.baseUrl + this._getMultipleShiftvaluesUrl; }
	get getAircraftTypeUrl() { return this.configurations.baseUrl + this._aircraftTypeUrl; }
	get getleaveListUrl() { return this.configurations.baseUrl + this._getLeaveListUrl; }
	get getemployeeshiftsListUrl() { return this.configurations.baseUrl + this._getemployeeshifturl; }
	get getemployeeleaveListUrl() { return this.configurations.baseUrl + this._getemployeeLeaveurl; }
	get getLeavesListUrl() { return this.configurations.baseUrl + this._getMultiLeaveListUrl; }
	get getEmpDataByid() { return this.configurations.baseUrl + this._getEmpDataByid; }
	get getAllEmployeeRoles() { return `${this.configurations.baseUrl}${this._getAllEmployeeRoles}` }
	get getStoreEmployeeRolesUrl() { return `${this.configurations.baseUrl}${this._getStoreEmployeeRolesUrl}` }
	get getEmployeeRolesUrl() { return `${this.configurations.baseUrl}${this._getEmployeeRolesUrl}` }
	get getStoreEmployeeManagementStructure() { return `${this.configurations.baseUrl}${this._getStoreEmployeeManagementStructure}` }
	get getEmployeeManagementStructure() { return `${this.configurations.baseUrl}${this._getEmployeeManagementStructure}` }
	get employeeListUrl() { return this.configurations.baseUrl + this._employeeListsUrl; }
	get employeeGlobalSearchUrl() { return this.configurations.baseUrl + this._employeeGlobalSrchUrl; }
	get deleteemployee() { return this.configurations.baseUrl + this._actionsUrlNew; }
	get createnewemployee() { return this.configurations.baseUrl + this._actionsUrlNew; }
	get createnewemployeeCerti() { return this.configurations.baseUrl + this._certifiUrlNew; }
	get createnewemployeetrining() { return this.configurations.baseUrl + this._trainingUrlNew; }
	get forgotpasswordUrl() { return this.configurations.baseUrl + this._forgotpasswordUrl; }
	get resetpasswordUrl() { return this.configurations.baseUrl + this._resetpasswordUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}

	getEmployeeEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getEmployeeCommonEndpoint<T>(managementStructureId): Observable<T> {
		let endpointUrl = `${this.getEmployeeCommonDataUrl}/${managementStructureId}`
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeCommonEndpoint(managementStructureId));
			});
	}

	getEmployeeNamesEndpoint<T>(mastercompanyId): Observable<T> {
		let actionsNameUrl = `${this.actionsNameUrl}/${mastercompanyId}`;
		return this.http.get<T>(actionsNameUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeNamesEndpoint(mastercompanyId));
			});
	}

	getEmployeeEndpointforView<T>(employeeId): Observable<T> {
		let endpointUrl = `${this.getView}/${employeeId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getEmployeeCertifications<T>(employeeId): Observable<T> {
		let endpointUrl = `${this._certificationUrlNew}/${employeeId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getNewLeaveEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._newLeavesUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewLeaveEndpoint(userObject));
			});
	}

	employeeLeavetypeAdd<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._actionsUrlLeaveTypeMap, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewEmployeeEndpoint(userObject));
			});
	}

	employeeLeavetypeRemove<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._actionsUrlLeaveTypeMapRemove, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewEmployeeEndpoint(userObject));
			});
	}

	employeeshifttypeRemove<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._actionsUrlShiftTypeMapRemove, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewEmployeeEndpoint(userObject));
			});
	}

	employeeShifttypeAdd<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._actionsUrlShiftTypeMap, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewEmployeeEndpoint(userObject));
			});
	}

	getRolesSetupEntityData<T>(): Observable<T> {
		return this.http.get<T>(this.rolesUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getUserRolelevelList<T>(): Observable<T> {
		return this.http.get<T>(this.userrolevelList, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getshiftEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.getshiftUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getCountriesEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.getCountriesUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getEmployeeLeaveTypeEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.getEmployeeLeaveTypeUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getEmployeeTrainingTypeEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.getEmployeeTrainingTypeUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getNewEmployeeEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this.createnewemployee, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewEmployeeEndpoint(userObject));
			});
	}

	getNewCertification<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this.createnewemployeeCerti, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewCertification(userObject));
			});
	}

	addRolesData<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._addRolesData, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.addRolesData(userObject));
			});
	}

	deleteRoleData<T>(userObject: any): Observable<T> {
		let endpointUrl = `${this._deleteRoleById}/${userObject}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.deleteRoleData(userObject));
			});
	}

	getNewTrainingEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this.createnewemployeetrining, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewTrainingEndpoint(userObject));
			});
	}

	//getCerEmployeeEndpoint<T>(employeeLicensureId: any): Observable<T> {
	//    return this.http.post<T>(this._certificationUrlNew, JSON.stringify(employeeLicensureId), this.getRequestHeaders())
	//        .catch(error => {
	//            return this.handleError(error, () => this.getCerEmployeeEndpoint(employeeLicensureId));
	//        });
	//}

	getCerEmployeeEndpoint<T>(employeeLicensureId: any): Observable<T> {
		let endpointurl = `${this.certificationUrlNew}/${employeeLicensureId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getTrainEmployeeEndpoint<T>(employeeTrainingId: any): Observable<T> {
		let endpointurl = `${this.trainUrlNew}/${employeeTrainingId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getTrainingType<T>(): Observable<T> {
		return this.http.get<T>(this.trainingTypeUrlNew, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getHistoryEmployeeEndpoint<T>(employeeId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlAuditHistory}/${employeeId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getHistoryEmployeeEndpoint(employeeId));
			});
	}

	getEditEmployeeEndpoint<T>(employeeId?: number): Observable<T> {
		let endpointUrl = employeeId ? `${this._actionsUrlNew}/${employeeId}` : this._actionsUrlNew;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEditEmployeeEndpoint(employeeId));
			});
	}

	getUpdateEmployeeEndpoint<T>(roleObject: any, employeeId: number): Observable<T> {
		let endpointUrl = this.configurations.baseUrl + `${this._actionsUrlNewUpdate}/${employeeId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getUpdateEmployeeEndpoint(roleObject, employeeId));
			});
	}

	updateEmployeeListDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._employeeUpdateUrl}/${roleObject.employeeId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateEmployeeListDetails(roleObject));
			});
	}

	updateCertificationListDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = this.configurations.baseUrl + `${this._certifiUpdateUrl}/${roleObject.employeeCertificationId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateCertificationListDetails(roleObject));
			});
	}

	updateTrainingListDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = this.configurations.baseUrl + `${this._trainingUpdateUrl}/${roleObject.employeeTrainingId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateTrainingListDetails(roleObject));
			});
	}

	getDeleteEmployeeEndpoint<T>(employye: any): Observable<T> {
		let endpointUrl = `${this.deleteemployee}/${employye.employeeId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(employye), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getDeleteEmployeeEndpoint(employye));
			});
	}

	getUpdatecustomerEndpointforActive<T>(roleObject: any, employeeId: number): Observable<T> {
		let endpointUrl = this.configurations.baseUrl + `${this._updateActiveInactive}/${roleObject.employeeId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getUpdatecustomerEndpoint(roleObject, employeeId));
			});
	}

	getUpdatecustomerEndpoint<T>(roleObject: any, employeeId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${roleObject.employeeId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getUpdatecustomerEndpoint(roleObject, employeeId));
			});
	}

	getEmployeeShiftEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this._actionsUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getemployeeshiftsList<T>(action: any): Observable<T> {
		let url = `${this.getemployeeshiftsListUrl}/${action}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getemployeeshiftsList(action));
			});
	}

	getShifts<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._shiftsurl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getShifts(userObject));
			});
	}

	getMultileaves<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._multileavesurl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getMultileaves(userObject));
			});
	}

	getAllRolesOfEmployee<T>(masterCompanyId): Observable<T> {
		let endPointURL = `${this.getAllEmployeeRoles}/${masterCompanyId !== undefined ? masterCompanyId : 1}`;
		return this.http.get<T>(endPointURL, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getAllRolesOfEmployee(masterCompanyId));
			});
	}

	getleavedata<T>(employeeId: any): Observable<T> {
		let url = `${this.getLeavesListUrl}/${employeeId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getleavedata(employeeId));
			});
	}

	getAllEmployeesInfo<T>(): Observable<T> {
		let endPointURL = this._getAllEmployeeInfoURL;
		return this.http.get<T>(endPointURL, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getAllEmployeesInfo());
			});
	}

	getEmployeeDataById<T>(employeeId): Observable<T> {
		let endpointUrl = `${this._getEmpDataByid}/${employeeId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeDataById(employeeId));
			});
	}

	storeEmployeeRoles<T>(data): Observable<T> {
		return this.http.post<T>(this.getStoreEmployeeRolesUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getMultileaves(data));
			});
	}
	//get all employee list
	getAllEmployeeList(data) {
		return this.http.post(this.employeeListUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getAllEmployeeList(data));
			});
	}
	// employee global search
	//employeeListGlobalSearch(data) {
	//	return this.http.get<any>(`${this.configurations.baseUrl}/api/Employee/employeeglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
	//}
	employeeListGlobalSearch(data) {
		return this.http.post(this.employeeGlobalSearchUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.employeeListGlobalSearch(data));
			});
	}

	storeEmployeeManagementStructure<T>(data): Observable<T> {
		return this.http.post<T>(this.getStoreEmployeeManagementStructure, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getMultileaves(data));
			});
	}

	getEmployeeRoles<T>(empId: any): Observable<T> {
		return this.http.get<T>(`${this.getEmployeeRolesUrl}?employeeId=${empId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getStoredEmployeeManagementStructure<T>(employeeId): Observable<T> {
		return this.http.get<T>(`${this.getEmployeeManagementStructure}?employeeId=${employeeId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeEndpoint());
			});
	}

	getEmployeeAuditDetailsEndPoint<T>(employeeId): Observable<T> {
		return this.http.get<T>(this.configurations.baseUrl + `${this._getEmployeeAuditHistoryByEmpId}/${employeeId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeAuditDetailsEndPoint(employeeId));
			});
	}

	getEmployeeUpdateMemoEndpoint<T>(employeeId: number, memo: any): Observable<T> {
		let endpointUrl = this.configurations.baseUrl + `${this._actionsUrlEmployeeMemoUpdate}?employyeId=${employeeId}&memo=${memo}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeUpdateMemoEndpoint(employeeId, memo));
			});
	}

	// uploadEmployeeTrainingDocEndpoint<T>(file: any): Observable<T> {
	// 	const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
	// 	return this.http.post<T>(`${this._addEmployeeTrainingFileUpload}`, file);
	// }

	toGetEmployeeDetailsByEmpIdEndPoint<T>(employeeId): Observable<T> {
		return this.http.get<T>(this.configurations.baseUrl + `${this._getEmployeeDetailsByEmpId}/${employeeId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getEmployeeAuditDetailsEndPoint(employeeId));
			});
	}

	downloadAllEmployeeList<T>(employeeId): Observable<T> {
		let url = this.configurations.baseUrl + this._employeeTotallistUrl;
		return this.http.post<T>(url, employeeId, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.downloadAllEmployeeList(employeeId));
			});
	}

	getUpdateEmployeePasswordEndpoint<T>(password, employeeId, currentpassword): Observable<T> {
		let url = this._employeeUpdatePasswordUrl;
		var data = {
			"currentpassword": currentpassword,
			"password": password,
			"employeeId": employeeId
		}
		return this.http.post<T>(url, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getUpdateEmployeePasswordEndpoint(password, employeeId, currentpassword));
			});
	}

	forgotPasswordEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this.forgotpasswordUrl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.forgotPasswordEndpoint(userObject));
			});
	}

	resetPasswordEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this.resetpasswordUrl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.resetPasswordEndpoint(userObject));
			});
	}
}