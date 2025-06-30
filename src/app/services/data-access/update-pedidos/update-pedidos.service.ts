import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UpdatePedidosService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  constructor() {}

  async obtenerPedidos(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(
        `
        idPedido,
        fecha,
        idMesa,
        estado,
        DetallePedido (
          idProducto,
          cantidad,
          Producto ( nombreProducto )
        )
      `
      )
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    return data.map((pedido: any) => {
      return {
        idPedido: pedido.idPedido,
        codigo: `PD-${pedido.idPedido.toString().padStart(8, '0')}`,
        mesa: pedido.idMesa.toString().padStart(2, '0'),
        fecha: new Date(pedido.fecha),
        estado: pedido.estado ? 'finalizado' : 'pendiente',
        items: pedido.DetallePedido.map((detalle: any) => ({
          nombre: detalle.Producto?.nombreProducto || 'Producto desconocido',
          cantidad: detalle.cantidad,
        })),
      };
    });
  }

  async actualizarEstadoPedido(pedido: any): Promise<void> {
    const { data: pedidoActual, error: errorSelect } = await this._supabaseClient
      .from('Pedido')
      .select('estado')
      .eq('idPedido', pedido.idPedido)
      .single();

    if (errorSelect) {
      console.error('Error al obtener el pedido:', errorSelect);
      return;
    }

    // Invertimos el estado actual
    const nuevoEstado = !pedidoActual.estado;

    // Actualizamos el estado
    const { data, error: errorUpdate } = await this._supabaseClient
      .from('Pedido')
      .update({ estado: nuevoEstado })
      .eq('idPedido', pedido.idPedido)
      .select();

    if (errorUpdate) {
      console.error('Error al actualizar el estado:', errorUpdate);
      return;
    }

    console.log('Estado actualizado correctamente:', data);
  }
}
