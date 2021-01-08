
import { MasterCompany } from './mastercompany.model';

export class Publication {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, docpath?: string, employee?: string, verifieddate?: Date,verifiedby?: string,revision?: string, location?: string,publishby?: string,ASD?: string, nextreviewDate?: string, revisionDate?: string,isActive?: boolean, publicationRecordId?: number, publicationId?: string, PartNumber?: string, Platform?: string, description?: string, Model?: string, ATAMain?: string, ATASubChapter?: string, ATAPositionZone?: string, IsActive?: boolean, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string, entryDate?: Date, pubType?: string) {
        this.publicationRecordId = publicationRecordId;
        this.publicationId = publicationId;
        this.pubType = pubType;
        this.PartNumber = PartNumber;
        this.description = description;
        this.isActive = isActive;
        this.Platform = Platform;
        this.Model = Model;
        this.ATAMain = ATAMain;
        this.ATASubChapter = ATASubChapter;
        this.ATAPositionZone = ATAPositionZone;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.entryDate = entryDate;
        this.updatedBy = updatedBy;
        this.IsActive = IsActive;
        this.masterCompany = masterCompany;
        this.memo = memo;
        this.revisionDate = revisionDate;
        this.nextreviewDate = nextreviewDate;
        this.ASD = ASD;
        this.publishby = publishby;
        this.location = location;
        this.revision = revision;
        this.verifiedby = verifiedby;
        this.verifieddate = verifieddate;
        this.employee = employee;
        this.docpath = docpath;
    }

    public publicationRecordId: number;
    public publicationId: string;
    public pubType: string;
    public isActive: boolean;
    public PartNumber: string;
    public description: string;
    public Platform: string;
    public Model: string;
    public ATAMain:string;
    public ATASubChapter:string;
    public ATAPositionZone:string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public entryDate: Date;
    public IsActive: boolean;
    public masterCompany?: MasterCompany;
    public memo: string;
    public revisionDate: string;
    public nextreviewDate: string;
    public ASD: string;
    public publishby: string;
    public location: string;
    public revision: string;
    public verifiedby: string;
    public verifieddate: Date;
    public employee: string;
    public docpath: string;


}