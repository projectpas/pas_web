// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

export class UserLogin
{
    constructor(userName?: string, password?: string, rememberMe?: boolean,masterCompanyId?:number)
    {
        this.userName = userName;
        this.password = password;
        this.rememberMe = rememberMe;
        this.masterCompanyId=masterCompanyId;
    }

    userName: string;
    password: string;
    rememberMe: boolean;
    masterCompanyId:number;
}