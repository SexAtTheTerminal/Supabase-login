import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultarPedidosService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  constructor() {}

  async obtenerPedidosDesdeDB(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(
        `
        idPedido,
        created_at,
        idMesa,
        estado,
        DetallePedido (
          idProducto,
          cantidad,
          Producto ( nombreProducto )
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    return data.map((pedido: any) => {
      return {
        idPedido: pedido.idPedido,
        codigo: `PD-${pedido.idPedido.toString().padStart(8, '0')}`,
        mesa: pedido.idMesa.toString().padStart(2, '0'),
        fecha: new Date(pedido.created_at),
        estado: pedido.estado ? 'finalizado' : 'pendiente',
        items: pedido.DetallePedido.map((detalle: any) => ({
          nombre: detalle.Producto?.nombreProducto ?? 'Producto desconocido',
          cantidad: detalle.cantidad,
        })),
      };
    });
  }

  async eliminarPedido(idPedido: number): Promise<boolean> {
    const { error } = await this._supabaseClient
      .from('Pedido')
      .delete()
      .eq('idPedido', idPedido);

    if (error) {
      console.error('Error al eliminar el pedido:', error);
      return false;
    }

    return true;
  }
}
