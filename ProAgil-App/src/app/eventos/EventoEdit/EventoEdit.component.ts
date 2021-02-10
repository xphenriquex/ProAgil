import { ToastrService } from 'ngx-toastr';
import { RedeSocial } from './../../_models/RedeSocial';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/_services/evento.service';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './EventoEdit.component.html',
  styleUrls: ['./EventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  registerForm: FormGroup;
  imagemURL = 'assets/img/upload.png';
  evento: Evento = new Evento();
  fieNameToUpdate: string;
  file: File;
  dataAtual: any;

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  get tema(): string {
    return this.registerForm.get('tema').value;
  }

  set tema(value: string) {
    this.registerForm.get('tema').setValue(value);
  }

  get local(): any {
    return this.registerForm.get('local').value;
  }

  set local(value: any) {
    this.registerForm.get('local').setValue(value);
  }


  get dataEvento(): any {
    return this.registerForm.get('dataEvento').value;
  }

  set dataEvento(value: any) {
    this.registerForm.get('dataEvento').setValue(value);
  }

  get qtdPessoas(): any {
    return this.registerForm.get('qtdPessoas').value;
  }

  set qtdPessoas(value: any) {
    this.registerForm.get('qtdPessoas').setValue(value);
  }

  get telefone(): any {
    return this.registerForm.get('telefone').value;
  }

  set telefone(value: any) {
    this.registerForm.get('telefone').setValue(value);
  }

  get email(): any {
    return this.registerForm.get('email').value;
  }

  set email(value: any) {
    this.registerForm.get('email').setValue(value);
  }

  constructor(
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
      this.localeService.use('pt-br');
    }

    ngOnInit(): void {
      this.validation();
      this.carregarEvento();
    }

    carregarEvento() {
      const idEvento = +this.route.snapshot.paramMap.get('id');
      this.eventoService.getEventoById(idEvento)
        .subscribe(
          (evento: Evento) => {
            this.evento = Object.assign({}, evento);

            this.fieNameToUpdate = this.evento.imagemURL.toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

            this.evento.imagemURL = '';
            this.registerForm.patchValue(this.evento);

            this.evento.lotes.forEach(lote => {
              this.lotes.push(this.criaLote(lote));
            });

            this.evento.redesSociais.forEach(redeSocial => {
              this.redesSociais.push(this.criaRedeSocial(redeSocial));
            });
          }
        );
    }

    onFileChange(file: any) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagemURL = event.target.result;
      }
      this.file = file.target.files;
      reader.readAsDataURL(file.target.files[0]);
    }

    validation() {
      this.registerForm = this.formBuilder.group({
        id: [],
        tema: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(50) ] ],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [ Validators.required, Validators.max(120000)] ],
        imagemURL: [''],
        telefone: ['', Validators.required ],
        email: ['', [ Validators.required, Validators.email ] ],
        lotes: this.formBuilder.array([]),
        redesSociais: this.formBuilder.array([]),
      });
    }

    removerLote(id: number) {
      this.lotes.removeAt(id);
    }

    removerRedeSocial(id: number) {
      this.redesSociais.removeAt(id);
    }

    adicionarLote() {
      this.lotes.push(this.criaLote({id: 0}));
    }

    adicionarRedeSocial() {
      this.redesSociais.push(this.criaRedeSocial({id: 0}));
    }

    criaLote(lote: any): FormGroup {
      return this.formBuilder.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade: [lote.quantidade, Validators.required],
        preco: [lote.preco, Validators.required],
        dataInicio: [lote.dataInicio],
        dataFim: [lote.dataFim],
      });
    }

    criaRedeSocial(redeSocial: any): FormGroup {
      return this.formBuilder.group({
        id: [redeSocial.id],
        nome: [redeSocial.nome, Validators.required],
        url: [redeSocial.url, Validators.required],
      });
    }

    salvarEventos() {
      this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
      this.evento.imagemURL = this.fieNameToUpdate;

      this.uploadImage();

      this.eventoService.putEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          console.log(novoEvento);
          this.toastr.success('Editado com Sucesso!');
        },
        error => {
          this.toastr.error(`Erro ao Editar: ${error}`);
        });
    }

    uploadImage() {
      if(this.registerForm.get('imagemURL').value !== ''){
        this.eventoService.postUpload(this.file, this.fieNameToUpdate)
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
            }
        ) ;
      }
    }


}
