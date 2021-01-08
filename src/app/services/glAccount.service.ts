import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { GLAccountEndpoint } from './glAccount-endpoint.service';



@Injectable()
export class GLAccountService {
    constructor(
        private router: Router,
        private http: HttpClient,
       	private glAccountEndPoint: GLAccountEndpoint) { let currentUrl = this.router.url; }
    getGlAccountBasic() {
		return Observable.forkJoin(
			this.glAccountEndPoint.getGLAccountBasicList<any[]>());
	}
}