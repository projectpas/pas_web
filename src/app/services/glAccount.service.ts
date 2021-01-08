import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';



import { GLAccountEndpoint } from './glAccount-endpoint.service';



@Injectable()
export class GLAccountService {
    constructor(
        private router: Router,
        private http: HttpClient,
       	private glAccountEndPoint: GLAccountEndpoint) { let currentUrl = this.router.url; }
    getGlAccountBasic() {
		return forkJoin(
			this.glAccountEndPoint.getGLAccountBasicList<any[]>());
	}
}