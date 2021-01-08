
import { MasterCompany } from './mastercompany.model';

export class EmployeeLeaveType {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(employeeLeaveTypeId?: number, description?: string, isActive?: boolean
		) {
		this.employeeLeaveTypeId = employeeLeaveTypeId;
		this.description = description;
        this.isActive = isActive;
		
	}

	public employeeLeaveTypeId : number;
	public description: string;
	public isActive: boolean;
	


}