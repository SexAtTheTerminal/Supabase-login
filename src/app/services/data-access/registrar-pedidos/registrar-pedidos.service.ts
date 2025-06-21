import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrarPedidosService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  constructor() {}

  async agregarPedidoConDetalles(
    idMesa: number,
    idModalidad: number,
    montoTotal: number,
    estado: boolean,
    items: {
      cantidad: number;
      descripcion: string;
      id: number;
      precio: number;
      precioUnitario: number;
      seleccionado: boolean;
      subtotal: number;
      tipo: string;
      unidad: string;
    }[]
  ): Promise<boolean> {
    const { data: pedidoInsertado, error: errorPedido } =
      await this._supabaseClient
        .from('Pedido')
        .insert([
          {
            fecha: new Date().toISOString(),
            idMesa,
            idModalidad,
            montoTotal: montoTotal,
            estado,
          },
        ])
        .select('idPedido');

    if (errorPedido || !pedidoInsertado || pedidoInsertado.length === 0) {
      console.error('Error al insertar el pedido:', errorPedido);
      return false;
    }

    const idPedido = pedidoInsertado[0].idPedido;

    const detalles = items.map((item) => ({
      idPedido,
      idProducto: item.id,
      cantidad: item.cantidad,
      subTotal: item.subtotal,
    }));

    const { error: errorDetalles } = await this._supabaseClient
      .from('DetallePedido')
      .insert(detalles);

    if (errorDetalles) {
      console.error(
        'Error al insertar los detalles del pedido:',
        errorDetalles
      );
      return false;
    }

    console.log('Pedido y detalles registrados con éxito');
    return true;
  }

  async obtenerMesas(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Mesa')
      .select(`idMesa, numeroMesa `);

    if (error) {
      console.error('Error al obtener mesas:', error);
      return [];
    } else {
      return data as any[];
    }
  }

  async obtenerModalidad(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Modalidad')
      .select(`idModalidad, nombreModalidad `);

    if (error) {
      console.error('Error al obtener modalidades:', error);
      return [];
    } else {
      return data as any[];
    }
  }

  async obtenerProductosDesdeDB(): Promise<any[]> {
    const { data, error } = await this._supabaseClient.from('Producto').select(`
        idProducto,
        nombreProducto,
        precio,
        Categoria (
          nombreCategoria
        )
      `);

    if (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }

    return data.map((producto: any) => ({
      id: producto.idProducto,
      descripcion: producto.nombreProducto,
      precio: producto.precio,
      tipo: producto.Categoria?.nombreCategoria || 'Sin categoría',
      unidad: 'PLATO',
      cantidad: 1,
      precioUnitario: producto.precio,
      subtotal: producto.precio,
      seleccionado: false,
    }));
  }
}
