import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';

declare var $: any;
declare function HOMEINIT(arg: any): any;
declare function banner_home(): any;
declare function countdownT(): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  CATEGORIES: any = [];
  COURSES_HOME: any = [];
  group_courses_categories: any = [];
  DESCOUNT_BANNER: any = null;
  DESCOUNT_BANNER_COURSES: any = [];
  DESCOUNT_FLASH: any = null;
  DESCOUNT_FLASH_COURSES: any = [];

  constructor(public homeService: HomeService) {
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }

  ngOnInit(): void {
    this.homeService.home().subscribe((resp: any) => {
      if (resp) {
        console.log(resp);
        this.CATEGORIES = resp.categories || [];
        this.COURSES_HOME = resp.courses_home?.data || [];
        this.group_courses_categories = resp.group_courses_categories || [];
        this.DESCOUNT_BANNER = resp.DESCOUNT_BANNER || null;
        this.DESCOUNT_BANNER_COURSES = resp.DESCOUNT_BANNER_COURSES || [];
        this.DESCOUNT_FLASH = resp.DESCOUNT_FLASH || null;
        this.DESCOUNT_FLASH_COURSES = resp.DESCOUNT_FLASH_COURSES || [];
        setTimeout(() => {
          banner_home();
          countdownT();
        }, 50);
      } else {
        console.error('Response is undefined');
      }
    }, (error) => {
      console.error('Error fetching home data:', error);
    });
  }

  getNewTotal(COURSE: any, DESCOUNT_BANNER: any) {
    if (DESCOUNT_BANNER?.type_discount == 1) {
      return COURSE.precio_usd - COURSE.precio_usd * (DESCOUNT_BANNER.discount * 0.01);
    } else {
      return COURSE.precio_usd - DESCOUNT_BANNER.discount;
    }
  }

  getTotalPriceCourse(COURSE: any) {
    if (COURSE?.discount_g) {
      return this.getNewTotal(COURSE, COURSE.discount_g);
    }
    return COURSE.precio_usd;
  }
}
