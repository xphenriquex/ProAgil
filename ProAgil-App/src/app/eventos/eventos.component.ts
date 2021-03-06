import { Evento } from './../_models/Evento';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';


defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventoFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento: Evento;
  modoSalvar = '';
  imageLargura = 50;
  imagemMargem = 2;
  mostrarImage = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;
  fieNameToUpdate: string;

  // tslint:disable-next-line: variable-name
  private _filtroLista: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
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

  editarEvento(template: any, evento: Evento) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fieNameToUpdate = this.evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  onFileChange(event) {
    const fileReader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }


  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.criarEvento(template);
      } else {
        this.atualizarEvento(template);
      }

    }
  }

  uploadImage() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];
      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
      );
    } else {
      this.evento.imagemURL = this.fieNameToUpdate;
      this.eventoService.postUpload(this.file, this.fieNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
      );

    }
  }

  criarEvento(template: any) {
    this.evento = Object.assign({}, this.registerForm.value);
    this.uploadImage();

    this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          console.log(novoEvento);
          template.hide();
          this.getEventos();
          this.toastr.success('Inserido com Sucesso!');
        },
        error => {
          this.toastr.error(`Erro ao Inserir: ${error}`);
        }
      );
  }

  atualizarEvento(template) {
    this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
    this.uploadImage();

    this.eventoService.putEvento(this.evento).subscribe(
      (novoEvento: Evento) => {
        console.log(novoEvento);
        template.hide();
        this.getEventos();
        this.toastr.success('Editado com Sucesso!');
      },
      error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
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
          this.toastr.success('Deletado com Sucesso');
        }, error => {
          this.toastr.error(`Erro ao tentar Deletar: ${error}`);
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
      (eventos: Evento[]) => {
      this.eventos = eventos;
      this.eventoFiltrados = this.eventos;
    }, error => {
      this.toastr.error(`Erro ao tentar Carregar eventos: ${error}`);
    }
    );
  }

}
