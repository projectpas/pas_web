import { Input, Directive, ElementRef } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../components/user-role/ModuleHierarchyMaster.model";

@Directive({
    selector: '[validate]'
})
export class ValidateAccessDirective {
    @Input()
    validate: string;

    @Input()
    moduleName: string;

    @Input()
    requirePermission: string;

    element: ElementRef

    constructor(_element: ElementRef,private authService: AuthService) {
        this.element = _element;
    }

    ngAfterContentInit() {
        var result = this.authService.isPermissibleAction(this.moduleName, this.requirePermission);
        if (!result) {
            this.element.nativeElement.style.display = "none";
        }
        // contentChildren is set
    }

}