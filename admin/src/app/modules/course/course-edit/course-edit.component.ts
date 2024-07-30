import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { CourseService } from '../service/course.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  subcategories:any = [];
  subcategories_back:any = [];
  categories:any = [];
  instructores:any = [];

  isLoading:any;
  FILE_PORTADA:any = null;
  IMAGEN_PREVISUALIZA:any = null;

  text_requirements:any = null;
  requirements:any = [];
  text_what_is_for:any = null;
  what_is_fors:any = [];

  title:string = '';
  subtitle:string = '';
  precio_usd:number = 0;
  precio_pen:number = 0;
  description:any = "<p>Hello, world!</p>";
  categorie_id:any = null;
  sub_categorie_id:any = null;
  user_id:any = null;
  level:any = null;
  idioma:any = null;
  // who_is_it_for
  state:any = 1;

  courses_id:any;
  course_selected:any = null;
  video_curso:any = null;
  link_video_course:any = null;

  isUploadVideo:Boolean = false;
  constructor(
    public courseService: CourseService,
    public toaster: Toaster,
    public activedRoute:ActivatedRoute,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.lisConfig().subscribe((resp:any) => {
      console.log(resp);
      this.subcategories = resp.subcategories;
      this.categories = resp.categories;
      this.instructores = resp.instructores;
      this.showCourse(this.courses_id);
    })
    
    this.activedRoute.params.subscribe((resp:any) => {
      this.courses_id = resp.id;
    })

  }
  showCourse(course_id:string){
    this.courseService.showCourse(course_id).subscribe((resp:any) => {
      console.log(resp);
      this.course_selected = resp.course;

      this.title = this.course_selected.title;
      this.subtitle = this.course_selected.subtitle;
      this.precio_usd = this.course_selected.precio_usd;
      this.precio_pen = this.course_selected.precio_pen;
      this.categorie_id = this.course_selected.categorie_id;
      this.selectCategorie({target: {value: this.categorie_id}});
      this.sub_categorie_id = this.course_selected.sub_categorie_id;
      this.description = this.course_selected.description;
      this.level = this.course_selected.level;
      this.idioma = this.course_selected.idioma;
      this.user_id = this.course_selected.user_id;
      // this.FILE_PORTADA = null;
      this.requirements = this.course_selected.requirements;
      this.what_is_fors = this.course_selected.who_is_it_for;
      this.IMAGEN_PREVISUALIZA = this.course_selected.imagen;
      this.state = this.course_selected.state;

      if(this.course_selected.vimeo_id){
        this.link_video_course = "https://player.vimeo.com/video/"+this.course_selected.vimeo_id;
      }

    })
  }
  selectCategorie(event:any){
    let VALUE = event.target.value;
    console.log(VALUE);
    this.subcategories_back = this.subcategories.filter((item:any) => item.categorie_id == VALUE);
  }

  addRequirements(){
    if(!this.text_requirements){
      this.toaster.open({text: 'NECESITAS INGRESAR UN REQUERIMIENTO',caption: 'VALIDACION',type: 'danger'});
      return;
    }
    this.requirements.push(this.text_requirements);
    this.text_requirements = null;
  }
  addWhatIsFor(){
    if(!this.text_what_is_for){
      this.toaster.open({text: 'NECESITAS INGRESAR UNA PERSONA DIRIGIDA',caption: 'VALIDACION',type: 'danger'});
      return;
    }
    this.what_is_fors.push(this.text_what_is_for);
    this.text_what_is_for = null;
  }
  removeRequirement(index:number){
    this.requirements.splice(index,1);
  }
  removeWhatIsFor(index:number){
    this.what_is_fors.splice(index,1);
  }
  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  save(){
    if(!this.title ||
      !this.subtitle || 
      !this.precio_usd || 
      !this.precio_pen ||
      !this.categorie_id ||
      !this.sub_categorie_id){
        this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS DEL FORMULARIO",caption: 'VALIDACION',type: 'danger'});
        return;
    }
    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("subtitle",this.subtitle);
    formData.append("precio_usd",this.precio_usd+"");
    formData.append("precio_pen",this.precio_pen+"");
    formData.append("categorie_id",this.categorie_id);
    formData.append("sub_categorie_id",this.sub_categorie_id);
    formData.append("description",this.description);
    formData.append("level",this.level);
    formData.append("idioma",this.idioma);
    formData.append("user_id",this.user_id);
    formData.append("state",this.state);
    if(this.FILE_PORTADA){
      formData.append("portada",this.FILE_PORTADA);
    }
    formData.append("requirements",this.requirements);
    formData.append("who_is_it_for",this.what_is_fors);

    this.courseService.updateCourses(formData,this.courses_id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: 'VALIDACION',type: 'danger'});
        return;
      }else{
        this.toaster.open({text: "EL CURSOS SE HA MODIFICADO CON EXITO",caption: 'SUCCESS',type: 'primary'});
        // this.title = '';
        // this.subtitle = '';
        // this.precio_usd = 0;
        // this.precio_pen = 0;
        // this.categorie_id = null;
        // this.sub_categorie_id = null;
        // this.description = null;
        // this.level = null;
        // this.idioma = null;
        // this.user_id = null;
        // this.FILE_PORTADA = null;
        // this.requirements = [];
        // this.what_is_fors = [];
        // this.IMAGEN_PREVISUALIZA = null;
        return;
      }
    });
  }

  uploadVideo(){
    let formData = new FormData();
    formData.append("video",this.video_curso);
    console.log(this.video_curso);
    this.isUploadVideo = true;
    this.courseService.uploadVideo(formData,this.courses_id).subscribe((resp:any) => {
      this.isUploadVideo = false;
      console.log(resp);
      this.link_video_course = resp.link_video;
    })
  }

  urlVideo(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_video_course);
  }

  processVideo($event:any){
    if($event.target.files[0].type.indexOf("video") < 0){
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN VIDEOS', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      return;
    }
    this.video_curso = $event.target.files[0];
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    this.courseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false);
    }, 50);

  }

}
