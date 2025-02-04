import { ElementType } from "react";

export interface LinkType {
  name: string;
  href: string;
  icon: ElementType;
  children?: LinkType[];
}


