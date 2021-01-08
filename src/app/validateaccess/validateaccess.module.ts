import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ValidateAccessDirective } from "../directive/validateaccess.directive";
import { AuthService } from "../services/auth.service";
import { ChangeButtonStatus } from "../directive/changebutton.directive";

@NgModule({
    declarations: [
        ValidateAccessDirective,
        ChangeButtonStatus
    ],

    imports: [
        CommonModule
    ],

    exports: [
        ValidateAccessDirective,
        ChangeButtonStatus
    ],

    providers: [
        AuthService
    ],

    bootstrap: [
    ],

})
export class ValidateAccessModule {

}