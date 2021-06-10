import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { Utilities } from 'src/app/services/utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements OnInit {
  form1: FormGroup; 
  updatePasswordForm=new FormGroup({
    newpassword: new FormControl('newpassword', Validators.minLength(8)),
    confpassword: new FormControl('confpassword', Validators.minLength(1)),
});
  constructor(fb: FormBuilder,private authService:AuthService,
    private employeeService:EmployeeService,
    private alertService:AlertService,
    private router:Router){
    this.updatePasswordForm = fb.group({
      'newpassword': [null, Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')])],
      'confpassword': [null, Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')])],
      'currentpassword': [null, Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')])],
  },{
    validators:this.ConfirmedValidator('newpassword','confpassword')
  });
  }

  ngOnInit() {
    this.updatePasswordForm.setValue({
      newpassword: '',
      confpassword: '',
      currentpassword:''
    });
  }
  get currentpassword(){
    return this.updatePasswordForm.get('currentpassword');
  }

  get newpassword(){
    return this.updatePasswordForm.get('newpassword');
  }

   get confpassword(){
    return this.updatePasswordForm.get('confpassword');
  }

  UpdatePassword(){
    var currentpassword=this.updatePasswordForm.value.currentpassword;
    var password=this.updatePasswordForm.value.newpassword;
    var employeeId=this.authService.currentUser.employeeId;
    console.log(this.authService.currentUser.employeeId);
    var data ={
      password:password,
      employeeId:employeeId
    };    
    this.alertService.startLoadingMessage();
    this.employeeService.updateEmployeePassword(password,employeeId,currentpassword).subscribe(res=>{
      this.alertService.stopLoadingMessage();
      this.alertService.showMessage("Update Password", `Password Updated Successfully`, MessageSeverity.success);
      this.authService.logout();
      this.router.navigateByUrl('/Login');
    },
      error=>{
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", `Unable to update password.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);

      });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
    } 
  }

}
