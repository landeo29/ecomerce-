import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();

  name:any = null;
  surname:any = null;
  email:any = null;
  password:any = null;
  confirmation_password:any = null;
  
  IMAGEN_PREVISUALIZA:any = "./assets/media/avatars/300-6.jpg";
  FILE_AVATAR:any = null;

  isLoading:any;
  constructor(
    public userService: UserService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
  }

  processAvatar($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      return;
    }
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  store(){

    if(!this.name || !this.surname || !this.email || !this.password || !this.confirmation_password || !this.FILE_AVATAR){
      this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN', type:"danger"});
      return;
    }
    if(this.password != this.confirmation_password){
      this.toaster.open({text: "LAS CONTRASEÑAS NO SON IGUALES",caption: 'VALIDACIÓN', type:"danger"});
      return;
    }
    let formData = new FormData();

    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("password",this.password);
    formData.append("role_id","1");
    formData.append("type_user","2");
    formData.append("imagen",this.FILE_AVATAR);

    this.userService.register(formData).subscribe((resp:any) => {
      console.log(resp);
      this.UserC.emit(resp.user);
      this.toaster.open({text: "EL USUARIO SE REGISTRO CORRECTAMENTE", caption: "INFORME", type: 'primary'});
      this.modal.close();
    })
  }
}
