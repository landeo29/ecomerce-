import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../service/discount.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-discount-add',
  templateUrl: './discount-add.component.html',
  styleUrls: ['./discount-add.component.scss']
})
export class DiscountAddComponent implements OnInit {

  discount:number = 0;
  type_discount:number = 1;
  discount_type:number = 1;
  start_date:any = null;
  end_date:any = null;
  type_campaing:number = 1; // 1 es campaña normal, 2 es flash y 3 es banner
  // 

  categorie_id:any = null;
  course_id:any = null;

  courses:any = [];
  categories:any = [];

  categorie_selecteds:any = [];
  course_selecteds:any = [];

  isLoading:any;
  constructor(
    public discountService: DiscountService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.discountService.isLoading$;
    this.discountService.lisConfig().subscribe((resp:any) => {
      console.log(resp);
      this.courses = resp.courses;
      this.categories = resp.categories;
    })
  }

  save(){
    if(!this.discount || !this.start_date || !this.end_date){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.discount_type == 1 && this.course_selecteds.length == 0){
      this.toaster.open({text: "NECESITAS SELECCIONAR CURSOS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.discount_type == 2 && this.categorie_selecteds.length == 0){
      this.toaster.open({text: "NECESITAS SELECCIONAR CATEGORIAS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    let data = {
      type_discount: this.type_discount,
      discount: this.discount,
      start_date: this.start_date,
      end_date: this.end_date,
      discount_type: this.discount_type,
      type_campaing: this.type_campaing,
      course_selected: this.course_selecteds,
      categorie_selected: this.categorie_selecteds,
    };
    this.discountService.registerDiscount(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: "VALIDACIÓN", type: 'danger'});
        return;
      }else{
        this.toaster.open({text: "LA CAMPAÑA DE DESCUENTO SE REGISTRO CORRECTAMENTE",caption: "VALIDACIÓN", type: 'primary'});
        this.discount = 0;
        this.type_discount = 1;
        this.discount_type = 1;
        this.course_selecteds = [];
        this.categorie_selecteds = [];
        this.course_id = null;
        this.categorie_id = null;
        this.type_campaing = 1;
        this.start_date = null;
        this.end_date = null;
      }
    });
  }

  addCourseSelected(){
    let VALID = this.course_selecteds.findIndex((course:any) => course.id == this.course_id);
    if(VALID == -1){
      let INDEX = this.courses.findIndex((course:any) => course.id == this.course_id);
      if(INDEX != -1){
        this.course_selecteds.push(this.courses[INDEX]);
        this.course_id = null;
      }
    }
  }
  addCategorieSelected(){
    let VALID = this.categorie_selecteds.findIndex((categorie:any) => categorie.id == this.categorie_id);
    if(VALID == -1){
      let INDEX = this.categories.findIndex((categorie:any) => categorie.id == this.categorie_id);
      if(INDEX != -1){
        this.categorie_selecteds.push(this.categories[INDEX]);
        this.categorie_id = null;
      }
    }

  }

  removeCourse(i:number){
    this.course_selecteds.splice(i,1);
  }
  removeCategorie(i:number){
    this.categorie_selecteds.splice(i,1);
  }
  selectedTypeDiscount(value:any){
    this.type_discount = value;
  }
  selectedTypeCampaing(value:any){
    this.selectedTypeCoupon(1);
    this.type_campaing = value;
  }
  selectedTypeCoupon(value:any){
    this.discount_type = value;
    this.course_selecteds = [];
    this.categorie_selecteds = [];
  }

}
