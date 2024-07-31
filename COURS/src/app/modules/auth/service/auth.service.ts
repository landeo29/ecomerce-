import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { URL_FROTEND, URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any = null;
  token:any = null;
  constructor(
    public http: HttpClient,
    public router:Router,
  ) {
    this.initAuth();
   }

  initAuth(){
    if(localStorage.getItem("token")){
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token");
    }
  }

  login(email:string,password:string){
    let URL = URL_SERVICIOS+"/auth/login_tienda";
    return this.http.post(URL,{email: email, password: password}).pipe(
      map((auth: any) => {
        console.log(auth);
        const result = this.saveLocalStorage(auth);
        return result;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
    );
    ;
  }

  saveLocalStorage(auth:any){
    if(auth && auth.access_token){
      localStorage.setItem("token",auth.access_token);
      localStorage.setItem("user",JSON.stringify(auth.user));
      return true;
    }
    return false;
  }

  register(data:any){
    let URL = URL_SERVICIOS + "/auth/register";
    return this.http.post(URL,data);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // this.router.navigateByUrl("auth/login");
    setTimeout(() => {
      location.href = URL_FROTEND+"/auth/login";
    }, 50);
  } 
}
