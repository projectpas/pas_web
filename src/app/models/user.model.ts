// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

export class User
{
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id?: string, userName?: string, fullName?: string, email?: string, jobTitle?: string, phoneNumber?: string, roles?: string[],employeeId?:number, managementStructureId?: number, masterCompanyId?: number, legalEntityId?: number)
    {

        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.employeeId = employeeId;
        this.managementStructureId = managementStructureId; 
        this.masterCompanyId = masterCompanyId; 
        this.legalEntityId = legalEntityId; 
    }

    get friendlyName(): string
    {
        let name = this.fullName || this.userName;

        if (this.jobTitle)
            name = this.jobTitle + " " + name;

        return name;
    }


    public id: string;
    public userName: string;
    public fullName: string;
    public email: string;
    public jobTitle: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles: string[];
    public employeeId : number;
    public managementStructureId: number;
    public masterCompanyId: number;
    public legalEntityId: number;
    public isResetPassword:string;
    public roleName:string;
    public permissionName:string;
    public roleID:string;
}