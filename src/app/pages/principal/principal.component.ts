import { Component } from '@angular/core';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export default class PrincipalComponent {

}
