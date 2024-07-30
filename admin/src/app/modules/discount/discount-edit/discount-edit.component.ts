import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { DiscountService } from '../service/discount.service';

@Component({
  selector: 'app-discount-edit',
  templateUrl: './discount-edit.component.html',
  styleUrls: ['./discount-edit.component.scss']
})
export class DiscountEditComponent implements OnInit {

  discount:number = 0;
  type_discount:number = 1;
  discount_type:number = 1;
  start_date:any = null;
  end_date:any = null;
  type_campaing:number = 1; // 1 es campaña normal, 2 es flash y 3 es banner
  state:any = 1;
  // 

  categorie_id:any = null;
  course_id:any = null;

  courses:any = [];
  categories:any = [];

  categorie_selecteds:any = [];
  course_selecteds:any = [];

  isLoading:any;

  discount_selected:any;
  discount_id:any;
  constructor(
    public discountService: DiscountService,
    public toaster: Toaster,
    public activedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.discountService.isLoading$;
    this.activedRouter.params.subscribe((resp:any) => {
      this.discount_id = resp.id;
    })
    this.discountService.lisConfig().subscribe((resp:any) => {
      console.log(resp);
      this.courses = resp.courses;
      this.categories = resp.categories;

      this.showDiscount();
    })
  }
  showDiscount(){
    this.discountService.showDiscount(this.discount_id).subscribe((resp:any) => {
      console.log(resp);

      this.discount_selected = resp.discount;

      this.discount = this.discount_selected.discount;
      this.type_campaing = this.discount_selected.type_campaing;
      this.type_discount = this.discount_selected.type_discount;
      this.discount_type = this.discount_selected.discount_type;
      this.start_date = this.discount_selected.start_date;
      this.end_date = this.discount_selected.end_date;
      this.state = this.discount_selected.state;
      if(this.discount_type == 1){
        this.course_selecteds = this.discount_selected.courses;
      }

      if(this.discount_type == 2){
        this.categorie_selecteds = this.discount_selected.categories;
      }

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
      state: this.state,
    };
    this.discountService.updateDiscount(data,this.discount_id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: "VALIDACIÓN", type: 'danger'});
        return;
      }else{
        this.toaster.open({text: "LA CAMPAÑA DE DESCUENTO SE EDITO CORRECTAMENTE",caption: "VALIDACIÓN", type: 'primary'});
        // this.discount = 0;
        // this.type_discount = 1;
        // this.discount_type = 1;
        // this.course_selecteds = [];
        // this.categorie_selecteds = [];
        // this.course_id = null;
        // this.categorie_id = null;
        // this.type_campaing = 1;
        // this.start_date = null;
        // this.end_date = null;
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
