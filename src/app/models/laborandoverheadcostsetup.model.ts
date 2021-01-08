import { MasterCompany } from './mastercompany.model';

export class Laborandoverheadcostsetup {
	glaccountclassname: string;


	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, LaborOverloadCostId?: number, AVERAGERATEOFALLTECHNICIANMECHANIC?: string, UseIndTechLaborRate?: boolean, AsPercentOFTECHNICIANMECHANICHOURLYRATE?: string, UseAvgRateOfAllTech?: boolean, FlatAmtPerHour?: boolean, FLATAMOUNTPERWORKORDER?: string, FLATAMOUNTPERHOUR?: string, FlatAmtPerWO?: boolean, masterCompanyId?: number, AssignHoursBySpecificAction?: boolean, AssignTotalHoursToWO?: boolean, AsPercentOfTechHourlyRate?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

		this.LaborOverloadCostId = LaborOverloadCostId;
		this.UseIndTechLaborRate = UseIndTechLaborRate;
		this.UseAvgRateOfAllTech = UseAvgRateOfAllTech;
		this.AssignHoursBySpecificAction = AssignHoursBySpecificAction;
		this.AssignTotalHoursToWO = AssignTotalHoursToWO;
		this.AsPercentOfTechHourlyRate = AsPercentOfTechHourlyRate;
		this.FlatAmtPerHour = FlatAmtPerHour;
		this.FlatAmtPerWO = FlatAmtPerWO;
		this.masterCompanyId = masterCompanyId;
		this.FLATAMOUNTPERWORKORDER = FLATAMOUNTPERWORKORDER;
		this.FLATAMOUNTPERHOUR = FLATAMOUNTPERHOUR;
		this.AsPercentOFTECHNICIANMECHANICHOURLYRATE = AsPercentOFTECHNICIANMECHANICHOURLYRATE;
		this.AVERAGERATEOFALLTECHNICIANMECHANIC = AVERAGERATEOFALLTECHNICIANMECHANIC;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;

	}

	public LaborOverloadCostId: number;
	public UseIndTechLaborRate: boolean;
	public masterCompanyId: number;
	public UseAvgRateOfAllTech: boolean;
	public AssignHoursBySpecificAction: boolean;
	public AssignTotalHoursToWO: boolean;
	public AsPercentOfTechHourlyRate: number;
	public FlatAmtPerHour: boolean;
	public FlatAmtPerWO: boolean;
	public FLATAMOUNTPERWORKORDER: string;
	public AsPercentOFTECHNICIANMECHANICHOURLYRATE: string;
	public AVERAGERATEOFALLTECHNICIANMECHANIC: string;
	public createdBy: string;
	public FLATAMOUNTPERHOUR: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;




}