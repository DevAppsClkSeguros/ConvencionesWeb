import type { Imagen } from '../interfaces/imagen.interface';
import type { MicrosoftItem } from '../interfaces/microsoftGraph.interface';

export class ImageMapper {
  static mapMicrosoftItemToImage(item: MicrosoftItem): Imagen {
    return {
      id: item.id,
      title: item.name,
      url: item.thumbnails[0].large.url,
    };
  }

  static mapMicrosoftItemToImageArray(item: MicrosoftItem[]): Imagen[] {
    return item.map(this.mapMicrosoftItemToImage);
  }
}
