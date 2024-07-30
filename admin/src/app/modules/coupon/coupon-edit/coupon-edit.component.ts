import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-coupon-edit',
  templateUrl: './coupon-edit.component.html',
  styleUrls: ['./coupon-edit.component.scss']
})
export class CouponEditComponent implements OnInit {

  code:any
  discount:number = 0;
  type_discount:number = 1;
  type_count:number = 1;
  num_use:any = null;
  type_coupon:number = 1;
  state:number = 1;
  // 

  categorie_id:any = null;
  course_id:any = null;

  courses:any = [];
  categories:any = [];

  categorie_selecteds:any = [];
  course_selecteds:any = [];

  isLoading:any;

  coupon_id:any;

  cupon_selected:any;
  constructor(
    public couponService: CouponService,
    public toaster: Toaster,
    public activedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.couponService.isLoading$;
    this.activedRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.coupon_id = resp.id;
    })
    this.couponService.lisConfig().subscribe((resp:any) => {
      console.log(resp);
      this.courses = resp.courses;
      this.categories = resp.categories;

      this.showCoupon();

    })
  }

  showCoupon(){

    this.couponService.showCoupon(this.coupon_id).subscribe((resp:any) => {
      console.log(resp);
      this.cupon_selected = resp.coupon;

      this.code = this.cupon_selected.code;
      this.discount = this.cupon_selected.discount;
      this.type_discount = this.cupon_selected.type_discount;
      this.type_count = this.cupon_selected.type_count;
      this.num_use = this.cupon_selected.num_use;
      this.type_coupon = this.cupon_selected.type_coupon;
      this.state = this.cupon_selected.state;
      if(this.type_coupon == 1){
        this.course_selecteds = this.cupon_selected.courses;
      }

      if(this.type_coupon == 2){
        this.categorie_selecteds = this.cupon_selected.categories;
      }
    });
  }

  save(){
    if(!this.code || !this.discount){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.type_count == 2 && !this.num_use){
      this.toaster.open({text: "NECESITAS INGRESAR UN NUMERO DE USOS ILIMITADOS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.type_coupon == 1 && this.course_selecteds.length == 0){
      this.toaster.open({text: "NECESITAS SELECCIONAR CURSOS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    if(this.type_coupon == 2 && this.categorie_selecteds.length == 0){
      this.toaster.open({text: "NECESITAS SELECCIONAR CATEGORIAS",caption: "VALIDACIÓN", type: 'danger'});
      return;
    }
    let data = {
      code: this.code,
      type_discount: this.type_discount,
      discount: this.discount,
      type_count: this.type_count,
      num_use: this.num_use,
      type_coupon: this.type_coupon,
      course_selected: this.course_selecteds,
      categorie_selected: this.categorie_selecteds,
      state: this.state,
    };
    this.couponService.updateCoupon(data,this.coupon_id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text,caption: "VALIDACIÓN", type: 'danger'});
        return;
      }else{
        this.toaster.open({text: "EL CUPON REGISTRO LOS CAMBIOS CORRECTAMENTE",caption: "VALIDACIÓN", type: 'primary'});
        // this.code = null;
        // this.discount = 0;
        // this.type_discount = 1;
        // this.type_count = 1;
        // this.num_use = null;
        // this.type_coupon = 1;
        // this.course_selecteds = [];
        // this.categorie_selecteds = [];
        // this.course_id = null;
        // this.categorie_id = null;
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
  selectedTypeCount(value:any){
    this.type_count = value;
  }
  selectedTypeCoupon(value:any){
    this.type_coupon = value;
  }


}
