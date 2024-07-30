import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseService } from '../../../service/course.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { DomSanitizer } from '@angular/platform-browser';
import { ClaseFileDeleteComponent } from '../clase-file-delete/clase-file-delete.component';

@Component({
  selector: 'app-clase-edit',
  templateUrl: './clase-edit.component.html',
  styleUrls: ['./clase-edit.component.scss']
})
export class ClaseEditComponent implements OnInit {

  @Input() clase_selected:any;
  @Output() ClaseE: EventEmitter<any> = new EventEmitter();
  title:any;
  description:any;
  isLoading:any;

  FILES:any = [];

  FILES_CLASE:any = [];

  video_curso:any = null;
  isUploadVideo:Boolean = false;
  isUploadFiles:Boolean = false;
  link_video_course:any = null;
  state:any = 1;
  constructor(
    public courseService:CourseService,
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public sanitizer: DomSanitizer,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.title = this.clase_selected.name;
    this.description = this.clase_selected.description;
    this.FILES_CLASE = this.clase_selected.files;
    this.link_video_course = this.clase_selected.vimeo_id;
    this.state= this.clase_selected.state;
  }

  save(){

    let data = {
      name: this.title,
      description: this.description,
      state: this.state,
    }

    this.courseService.updateClase(data,this.clase_selected.id).subscribe((resp:any) => {
      this.toaster.open({text: "SE HA REGISTRADO LOS CAMBIOS DE LA CLASE",caption: "SUCCESS", type:'primary'});
      this.modal.close();
      this.ClaseE.emit(resp.clase);
    })
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  uploadVideo(){
    let formData = new FormData();
    formData.append("video",this.video_curso);
    console.log(this.video_curso);
    this.isUploadVideo = true;
    this.courseService.uploadVideoClase(formData,this.clase_selected.id).subscribe((resp:any) => {
      this.isUploadVideo = false;
      console.log(resp);
      this.link_video_course = resp.link_video;
    })
  }
  urlVideo(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_video_course);
  }
  uploadFiles(){
    if(this.FILES.length == 0){
      this.toaster.open({text: "NECESITAS SUBIR UN RECURSO A LA CLASE",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    let formData = new FormData();
    formData.append("course_clase_id", this.clase_selected.id);
    this.FILES.forEach((file:any,index:number) => {
      formData.append("files["+index+"]",file);
    });
    this.isUploadFiles = true;
    this.courseService.registerClaseFile(formData).subscribe((resp:any) => {
      this.isUploadFiles = false;
      console.log(resp);
      this.modal.close();
      this.ClaseE.emit(resp.clase);
    })
  }

  processVideo($event:any){
    if($event.target.files[0].type.indexOf("video") < 0){
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN VIDEOS', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      return;
    }
    this.video_curso = $event.target.files[0];
  }

  processFile($event:any){
    for (const file of $event.target.files) {
      this.FILES.push(file);
    }
    console.log(this.FILES);
  }

  deleteFile(FILE:any){
    const modalRef= this.modalService.open(ClaseFileDeleteComponent,{centered: true,size: 'sm'});
    modalRef.componentInstance.file_selected = FILE;

    modalRef.componentInstance.FileD.subscribe((resp:any) =>{
      let INDEX = this.FILES_CLASE.findIndex((item:any) => item.id == FILE.id);
      this.FILES_CLASE.splice(INDEX,1);
    });
  }
}
