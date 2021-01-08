import { AuthService } from "../services/auth.service";



export class userName {
    public authService: any;
    constructor(authService: AuthService) {
        this.authService = authService;
    }
    userName(): string {
        // console.log('test');

        // console.log(this.authService);
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


}





