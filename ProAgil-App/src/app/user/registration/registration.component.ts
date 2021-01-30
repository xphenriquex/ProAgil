import { Router } from '@angular/router';
import { AuthService } from './../../_services/auth.service';
import { User } from './../../_models/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: User;
  constructor(
    public formGroup: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router) {

    }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.registerForm = this.formGroup.group({
      fullName: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email ] ],
      userName: ['', Validators.required],
      passwords: this.formGroup.group({
        password: ['', [ Validators.required, Validators.minLength(4)] ],
        confirmPassword: ['', Validators.required]
      }, { validators: this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup) {
    const confirmSenha = fb.get('confirmPassword');
    if (confirmSenha.errors == null || 'mismatch' in confirmSenha.errors) {
      if (fb.get('password').value !== confirmSenha.value) {
        confirmSenha.setErrors({ mismatch: true });
      } else {
        confirmSenha.setErrors(null);
      }
    }
  }

  cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign(
        { password: this.registerForm.get('passwords.password').value },
        this.registerForm.value
        );
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastro realizado');
        },
        error => {
          const erro = error.error;
          erro.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro duplicado');
                break;

              default:
                this.toastr.error(`Erro no Cadastro! CODE: ${element.code}`);
                break;
            }
          });
        });
    }
  }

}
