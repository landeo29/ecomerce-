import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CategorieService } from '../service/categorie.service';

@Component({
  selector: 'app-categorie-edit',
  templateUrl: './categorie-edit.component.html',
  styleUrls: ['./categorie-edit.component.scss']
})
export class CategorieEditComponent implements OnInit {

  @Output() CategorieE: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIES:any = null;
  @Input() categorie:any = null;

  name:any = null;
  
  IMAGEN_PREVISUALIZA:any = "./assets/media/avatars/300-6.jpg";
  FILE_PORTADA:any = null;

  isLoading:any;
  selected_option:any = 1;
  categorie_id: any = null;
  state:any = 1;
  constructor(
    public categorieService: CategorieService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
    this.name = this.categorie.name;
    this.selected_option = this.categorie.categorie_id ? 2 : 1;
    this.IMAGEN_PREVISUALIZA = this.categorie.imagen ? this.categorie.imagen : "./assets/media/avatars/300-6.jpg";
    this.categorie_id = this.categorie.categorie_id;
    this.state = this.categorie.state;
  }

  processAvatar($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  store(){

    if(this.selected_option == 1){//CREACIÓN DE CATEGORIA
      if(!this.name){
        this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN', type:"danger"});
        return;
      }
    }
    if(this.selected_option == 2){//CREACIÓN DE SUBCATEGORIA
      if(!this.name || !this.categorie_id){
        this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN', type:"danger"});
        return;
      }
    }
    let formData = new FormData();

    formData.append("name",this.name);
    if(this.categorie_id){
      formData.append("categorie_id",this.categorie_id);
    }
    if(this.FILE_PORTADA){
      formData.append("portada",this.FILE_PORTADA);
    }
    formData.append("state",this.state);
    this.categorieService.updateCategorie(formData,this.categorie.id).subscribe((resp:any) => {
      console.log(resp);
      this.CategorieE.emit(resp.categorie);
      this.toaster.open({text: "LA CATEGORIA SE ACTULIZO CORRECTAMENTE", caption: "INFORME", type: 'primary'});
      this.modal.close();
    })
  }

  selectedOption(value:number){
    this.selected_option = value;
  }

}
