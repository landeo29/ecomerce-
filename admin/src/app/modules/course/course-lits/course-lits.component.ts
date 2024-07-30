import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { CourseDeleteComponent } from '../course-delete/course-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-lits',
  templateUrl: './course-lits.component.html',
  styleUrls: ['./course-lits.component.scss']
})
export class CourseLitsComponent implements OnInit {

  COURSES: any = [];
  isLoading: any;
  search: any = null;
  state: any = null;

  constructor(
    public courseService: CourseService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.listCourse();
  }

  listCourse() {
    this.courseService.listCourse(this.search, this.state).subscribe(
      (resp: any) => {
        console.log(resp);
        if (resp && resp.courses && resp.courses.data) {
          this.COURSES = resp.courses.data;
        } else {
          console.error('Unexpected response structure:', resp);
          this.COURSES = [];
        }
      },
      (error: any) => {
        console.error('Error fetching courses:', error);
        this.COURSES = [];
      }
    );
  }

  deleteCourse(COURSE: any) {
    const modalRef = this.modalService.open(CourseDeleteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.course = COURSE;

    modalRef.componentInstance.CourseD.subscribe((resp: any) => {
      const INDEX = this.COURSES.findIndex((item: any) => item.id === COURSE.id);
      if (INDEX > -1) {
        this.COURSES.splice(INDEX, 1);
      }
    });
  }
}
