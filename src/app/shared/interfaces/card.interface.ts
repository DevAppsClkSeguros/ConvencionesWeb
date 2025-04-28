export interface Card {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonClass?: string;
  redirectTo: string;
  visible: boolean;
  subMenu: SubMenu[];
}

export interface SubMenu {
    title: string;
    route: string;
}
