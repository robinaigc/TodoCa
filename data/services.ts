import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Car,
  ChefHat,
  Hammer,
  Home,
  Truck,
  Trees,
} from "lucide-react";
import type { ServiceCategory } from "@/types";

export interface ServiceCategoryDef {
  id: ServiceCategory;
  nameZh: string;
  descZh: string;
  icon: LucideIcon;
  /** 阶段 B 优先切入的垂直领域 */
  launchPriority?: boolean;
}

/** 华人本地服务七大类（阶段 A 占位，阶段 B 起逐步开放） */
export const SERVICE_CATEGORIES: ServiceCategoryDef[] = [
  {
    id: "home_cleaning",
    nameZh: "家政保洁",
    descZh: "日常打扫、深度清洁、搬入搬出保洁",
    icon: Home,
  },
  {
    id: "lawn_garden",
    nameZh: "园艺户外",
    descZh: "剪草、扫雪、修树、庭院维护",
    icon: Trees,
  },
  {
    id: "home_repair",
    nameZh: "家居维修",
    descZh: "水电、家电、门锁、小型装修",
    icon: Hammer,
  },
  {
    id: "moving",
    nameZh: "搬家货运",
    descZh: "小搬、宜家提货、同城货运",
    icon: Truck,
  },
  {
    id: "auto",
    nameZh: "汽车服务",
    descZh: "换油、换胎、验车、汽车美容",
    icon: Car,
  },
  {
    id: "tutoring",
    nameZh: "教育补习",
    descZh: "K-12 学科、英语、钢琴等一对一辅导",
    icon: BookOpen,
    launchPriority: true,
  },
  {
    id: "food",
    nameZh: "美食餐饮",
    descZh: "华人餐厅、私厨、聚会订餐",
    icon: ChefHat,
  },
];
