//Previous Code
import { Injectable } from '@angular/core';
//Previous Code
@Injectable()
export class Globals {
    role: string = 'test';
    currentPage: string = "";

}

//import { ErrorHandler, Injectable } from '@angular/core';

//@Injectable()
//export default class Globals implements ErrorHandler{

//	constructor() {
//		// The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
//		// when an error happens. If we do not rethrow, bootstrap will always succeed.
//		super(true);
//	}

//	handleError(error) {
//		// send the error to the server

//		// delegate to the default handler
//		super.handleError(error);
//	}

//	role: string = 'test';
//    currentPage: string = "";
//}


//By Arun Global Level3
//import { ErrorHandler, Injectable, Injector } from '@angular/core';
//import { HttpErrorResponse } from '@angular/common/http';
//import { NotificationService } from "./services/notification.service";

//@Injectable()
//export class Globals implements ErrorHandler {
//	constructor(
//		// Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
//		private injector: Injector,
//	) { }
//	handleError(error: Error | HttpErrorResponse) {
//		const notificationService = this.injector.get(NotificationService);
//		if (error instanceof HttpErrorResponse) {
//			// Server or connection error happened
//			if (!navigator.onLine) {
//				// Handle offline error
//				//return notificationService.notify('No Internet Connection');
				
//			}
//			else {
//				// Handle Http Error (error.status === 403, 404...)
//				//return notificationService.notify(`${error.status} - ${error.message}`);
//			}
//		}
//		else {
//			// Handle Client Error (Angular Error, ReferenceError...)     
//		}
//		// Log the error anyway
//		console.error('It happens: ', error);
//	}
//      role: string = 'test';
//      currentPage: string = "";
//}



//By Arun Global Level1

//@Injectable()
//export class Globals implements ErrorHandler{

//	constructor() { }

//	handleError(error) {
//		console.log('Hio')

//		// IMPORTANT: Rethrow the error otherwise it gets swallowed

//		throw error;
//	}

//	role: string = 'test';
//    currentPage: string = "";
//}

//By Arun Global Level2

//import { ErrorHandler, Injectable, Injector } from '@angular/core';
//import { LocationStrategy, PathLocationStrategy } from '@angular/common';
//import { LoggingService } from '../services';
//import * as StackTrace from 'stacktrace-js';

//@Injectable()
//export class Globals implements ErrorHandler {
//	constructor(private injector: Injector) { }
//	handleError(error) {
//		const loggingService = this.injector.get(LoggingService);
//		const location = this.injector.get(LocationStrategy);
//		const message = error.message ? error.message : error.toString();
//		const url = location instanceof PathLocationStrategy
//			? location.path() : '';
//		// get the stack trace, lets grab the last 10 stacks only
//		StackTrace.fromError(error).then(stackframes => {
//			const stackString = stackframes
//				.splice(0, 20)
//				.map(function (sf) {
//					return sf.toString();
//				}).join('\n');
//			// log on the server
//			loggingService.log({ message, url, stack: stackString });
//		});
//		throw error;
//	}

//}