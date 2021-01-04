import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventoFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imageLargura = 50;
  imagemMargem = 2;
  mostrarImage = false;
  modalRef: BsModalRef;

  private _filtroLista: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService) { }

  get filtroLista() {
    console.log("entou no get");
    console.log(this._filtroLista);
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    console.log("entou no set");
    this._filtroLista = value;
    console.log(this._filtroLista);
    this.eventoFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    console.log(this._filtroLista);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.getEventos();
  }

  alternarImage() {
    this.mostrarImage = !this.mostrarImage;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventoFiltrados = this.eventos;
      console.log(_eventos);
    }, error => {
      console.log(error);
    }
    );
  }

}
