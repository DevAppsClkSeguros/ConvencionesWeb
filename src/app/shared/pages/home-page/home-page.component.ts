import { Component, OnInit, signal } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { Card } from '../../interfaces/card.interface';

@Component({
  selector: 'app-home-page',
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  // cards = signal<Card[]>([]);
  cards: Card[] = [
    {
      title: 'Convenciones click',
      description:
        'Configuración inicial de la convención, creación de encuesta para la evaluación del evento y registro de asistentes.',
      imageUrl: 'assets/images/convenciones/destino.webp',
      buttonText: 'Contratar',
      redirectTo: '/evento',
      visible: true,
      subMenu: [
        { title: 'Convención', route: '/evento' },
        { title: 'Encuesta', route: 'cs-cat-evn-preguntas' },
        { title: 'Usuarios', route: 'cs-dat-evn-validacion' },
      ],
    },
    {
      title: 'Información general',
      description: 'Selección del destino, elección del alojamiento y viajeros',
      imageUrl: 'assets/images/convenciones/informacion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        { title: 'Nuestro destino', route: 'cs-dat-evn-nuestro-dest' },
        { title: 'Hotel', route: 'cs-dat-evn-hotel' },
      ],
    },
    {
      title: 'Vuelos',
      description: 'Detalles específicos sobre los vuelos.',
      imageUrl: 'assets/images/convenciones/vuelos.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: 'Vuelos',
          route: 'cs-dat-evn-vuelos',
        },
      ],
    },
    {
      title: 'Actividades',
      description: 'Lista organizada de actividades y lugares a visitar.',
      imageUrl: 'assets/images/convenciones/actividad2.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: '',
          route: '',
        },
      ],
    },
    {
      title: 'Recomendaciones',
      description:
        'Recomendaciones de restaurantes y atracciones, sugerencias valiosas para los viajeros que desean aprovechar al máximo su visita.',
      imageUrl: 'assets/images/convenciones/recomendacion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        {
          title: 'Recomendaciones',
          route: 'cs-dat-evn-recomendaciones',
        },
      ],
    },
    {
      title: 'Configuración',
      description:
        'Configuración y control de módulos, actualización de versión de app y registro detallado de las actividades y eventos que ocurren dentro de un sistema.',
      imageUrl: 'assets/images/convenciones/configuracion.webp',
      buttonText: 'Contratar',
      redirectTo: '',
      visible: true,
      subMenu: [
        { title: 'Version App', route: 'cs-evn-cat-version-app' },
        { title: 'Control de módulos', route: 'cs-cat-evn-modulos' },
        { title: 'Log de eventos', route: 'log-eventos' },
        { title: 'Perfil de usuario', route: 'cs-cat-evn-perfil' },
        { title: 'Tipo usuario', route: 'cat-tipo-usuario' },
        { title: 'Categoría de actividades', route: 'cat-eventos' },
        { title: 'Categoría de recomendaciones', route: 'cat-recomendaciones' },
      ],
    },
  ];
  opcionesMenu: any = [];

  ngOnInit() {}
}
