import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Calculator } from './calculator';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-testing-services';

  ngOnInit(){
    const calculator = new Calculator();
    const rta = calculator.multiply(3,3);
    console.log(rta===9);
    const rta2= calculator.divide(3,0);
    console.log(rta2===null);


  }
}
