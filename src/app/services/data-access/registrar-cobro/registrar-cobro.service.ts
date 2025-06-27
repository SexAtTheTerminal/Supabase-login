import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrarCobroService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  //Obtiene solo las ocupadas, me dio weba cambiarle el nombre de la funcion xdd
  async obtenerMesas(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(`idMesa`)
      .order('idMesa', { ascending: true });

    if (error) {
      console.error('Error al obtener mesas:', error);
      return [];
    } else {
      return data as any[];
    }
  }

  async obtenerPedidosdelaMesa(mesa: number): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(
        `
        DetallePedido (
          idProducto,
          cantidad,
          Producto (
            nombreProducto,
            precio
          )
        )
      `
      )
      .eq('idMesa', mesa);

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    return data.map((pedido: any) => {
      return {
        items: pedido.DetallePedido.map((detalle: any) => ({
          nombre: detalle.Producto?.nombreProducto || 'Producto desconocido',
          cantidad: detalle.cantidad,
          precio: detalle.Producto?.precio,
        })),
      };
    });
  }
}
