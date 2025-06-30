import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrarPedidosService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  // Notificador para nuevo pedido registrado
  private readonly pedidoRegistradoSubject = new BehaviorSubject<void>(
    undefined
  );
  pedidoRegistrado$ = this.pedidoRegistradoSubject.asObservable();

  // Llamar cuando se registre un nuevo pedido
  notificarNuevoPedido() {
    this.pedidoRegistradoSubject.next();
  }

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

    // Actualizar estado de la mesa a ocupado (false)
    const { error: errorMesa } = await this._supabaseClient
      .from('Mesa')
      .update({ estado: false })
      .eq('idMesa', idMesa);
    console.log('Actualizando mesa:', idMesa);

    if (errorMesa) {
      console.error('Error al actualizar el estado de la mesa:', errorMesa);
      return false;
    }

    console.log('Pedido y detalles registrados con éxito');
    this.notificarNuevoPedido(); // Notificar a los suscriptores
    return true;
  }

  async obtenerMesas(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Mesa')
      .select(`idMesa, numeroMesa`)
      .eq('estado', true); // Solo mesas desocupadas

    if (error) {
      console.error('Error al obtener mesas:', error);
      return [];
    }

    return data as any[];
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
      tipo: producto.Categoria?.nombreCategoria ?? 'Sin categoría',
      unidad: 'CARTA',
      cantidad: 1,
      precioUnitario: producto.precio,
      subtotal: producto.precio,
      seleccionado: false,
    }));
  }

  async obtenerUltimoIdPedido(): Promise<number | null> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select('idPedido')
      .order('idPedido', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener el último ID de pedido:', error);
      return null;
    }

    return data?.idPedido ?? null;
  }

  async generarNuevoCodigoPedido(): Promise<string> {
    const ultimoId = await this.obtenerUltimoIdPedido();
    const nuevoId = (ultimoId ?? 0) + 1;

    return `PD-${nuevoId.toString().padStart(8, '0')}`;
  }
}
