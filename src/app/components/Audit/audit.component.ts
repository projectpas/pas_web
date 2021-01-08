import { OnInit, Component, Input } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { SingleScreenAuditDetails, AuditChanges, Audit } from "../../models/single-screen-audit-details.model";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})

export class AuditComponent implements OnInit{

    @Input() Data: any[];
    @Input() Modal: NgbModalRef;
    AuditDetails: Audit[];

    ngOnInit(): void {
        this.AuditDetails = [];
        this.AuditDetails = this.extractAuditChangedValues(this.Data);
    }

    ToggleChangedPropertiesSection(SingleScreenAudit: SingleScreenAuditDetails): void {
        SingleScreenAudit.Visible = !SingleScreenAudit.Visible;
    }

    dismissModel(): void {
        if (this.Modal != undefined) {
            this.Modal.close();
        }
    }

    extractAuditChangedValues(audits: any[]): Audit[] {
        var auditList = [];
        var index = 1;
        audits.forEach(function (auditResult) {
            var auditData = new Audit();
            auditData.areaName = auditResult.areaName;
            auditData.result = [];

            auditResult.result.forEach(function (audit) {
                var singleScreenAudit = new SingleScreenAuditDetails();
                singleScreenAudit.LastUpdatedTime = audit.updatedDate.toString();
                singleScreenAudit.LastUpdatedBy = audit.updatedBy != undefined ? audit.updatedBy : "admin";
                singleScreenAudit.AuditChanges = [];
                singleScreenAudit.Visible = false;
                var properties = Object.keys(audit);
                properties.forEach(function (property) {
                    if (audit[property] != null && auditResult.ColumnsToAvoid.indexOf(property) == -1) {
                        var auditChanges = new AuditChanges();
                        auditChanges.FieldFriendlyname = property;
                        auditChanges.NewValue = audit[property];

                        if (index < audits.length) {
                            var oldValueAudit = audits.slice(index, audits.length).filter(function (o) {
                                return o[property] != null;
                            })[0];
                            auditChanges.OldValue = oldValueAudit != undefined ? oldValueAudit[property] : "-";
                        }
                        else {
                            auditChanges.OldValue = "-";
                        }

                        singleScreenAudit.AuditChanges.push(auditChanges);
                    }
                });
                auditData.result.push(singleScreenAudit);
                index += 1;
            });
            auditList.push(auditData);
        });
   
        return auditList;
    }

}