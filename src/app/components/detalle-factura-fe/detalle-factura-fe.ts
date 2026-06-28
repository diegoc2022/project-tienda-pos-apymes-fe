import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MedioDePago } from '../utils/services/medio-pago';
import { ClientesFeService } from '../clientes-fe/services/clientes.service';
import { VentasSerivice } from '../form-ventas/services/ventas.serivice';
import { InventarioService } from '../inventario/services/inventario.service';
import { switchMap } from 'rxjs';
import { FormVentas } from '../form-ventas/form-ventas';
import { SecuenciaService } from '../utils/services/secuencia';
import { FormaDePago } from '../utils/services/forma-pago';
import { DataFacturaDian } from '../utils/services/factura-dian';

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
  @ViewChild('monto_rec') selectFocus!: InputNumber;
  form: FormGroup = new FormGroup({});
  data_tipo_ident: any[] = [];
  seleccionado: any = null;
  select_clientes_fe: string | undefined;
  habilitado: boolean = true;
  medio_de_pago: any[] = [];
  forma_de_pago: any[] = [];
  data_factura_dian: any[] = [];
  data_clientes_fe: any[] = [];
  ventasProductos: any[] = [];
  venta_total: number = 0;
  total_cambio: number = 0;
  id_factura: any[] = [];


  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private medio_pago: MedioDePago,
    private cliente_fe: ClientesFeService,
    private message: MessageService,
    private ventas: VentasSerivice,
    private inventario: InventarioService,
    private formventas: FormVentas,
    private secuencia: SecuenciaService,
    private forma_pago: FormaDePago,
    private data_factura: DataFacturaDian
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      cliente: [null, Validators.required],
      medio_pago: [null, Validators.required],
      forma_pago: [null, Validators.required],
      total_pago: [null, Validators.required],
      monto_rec: [null, Validators.required],
      cambio: [null, Validators.required]
    });

    this.visible = false;
    this.habilitado = true;
    this.funct_retorna_medio_de_pago_c();
    this.funct_retorna_forma_de_pago_c();
    this.funct_retorna_all_clientes_fe_c();
    this.funct_retorna_cliente_predeterminado_c();
  }

  funt_close_dialog_detalle_factura() {
    this.visible = false;
  }

  funct_retorna_medio_de_pago_c() {
    this.medio_pago.funt_retorna_medio_de_pago_s().subscribe({
      next: (data: any) => {
        this.medio_de_pago = [];
        data.map((resp: any) => {
          this.medio_de_pago.push({
            id: resp.id,
            nombre: resp.nombre
          });
        })
      }
    })
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
    this.cliente_fe.funct_retorna_one_cliente_s(data.value.ident).subscribe({
      next: (data: any) => {
        this.data_factura_dian = [];
        this.data_factura_dian.push(data[0]);
      }
    });
  }

  funct_retorna_cliente_predeterminado_c() {
    const ident = '222222222222';
    this.cliente_fe.funct_retorna_one_cliente_s(ident).subscribe({
      next: (data: any) => {
        this.data_factura_dian = [];
        this.data_factura_dian.push(data[0]);
      }
    });
  }

  funct_retorna_all_clientes_fe_c() {
    this.cliente_fe.funct_retorna_all_clientes_fe_s().subscribe({
      next: (data: any) => {
        this.data_clientes_fe = [];
        data.map((resp: any) => {
          this.data_clientes_fe.push({
            ident: resp.ident,
            nombre: resp.nombre_cliente
          });

          const data_select = this.data_clientes_fe.find(c => c.ident == '222222222222')
          this.form.patchValue({
            cliente: data_select
          })
        })
      }
    })
  }

  funct_retorna_ventas_c() {
    this.ventas.funct_retorna_ventas_temp().subscribe({
      next: (resp: any) => {
        const data = Array.isArray(resp) ? resp : [];
        this.ventasProductos = [];
        this.ventasProductos = data.filter(
          (item: any) =>
            item.estado_venta === 'Abierto'
        );
        this.venta_total = this.ventasProductos.reduce(
          (total: number, item: any) => total + item.subtotal,
          0
        );
        this.cdr.detectChanges();
        this.form.get('total_pago')?.setValue(this.venta_total);
        this.form.patchValue({
          forma_pago: null,
          monto_rec: null,
          cambio: 0
        })

      }, error: (error: any) => {
        console.error('Error al retornar ventas:', error);
      }
    });
  }


  funct_calcula_efectivo() {
    const monto_recibido = this.form.value.monto_rec
    if (monto_recibido > this.venta_total || monto_recibido == this.venta_total) {
      this.total_cambio = parseInt(this.form.value.monto_rec) - this.venta_total;
      this.form.get('cambio')?.setValue(this.total_cambio);
      return;
    }
    this.total_cambio = 0;
    this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'El monto recibido debe ser igual o mayor a total a paga', life: 3000 });
  }

  funct_close_detalle_factura() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      for (const key in this.form.controls) {
        this.form.controls[key].markAsDirty();
      }
      this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Todos los campos del formulario son obligatorios' });
      return;
    }

    const numFactura = Number(localStorage.getItem('factura'));
    this.ventas.funct_close_ventas_estado(this.ventasProductos).pipe(
      switchMap(() =>
        this.inventario.funct_registra_salidas_s(this.ventasProductos)
      ),
      switchMap(() => {
        return this.secuencia.funct_genera_factura_s(numFactura).pipe(
          switchMap(() => {
            const data = [{
              ident: this.form.value.ident,
              nombre: this.form.value.nombre,
              cambio: this.form.value.cambio,
              forma_pago: this.form.value.forma_pago,
              medio_pago: this.form.value.medio_pago,
              monto_rec: this.form.value.monto_rec,
              total_pago: this.form.value.total_pago,
              data_venta: this.ventasProductos
            }]
            return this.data_factura.funt_envia_factura_dian_s(data)
          })
        )
      })
    ).subscribe({
      next: () => {

        this.visible = false;
        this.formventas.funct_retorna_factura_c();
        setTimeout(() => {
          this.formventas.funct_retorna_ventas();
          this.formventas.functInpuFocus();
        }, 1000)
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error("Error:", error);
      }
    });
  }

}
