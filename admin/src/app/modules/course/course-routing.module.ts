import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseLitsComponent } from './course-lits/course-lits.component';
import { SectionAddComponent } from './section/section-add/section-add.component';
import { ClaseAddComponent } from './section/clases/clase-add/clase-add.component';

const routes: Routes = [{
  path: '',
  component: CourseComponent,
  children: [
    {
      path: 'registro',
      component: CourseAddComponent,
    },
    {
      path: 'list',
      component: CourseLitsComponent
    },
    {
      path: 'list/editar/:id',
      component: CourseEditComponent,
    },

    {
      path: 'list/secciones/:id',
      component: SectionAddComponent,
    },
    
    {
      path: 'list/secciones/clases/:id',
      component: ClaseAddComponent,
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
