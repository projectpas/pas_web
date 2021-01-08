export class Audit {
    areaName: string;
    memo: string;
    result: SingleScreenAuditDetails[];
}

export class SingleScreenAuditDetails {
   
    LastUpdatedBy: string;
    LastUpdatedTime: string;
    AuditChanges: AuditChanges[];
    ColumnsToAvoid: string[];
    Visible: Boolean;
}

export class AuditChanges {
    FieldFriendlyname: string;
    NewValue: string;
    OldValue: string;

}