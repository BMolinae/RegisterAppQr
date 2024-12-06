import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private storageKey = 'user';
    private isAuthenticatedKey = 'isAuthenticated';
    private userTypeKey = 'userType';

    constructor(){}

    saveUser(user: { username: string; email: string; password: string}){
        const userType = user.email.endsWith('@profesor.cl')? 'docente' : 'estudiante';
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        localStorage.setItem(this.isAuthenticatedKey, 'true');
        localStorage.setItem(this.userTypeKey, userType);
    }

    getUserType(): string{
        return localStorage.getItem(this.userTypeKey) || 'estudiante';
    }

    getUsername(): string{
        const storedUser = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        return storedUser.username || '';
    }

    logout(){
        localStorage.setItem(this.isAuthenticatedKey, 'false');
    }

    validateCredentials(username: string, password: string): boolean{
        const storedUser = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        if (storedUser.username === username && storedUser.password === password){
            localStorage.setItem(this.isAuthenticatedKey, 'true');
            return true;
        }
        return false;
    }

    isAuthenticated(): boolean{
        return localStorage.getItem(this.isAuthenticatedKey) !== null;
    }

}