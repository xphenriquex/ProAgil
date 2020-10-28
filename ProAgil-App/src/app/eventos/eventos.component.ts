import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  public eventos: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos() {
    this.http.get('http://localhost:5000/weatherforecast/').subscribe(res => {
      this.eventos = res;
    }, error => {
      console.log(error)
    }
    );
  }

}
