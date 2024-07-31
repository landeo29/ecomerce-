import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaGuestComponent } from './tienda-guest.component';
import { CoursesDetailComponent } from './courses-detail/courses-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaGuestComponent,
    children: [
      {
        path: 'landing-curso/:slug',
        component: CoursesDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaGuestRoutingModule { }
