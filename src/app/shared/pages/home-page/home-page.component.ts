import { Component, OnInit, signal } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { Card } from '../../interfaces/card.interface';

@Component({
  selector: 'app-home-page',
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  // cards = signal<Card[]>([]);
  cards: Card[] = [
    {
  title: 'HOla',
  description: 'Sitios web modernos y responsive',
  imageUrl:
    'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
  buttonText: 'Contratar',
  redirectTo: '/evento'
},
{
  title: 'HOla',
  description: 'Sitios web modernos y responsive',
  imageUrl:
    'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
  buttonText: 'Contratar',
  redirectTo: ''
},
{
  title: 'HOla',
  description: 'Sitios web modernos y responsive',
  imageUrl:
    'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
  buttonText: 'Contratar',
  redirectTo: ''
},
{
  title: 'HOla',
  description: 'Sitios web modernos y responsive',
  imageUrl:
    'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
  buttonText: 'Contratar',
  redirectTo: ''
}
  ]

  ngOnInit() {
    // this.cards.set([
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    //   {
    //     title: 'HOla',
    //     description: 'Sitios web modernos y responsive',
    //     imageUrl:
    //       'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    //     buttonText: 'Contratar',
    //   },
    // ]);
  }
}
