import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GlobalLoadingComponent } from './spinner/spinner.component';

@Component({
  imports: [ RouterOutlet,GlobalLoadingComponent],
  // RouterLink,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
