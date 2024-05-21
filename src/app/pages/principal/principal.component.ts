import { Component } from '@angular/core';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [TopbarComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export default class PrincipalComponent {

}
