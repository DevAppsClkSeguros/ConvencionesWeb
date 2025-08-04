import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import type { Card } from '../../interfaces/card.interface';
import { AuthService } from '../../../core/interceptor/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  authService = inject(AuthService);
  cards: Card[] = [
    {
      title: 'Convenciones click',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING', 'Admin'],
      description:
        'Configuración inicial de la convención, creación de encuesta para la evaluación del evento y registro de asistentes.',
      imageUrl: 'assets/images/convenciones/destino.webp',
      buttonText: 'Contratar',
      redirectTo: '/evento',
      visible: true,
      subMenu: [
        { title: 'Convenciones', route: '/convenciones' },
        { title: 'Encuesta', route: '/encuesta/preguntas' },
        { title: 'Convencionistas', route: '/convencionistas' },
      ],
    },
    {
      title: 'Hoteles',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING'],
      description: 'Selección del destino, elección del alojamiento y viajeros',
      imageUrl: 'assets/images/convenciones/informacion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [{ title: 'Hotel', route: '/hoteles' }],
    },
    {
      title: 'Vuelos',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING'],
      description: 'Detalles específicos sobre los vuelos.',
      imageUrl: 'assets/images/convenciones/vuelos.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: 'Vuelos',
          route: '/vuelos',
        },
      ],
    },
    {
      title: 'Actividades',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING'],
      description: 'Lista organizada de actividades y lugares a visitar.',
      imageUrl: 'assets/images/convenciones/actividad2.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: 'Actividades',
          route: '/actividades',
        },
      ],
    },
    {
      title: 'Recomendaciones',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING'],
      description:
        'Recomendaciones de restaurantes y atracciones, sugerencias valiosas para los viajeros que desean aprovechar al máximo su visita.',
      imageUrl: 'assets/images/convenciones/recomendacion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: 'Recomendaciones',
          route: '/recomendaciones',
        },
      ],
    },
    {
      title: 'Configuración',
      roles: ['ROLE_ADMIN', 'ROLE_MARKETING'],
      description:
        'Configuración y control de módulos, actualización de versión de app y registro detallado de las actividades y eventos que ocurren dentro de un sistema.',
      imageUrl: 'assets/images/convenciones/configuracion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        { title: 'Version App', route: '/admin/version-app' },
        { title: 'Control de módulos', route: 'cs-cat-evn-modulos' },
        { title: 'Log de eventos', route: 'log-eventos' },
        {
          title: 'Perfil de convencionistas',
          route: '/convencionistas/perfiles',
        },
        {
          title: 'Categoría de convencionistas',
          route: '/convencionistas/categorias',
        },
        {
          title: 'Categoría de actividades',
          route: '/actividades/categorias',
        },
        {
          title: 'Categoría de recomendaciones',
          route: '/recomendaciones/categorias',
        },
      ],
    },
  ];

  opcionesMenu: Card[] = [];

  ngOnInit() {
    const roles = this.authService.getUserData();
    this.opcionesMenu = this.cards.filter((card) => {
      if (!card.roles || card.roles.length === 0) return true;
      return card.roles.some((r) => roles?.Roles.includes(r));
    });
  }
}
