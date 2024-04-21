import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent implements OnInit {

  error:any;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(private router:Router){
    const navigation=this.router.getCurrentNavigation();
    this.error=navigation?.extras?.state?.error;
  }

}
