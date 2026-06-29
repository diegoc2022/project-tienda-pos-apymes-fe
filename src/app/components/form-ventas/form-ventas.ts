import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VinculosService } from '../vinculos/services/vinculos.service';
import { SecuenciaService } from '../utils/services/secuencia';
import { PagosConsumosServices } from '../pagos-consumos/services/pagos-consumos.services';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { VentasSerivice } from './services/ventas.serivice';
import { InventarioService } from '../inventario/services/inventario.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { BuscaProductos } from '../busca-productos/busca-productos';
import { ChangeDetectorRef } from '@angular/core';
import { OtrasVentas } from '../otras-ventas/otras-ventas';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ImprimeService } from '../detalle-factura/services/imprime.service';
import { format } from 'date-fns';
import { ClientesService } from '../clientes/services/clientes.service';
import { AperturaCajaService } from '../apertura-caja/services/apertura-caja.service';
import { DetalleFacturaFe } from '../detalle-factura-fe/detalle-factura-fe';



@Component({
  selector: 'app-form-ventas',
  standalone: true,
  templateUrl: './form-ventas.html',
  styleUrl: './form-ventas.scss',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    BadgeModule,
    OverlayBadgeModule,
    DetalleFacturaFe,
    BuscaProductos,
    OtrasVentas
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormVentas implements OnInit {
  products: any[] = [];
  fecha_apertura: any = '';
  selectedProduct1?: any;
  selectedProduct2?: any[];
  data: FormGroup = new FormGroup({});
  data2: FormGroup = new FormGroup({});
  data3: FormGroup = new FormGroup({});
  formFactura: FormGroup = new FormGroup({});
  total_venta: number = 0;
  total_articulos: number = 1;
  idApertCaja: any = 0;
  factura: any = 0;
  habilitado: boolean = true;
  producto_unidad: any[] = [];
  elimina_paquete_producto: any[] = [];
  idSecuencia: any[] = [];
  clientes: any[] = [];
  isChecked: boolean = false;
  codigo_venta: number = 0;
  intervalo: any;
  cantidad: boolean = false;
  numTicket: any;
  user: any;
  id_caja: any;
  mostrarDialog: boolean = false;
  mostrarDialog2: boolean = false;
  mostrarDialog3: boolean = false;
  mostrarDialog4: boolean = false;
  mostrarDialog5: boolean = false;
  mostrarDialog6: boolean = false;
  fecha_actual: any = '';
  date: Date = new Date();
  num_mes: any = '';
  num_year: any = '';
  data_venta: any[] = [];


  constructor(
    private ventas: VentasSerivice,
    private message: MessageService,
    private vinculos: VinculosService,
    private secuencia: SecuenciaService,
    private reimprime: ImprimeService,
    private fb: FormBuilder,
    private r_cliente: ClientesService,
    private pagos_c: PagosConsumosServices,
    private inventario: InventarioService,
    private cdr: ChangeDetectorRef,
    private apertura_c: AperturaCajaService

  ) {

  }

  ngOnInit() {
    this.data = this.fb.group({
      codProducto: [null]
    });

    this.data2 = this.fb.group({
      cantidad: [null, Validators.required]
    });

    this.data3 = this.fb.group({
      cliente: [null, Validators.required],
      codigo_venta: [null, Validators.required]
    });

    this.formFactura = this.fb.group({
      factura: [null, Validators.required]
    });
    this.user = localStorage.getItem('user');
    this.funct_retorna_ventas();
    this.funct_retorna_clientes_c();
    this.funct_retorna_factura_c();
    this.functInpuFocus();
    this.mostrarDialog = false;
    this.mostrarDialog2 = false;
    this.mostrarDialog3 = false;
    this.mostrarDialog4 = false;
    this.mostrarDialog5 = false;
    this.mostrarDialog6 = false
    this.total_articulos = 1;
    this.habilitado = true
    this.fecha_apertura = localStorage.getItem('fecha_apertura');
    this.fecha_actual = format(this.date, 'yyyy-MM-dd');
    this.factura = localStorage.getItem('factura');
    this.num_mes = format(this.date, 'M');
    this.num_year = format(this.date, 'yyyy');

    if (this.total_articulos == 1) {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }

  }

  funct_genera_factura_c() {
    this.numTicket = Number(localStorage.getItem('factura'));
    this.idSecuencia.length = 0;
    this.idSecuencia.push({
      numero_factura: this.numTicket,
    })
  }

  funct_retorna_ventas() {
    this.ventas.funct_retorna_ventas_temp().subscribe({
      next: (result: any) => {
        const data = Array.isArray(result) ? result : [];
        this.products = data.filter((v: any) => v.estado_venta === 'Abierto').reverse();
        this.total_articulos = this.products.length;
        this.total_venta = 0;
        this.habilitado = false;
        this.cantidad = false;
        this.products.forEach((item: any) => {
          this.total_venta += item.total_neto;
          if (
            item.existencia < 1 ||
            item.precio_compra > item.precio_venta
          ) {
            this.habilitado = true;
            this.cantidad = true;
          }

        });
        this.cdr.detectChanges();
      }, error: (error) => {
        console.error('Error al retornar ventas:', error);
      }
    });
  }

  funct_retorna_apertura_caja() {
    this.apertura_c.funct_retorna_apertura_caja(this.user).subscribe({
      next: (data: any) => {

      }
    })
  }

  funct_retorna_producto_lectura() {
    const codigo = this.data.value.codProducto;
    if (!codigo) {
      return;
    }
    if (this.fecha_apertura != this.fecha_actual) {
      this.message.add({ severity: 'warn', summary: 'Advertencia:', detail: 'Para realizar una venta, primero debe crear apertura de caja', life: 5000 });
      this.data.patchValue({
        codProducto: ''
      });
      return;
    }

    this.vinculos.funct_retorna_codigo_inicial(codigo)
      .pipe(
        switchMap((result: any) => {
          return this.apertura_c.funct_retorna_apertura_caja(this.user).pipe(
            tap((data: any) => {
              console.log("id caja: ", data);
              this.data_venta = [];
              this.data_venta.push({
                data: [result[0].producto],
                id_caja: data.id_caja,
                factura: this.factura,
                user: this.user,
                sucursal: 1
              })
            })
          )
        }),
        switchMap(() => {
          return this.ventas.funct_registra_ventas_temp(this.data_venta);
        })
      )
      .subscribe({
        next: (result: any) => {


          this.data.patchValue({
            codProducto: ''
          });
          this.funct_retorna_ventas();
          this.functInpuFocus();
          this.cdr.detectChanges();

        }
      })

  }

  funct_retorna_factura_c() {
    this.secuencia.funct_retorna_factura_s().subscribe({
      next: (id: any) => {
        setTimeout(() => {
          this.factura = 0;
          this.factura = id.num_secuencia + 1;
          localStorage.setItem('factura', this.factura);
          this.cdr.detectChanges();
        }, 1000)
      }
    })
    if (this.total_articulos == 0) {
      this.habilitado = false;
    }
  }

  funct_edita_cantidad_venta(product: any) {
    this.ventas.funct_edita_cantidad_venta_s(product).subscribe({
      next: data => {
        this.funct_retorna_ventas();
        this.functInpuFocus();
        this.cdr.detectChanges();
      }
    })
  }



  funct_elimina_item_yentas(product: any) {
    this.ventas.funct_elimina_ventas_temp(product).pipe(
      switchMap(() =>
        this.ventas.funct_retorna_ventas_temp()
      ), tap((carrito: any) => {

        const abiertos = carrito.filter((item: any) => item.estado_venta === 'Abierto');
        this.products = abiertos.sort((a: any, b: any) => b.id - a.id);

        this.total_articulos = abiertos.length;

        this.total_venta = abiertos.reduce(
          (acc: any, item: any) => acc + item.subtotal,
          0
        );

        this.habilitado = false;
        //this.cantidad = false;
        this.producto_unidad = [];
        this.functInpuFocus();
        this.message.clear();
        this.message.add({
          severity: 'warn',
          summary: 'Advertencia:',
          detail: 'Se ha eliminado un producto del carrito de compras.',
          life: 3000
        });

      })

    ).subscribe({

      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'No se pudo eliminar el producto',
          life: 3000
        });
      }

    });

  }

  funct_dialog_detalle_factura() {
    this.mostrarDialog5 = false;
    this.cdr.detectChanges();
    this.mostrarDialog5 = true;
  }

  funt_dialog_busca_productos() {
    this.mostrarDialog = false;
    this.cdr.detectChanges();
    this.mostrarDialog = true;
  }

  funct_dialog_otras_ventas() {
    this.mostrarDialog2 = false;
    this.cdr.detectChanges();
    this.mostrarDialog2 = true;
  }

  funct_dialog_reimprimir_factura() {
    this.mostrarDialog4 = false;
    this.cdr.detectChanges();
    this.mostrarDialog4 = true;
  }

  functInpuFocus() {
    const nextElement = (document.querySelector(`[formControlName="codProducto"]`) as HTMLElement);
    nextElement.focus();
  }

  funct_reimprime_facturas() {
    this.idSecuencia.length = 0;
    this.idSecuencia.push({
      numero_factura: this.formFactura.value.factura
    })

    if (this.idSecuencia[0].numero_factura != '' || this.idSecuencia[0].numero_factura != 0) {
      this.reimprime.funct_imprime_facturas(this.idSecuencia[0].numero_factura);
      this.functInpuFocus();
    } else {
      this.message.add({ severity: 'error', summary: 'Error:', detail: 'Para reimprimir debe ingresar un número de ticket', life: 3000 });
    }

  }

  funct_elimina_id_ventas() {
    Swal.fire({
      title: '¡Avertencia!',
      text: '¿Desea eliminar todos los productos del carrito de compras?',
      icon: 'warning',
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si deseo eliminarlos',
      cancelButtonText: 'No eliminar',
    } as SweetAlertOptions).then((result) => {
      if (result.value) {
        this.ventas.funct_elimina_id_ventas(this.products).subscribe({
          next: () => {
            // 🔥 Limpiar frontend directamente
            this.products = [];
            this.total_articulos = 0;
            this.total_venta = 0;

            this.functInpuFocus();

            this.message.add({
              severity: 'warn',
              summary: 'Advertencia:',
              detail: 'Se han eliminado todos los productos del carrito de compras.',
              life: 3000
            });

          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message || 'No se pudo eliminar',
              life: 3000
            });
          }

        });

      }
    });
  }

  onRowSelect(event: any) {
    this.vinculos.funct_retorna_codigo_inicial(event.data.codProd).subscribe({
      next: (result: any) => {
        if (result.length > 0) {
          this.ventas.funct_elimina_ventas_temp(this.elimina_paquete_producto[0]).subscribe({
            next: (data2: any) => {
              this.data_venta = [];
              this.data_venta.push({
                data: [result[0].producto],
                id_caja: this.idApertCaja,
                factura: this.factura,
                user: this.user,
                sucursal: 1
              });

              this.ventas.funct_registra_ventas_temp(this.data_venta).subscribe({
                next: data => {
                  this.funct_retorna_ventas();
                  this.functInpuFocus();
                }
              });
            }
          })
          this.mostrarDialog3 = false;
          this.cdr.detectChanges();
        }
      }
    })
  }

  funct_show_dialog_unidad(product: any) {
    this.mostrarDialog3 = false;
    this.cdr.detectChanges();
    this.mostrarDialog3 = true;
    this.elimina_paquete_producto.length = 0;
    this.vinculos.funct_retorna_codigo_inicial(product.codProd).subscribe({
      next: (data: any) => {
        this.producto_unidad.length = 0;
        this.producto_unidad.push(data[1].producto);
        this.elimina_paquete_producto.push({
          id: product.id,
          codProd: product.codProd
        });
        this.cdr.detectChanges();
      }

    })

  }

  on_checkbox_change(event: any) {
    if (event.checked == true) {
      this.isChecked = true;
      this.mostrarDialog6 = false;
      this.cdr.detectChanges();
      this.mostrarDialog6 = true;

      if (this.cantidad == true) {
        this.habilitado = true;
      } else {
        this.habilitado = false;
      }
    }
  }

  funct_retorna_clientes_c() {
    this.r_cliente.funct_retorna_clientes_s().subscribe({
      next: (data: any) => {
        const objData = JSON.stringify(data);
        const obj = JSON.parse(objData);
        this.clientes = [];
        for (let index = 0; index < obj.length; index++) {
          this.clientes.push(obj[index]);
        }
      }
    })
  }

  on_gialog_hide() {
    this.isChecked = false;
    this.functInpuFocus();
    if (this.cantidad == true) {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
  }

  funct_registra_ventas_x_cobrar_c() {
    if (this.data3.invalid) {
      this.data3.markAllAsTouched();
      Object.values(this.data3.controls).forEach(control => control.markAsDirty());
      this.message.add({
        severity: 'warn',
        summary: 'Advertencia:',
        detail: 'Para guardar ventas por cobrar, primero debe elegir un cliente',
        life: 5000
      });
      return;
    }

    if (this.products.length === 0) {
      this.message.add({
        severity: 'warn',
        summary: 'Advertencia:',
        detail: 'No hay productos para asociar a este cliente.',
        life: 3000
      });
      return;
    }

    this.funct_genera_factura_c();

    this.pagos_c.funct_registra_ventas_x_cobrar_s(this.products, this.data3.value).pipe(

      switchMap(() => this.inventario.funct_registra_salidas_s(this.products)),

      switchMap(() => this.secuencia.funct_genera_factura_s(this.idSecuencia)),

      switchMap(() => this.ventas.funct_elimina_id_ventas(this.products))

    ).subscribe({
      next: () => {

        this.funct_retorna_factura_c();
        this.mostrarDialog6 = false;
        this.functInpuFocus();
        this.data3.reset();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.funct_retorna_ventas();
        }, 1000)

        this.message.add({
          severity: 'success',
          summary: 'Informativo:',
          detail: 'Ventas por cobrar guardadas exitosamente.',
          life: 3000
        });
      },
      error: (err) => {
        console.error(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un problema al guardar la venta.',
          life: 4000
        });
      }
    });
  }


  funct_retorna_one_cliente_c(data: any) {
    this.codigo_venta = 0;
    this.r_cliente.funct_retorna_one_cliente(data.value).subscribe({
      next: (data: any) => {
        for (let index = 0; index < data.length; index++) {
          this.data3.get('codigo_venta')?.setValue(parseInt(data[index].codigo_venta));
        }
      }
    })
  }
}
