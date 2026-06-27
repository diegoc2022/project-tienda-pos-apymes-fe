import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SecuenciaService } from '../utils/services/secuencia';
import { FormaPago } from '../utils/services/forma-pago';
import { ClientesFeService } from '../clientes-fe/services/clientes.service';

@Component({
  selector: 'app-detalle-factura-fe',
  standalone: true,
  templateUrl: './detalle-factura-fe.html',
  styleUrl: './detalle-factura-fe.scss',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    DialogModule,
    InputNumberModule,
    ToastModule,
    InputTextModule,
    SelectModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleFacturaFe {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  form: FormGroup = new FormGroup({});
  data_tipo_ident: any[] = [];
  seleccionado: any = null;
  habilitado: boolean = true;
  forma_de_pago: any[] = [];
  data_factura_dian: any[] = [];

  constructor(
    /* private imprime_fact: ImprimeService,
   
    
    private ventas: VentasSerivice,    
    private inventario: InventarioService,
    
    private formventas: FormVentas, */
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private secuencia: SecuenciaService,
    private forma_pago: FormaPago,
    private cliente_fe: ClientesFeService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      ident: [null, Validators.required],
      nombre: [null, Validators.required],
      forma_pago: [null, Validators.required],
      total_pago: [null, Validators.required],
      monto_rec: [null, Validators.required],
      cambio: [null, Validators.required]
    });

    this.visible = false;
    this.habilitado = true;
    this.funct_retorna_forma_de_pago_c();
  }

  funt_close_dialog_detalle_factura() {
    this.visible = false;
  }

  funct_retorna_cliente_fe(data: any) {
    if (data.code == 'Enter' || data.key == 'Enter') {
      this.cliente_fe.funct_retorna_one_cliente_s(this.form.value.ident).subscribe({
        next: (data: any) => {
          if (data.status == 409) {
            this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: data.msg, life: 5000 });
            return;
          }

          this.data_factura_dian = [];
          this.data_factura_dian.push(data[0]);
          this.form.get('nombre')?.setValue(data[0].nombre_cliente);
        }
      });
    }
  }

  funct_retorna_forma_de_pago_c() {
    this.forma_pago.funt_retorna_forma_de_pago_s().subscribe({
      next: (data: any) => {
        this.forma_de_pago = [];
        data.map((resp: any) => {
          this.forma_de_pago.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
  }

  funct_retorna_one_cliente_fe(data: any) {

  }
}
