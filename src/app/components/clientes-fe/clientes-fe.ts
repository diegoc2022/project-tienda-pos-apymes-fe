import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ClientesFeService } from './services/clientes.service';

@Component({
  selector: 'app-clientes-fe',
  standalone: true,
  templateUrl: './clientes-fe.html',
  styleUrl: './clientes-fe.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesFe {
  data!: FormGroup;
  data_municipio: any[] = [];
  data_tipo_ident: any[] = [];
  data_tipo_org: any[] = [];
  data_tipo_resp: any[] = [];
  data_tipo_reg: any[] = [];
  fecha_actual?: string;
  date: Date = new Date();
  options: any[] = [];
  seleccionado: any = null;
  seleccionado2: any = null;
  seleccionado3: any = null;
  seleccionado4: any = null;
  seleccionado5: any = null;


  constructor(
    private fb: FormBuilder,
    private message: MessageService,
    private clientesFe: ClientesFeService
  ) { }

  ngOnInit(): void {
    this.data = this.fb.group({
      tipo_ident: ['', Validators.required],
      ident: ['', Validators.required],
      nombre: ['', Validators.required],
      munic: ['', Validators.required],
      telef: ['', Validators.required],
      correo: ['', Validators.required],
      tipo_org: ['', Validators.required],
      tipo_resp: ['', Validators.required],
      tipo_reg: ['', Validators.required],
      dir: ['', Validators.required],
    });
    this.fecha_actual = format(this.date, 'yyyy-MM-dd HH:mm:ss');
    this.funct_retorna_municipio();
    this.funct_retorna_tipo_identificacion();
    this.funct_retorna_tipo_organizacion();
    this.funct_retorna_tipo_regimen();
    this.funct_retorna_tipo_responsabilidad();
  }

  funct_retorna_municipio() {
    this.clientesFe.funct_retorna_municipio_s().subscribe({
      next: (data: any) => {
        this.data_municipio = [];
        data.map((resp: any) => {
          this.data_municipio.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
  }

  funct_retorna_tipo_identificacion() {
    this.clientesFe.funct_retorna_tipo_identificacion_s().subscribe({
      next: (data: any) => {
        this.data_tipo_ident = [];
        data.map((resp: any) => {
          this.data_tipo_ident.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
  }

  funct_retorna_tipo_organizacion() {
    this.clientesFe.funct_retorna_tipo_organizacion_s().subscribe({
      next: (data: any) => {
        this.data_tipo_org = [];
        data.map((resp: any) => {
          this.data_tipo_org.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
  }

  funct_retorna_tipo_responsabilidad() {
    this.clientesFe.funct_retorna_tipo_responsabilidad_s().subscribe({
      next: (data: any) => {
        this.data_tipo_resp = [];
        data.map((resp: any) => {
          this.data_tipo_resp.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
  }

  funct_retorna_tipo_regimen() {
    this.clientesFe.funct_retorna_tipo_regimen_s().subscribe({
      next: (data: any) => {
        this.data_tipo_reg = [];
        data.map((resp: any) => {
          this.data_tipo_reg.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })

      }
    })
  }


  on_enter_cedula_cliente(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="nombre_cliente"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  on_enter_nombre_cliente(event: any) {
    if (event.code == "Enter") {
      const nextElement = (document.querySelector(`[formControlName="telefono"]`) as HTMLElement);
      nextElement.focus();
    }
  }

  funct_registra_clientes_c() {
    if (this.data.invalid) {
      this.data.markAllAsTouched();
      for (const key in this.data.controls) {
        this.data.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Todos los campos del formulario son obligatorios' });
      return;
    }

    this.clientesFe.funct_registra_clientes_fe_s(this.data.value).subscribe({
      next: (data: any) => {
        if (data.status == 409) {
          this.message.add({ severity: 'warn', summary: 'Avertencia:', detail: data.msg, life: 5000 });
          this.data.reset();
          return
        }

        this.data.reset();
        this.message.add({ severity: 'info', summary: 'Informativo:', detail: 'Cliente registrado exitosamente', life: 5000 });
      }, error: (error: any) => {
        console.log("Error: ", error);
      }
    })
  }
}
