import { OnInit, Component, Input } from "@angular/core";
import { fadeInOut } from "../../../services/animations";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-site-audit-no-history",
  templateUrl: "./app-site-audit-no-history.component.html",
  styleUrls: [],
  animations: [fadeInOut]
})
export class AppSiteAuditNoHistoryComponent implements OnInit {
  @Input() Title: string;
  @Input() Modal: NgbModalRef;
  ngOnInit(): void {}

  dismissModel(): void {
    if (this.Modal != undefined) {
      this.Modal.close();
    }
  }
}
