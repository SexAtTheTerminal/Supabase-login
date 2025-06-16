import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsultarPedidosService {
  constructor() {}

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
