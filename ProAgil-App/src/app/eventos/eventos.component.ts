import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventoFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento;
  modoSalvar = '';
  imageLargura = 50;
  imagemMargem = 2;
  mostrarImage = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  private _filtroLista: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventoFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  ngOnInit(): void {
    this.validation();
    this.getEventos();
  }

  alternarImage() {
    this.mostrarImage = !this.mostrarImage;
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  editarEvento(template: any, evento: Evento){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(this.evento);
  }

  salvarAlteracao(template: any) {
    if(this.registerForm.valid) {
      if(this.modoSalvar === 'post') {
        this.criarEvento(template)
      }else {
        this.atualizarEvento(template);
      }

    }
  }

  criarEvento(template: any) {
    this.evento = Object.assign({}, this.registerForm.value);
     this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          console.log(novoEvento);
          template.hide();
          this.getEventos();
        },
        error => {
          console.log(error);
        }
      );
  }

  atualizarEvento(template) {
    this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
    this.eventoService.putEvento(this.evento).subscribe(
      (novoEvento: Evento) => {
        console.log(novoEvento);
        template.hide();
        this.getEventos();
      },
      error => {
        console.log(error);
      }
    );
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
        }, error => {
          console.log(error);
        }
    );
  }

  validation() {
    this.registerForm = this.formBuilder.group({
      tema: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(50) ] ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [ Validators.required, Validators.max(120000)] ],
      imagemURL: ['', Validators.required ],
      telefone: ['', Validators.required ],
      email: ['', [ Validators.required, Validators.email ] ],
    });
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
