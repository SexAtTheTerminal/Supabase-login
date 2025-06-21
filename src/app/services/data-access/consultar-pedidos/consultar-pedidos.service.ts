import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultarPedidosService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  constructor() {}

  async obtenerPedidosDesdeDB(): Promise<any[]> {
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

    //Conversión para la lectura de la tabla sino F :b
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

  obtenerPedidos(): any[] {
    return [
      {
        codigo: 'PD-00000001',
        mesa: '01',
        fecha: new Date('2025-06-15T10:30:00'),
        estado: 'pendiente',
        items: [
          { nombre: 'Hamburguesa', cantidad: 2 },
          { nombre: 'Papas Fritas', cantidad: 1 },
        ],
      },
      {
        codigo: 'PD-00000002',
        mesa: '02',
        fecha: new Date('2025-06-16T12:00:00'),
        estado: 'pendiente',
        items: [
          { nombre: 'Pizza', cantidad: 1 },
          { nombre: 'Cola', cantidad: 2 },
        ],
      },
      {
        codigo: 'PD-00000003',
        mesa: '03',
        fecha: new Date('2025-06-16T14:45:00'),
        estado: 'finalizado',
        items: [
          { nombre: 'Ensalada', cantidad: 1 },
          { nombre: 'Jugo Natural', cantidad: 1 },
        ],
      },
      {
        codigo: 'PD-00000004',
        mesa: '04',
        fecha: new Date('2025-06-17T08:15:00'),
        estado: 'pendiente',
        items: [
          { nombre: 'Té', cantidad: 2 },
          { nombre: 'Pan con Pollo', cantidad: 1 },
        ],
      },
      {
        codigo: 'PD-00000005',
        mesa: '04',
        fecha: new Date('2025-06-17T08:15:00'),
        estado: 'pendiente',
        items: [
          { nombre: 'Té', cantidad: 2 },
          { nombre: 'Pan con Pollo', cantidad: 1 },
        ],
      },
      {
        codigo: 'PD-00000006',
        mesa: '04',
        fecha: new Date('2025-06-17T08:15:00'),
        estado: 'pendiente',
        items: [
          { nombre: 'Té', cantidad: 2 },
          { nombre: 'Pan con Pollo', cantidad: 1 },
        ],
      },
    ];
  }
}
