import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

declare function _clickDoc():any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  //auth-login
  email:any = null;
  password:any = null;

  // auth-register
  email_register:any = null;
  password_register:any = null;
  name: any = null;
  surname:any = null;
  password_confirmation:any = null;
  constructor(
    public authService: AuthService,
    public router: Router,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
      _clickDoc();
    }, 50);

    if(this.authService.user){
      this.router.navigateByUrl("/");
      return;
    }
  }

  login(){
    if(!this.email || !this.password){
      alert("NECESITAS INGRESAR TODOS LOS CAMPOS");
      return;
    }
    this.authService.login(this.email,this.password).subscribe((resp:any) => {
      console.log(resp);
      if(resp){
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES NO EXISTEN");
      }
    })
  }

  register(){
    if(!this.email_register || !this.name || !this.surname || !this.password_register || !this.password_confirmation){
      alert("TODOS LOS CAMPOS SON NECESARIOS");
      return;
    }
    if(this.password_register != this.password_confirmation){
      alert("LAS CONTRASEÑAS SON DIFERENTES");
      return;
    }
    let data = {
      email: this.email_register,
      name: this.name,
      surname: this.surname,
      password: this.password_register,
    }
    this.authService.register(data).subscribe((resp:any) => {
      console.log(resp);
      alert("EL USUARIO SE HA REGISTRADO CORRECTAMENTE");
    }, error => {
      alert("LAS CREDECIALES INGRESADAS NO SON CORRECTAS O YA EXISTEN");
      console.log(error);
    })
  }
}
