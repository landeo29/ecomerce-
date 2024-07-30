import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../service/course.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaseEditComponent } from '../clase-edit/clase-edit.component';
import { ClaseDeleteComponent } from '../clase-delete/clase-delete.component';

@Component({
  selector: 'app-clase-add',
  templateUrl: './clase-add.component.html',
  styleUrls: ['./clase-add.component.scss']
})
export class ClaseAddComponent implements OnInit {

  CLASES:any = [];
  isLoading:any;
  title:any;

  description:any = "<p>Hello, world!</p>";

  FILES:any = [];
  section_id:any;
  constructor(
    public courseService: CourseService,
    public activedRouter:ActivatedRoute,
    public toaster: Toaster,
    public modalService:NgbModal,
  ) { }

  ngOnInit(): void {
    this.activedRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.section_id = resp.id;
    })
    this.isLoading = this.courseService.isLoading$;
    this.courseService.lisClases(this.section_id).subscribe((resp:any) => {
      console.log(resp);
      this.CLASES = resp.clases.data;
    })
  }

  save(){
    if(!this.title){
      this.toaster.open({text: "NECESITAS INGRESAR UN TITULO DE LA CLASE",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.FILES.length == 0){
      this.toaster.open({text: "NECESITAS SUBIR UN RECURSO A LA CLASE",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    let formData = new FormData();
    formData.append("name",this.title);
    formData.append("description",this.description);
    formData.append("course_section_id",this.section_id)

    this.FILES.forEach((file:any,index:number) => {
      formData.append("files["+index+"]",file);
    });

    this.courseService.registerClase(formData).subscribe((resp:any) => {
      console.log(resp);
      this.toaster.open({text: "la clase se ha registrado correctamente",caption: "SUCCESS", type: 'primary'});
      this.CLASES.push(resp.clase);
      this.title = null;
      this.description = null;
      this.FILES = [];
    })
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  editClases(CLASE:any){
    const modalRef = this.modalService.open(ClaseEditComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.clase_selected = CLASE;

    modalRef.componentInstance.ClaseE.subscribe((CLASEE:any)=> {
      let INDEX = this.CLASES.findIndex((item:any) => item.id == CLASEE.id);
      this.CLASES[INDEX] = CLASEE;
    })
  }

  deleteClases(CLASE:any){
    const modalRef= this.modalService.open(ClaseDeleteComponent,{centered: true,size: 'sm'});
    modalRef.componentInstance.clase_selected = CLASE;

    modalRef.componentInstance.ClaseD.subscribe((resp:any) =>{
      let INDEX = this.CLASES.findIndex((item:any) => item.id == CLASE.id);
      this.CLASES.splice(INDEX,1);
    });
  }

  processFile($event:any){
    for (const file of $event.target.files) {
      this.FILES.push(file);
    }
    console.log(this.FILES);
    // if($event.target.files[0].type.indexOf("image") < 0){
    //   this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
    //   return;
    // }
    // this.FILE_PORTADA = $event.target.files[0];
    // let reader = new FileReader();
    // reader.readAsDataURL(this.FILE_PORTADA);
    // reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    // this.courseService.isLoadingSubject.next(true);
    // setTimeout(() => {
    //   this.courseService.isLoadingSubject.next(false);
    // }, 50);
  }
}
