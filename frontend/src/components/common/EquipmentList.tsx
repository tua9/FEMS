import { ArrowRightIcon, HeartIcon, ShoppingCartIcon } from "lucide-react";

import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

export type EquipmentItem = {
  image: string;
  imgAlt: string;
  name: string;
  price: number;
  salePrice?: number;
  badges: string[];
};

type EquipmentProps = {
  equipments: EquipmentItem[];
};

const equipmentList = [
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png",
    imgAlt: "Samsung Galaxy Watch 6",
    name: "Samsung Galaxy Watch 6 Classic",
    badges: ["Watch", "Samsung"],
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png",
    imgAlt: "Samsung Galaxy Watch 7",
    name: "Samsung Galaxy Watch 7",
    badges: ["Watch", "Samsung"],
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
    imgAlt: "Samsung Galaxy Watch Ultra",
    name: "Samsung Galaxy Watch Ultra",
    badges: ["Watch", "Samsung"],
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-3.png",
    imgAlt: "Samsung Galaxy Watch 7",
    name: "Samsung Galaxy Watch 7",
    badges: ["Watch", "Samsung"],
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    imgAlt: "Spigen Rugged Armor Pro",
    name: "Spigen Rugged Armor Pro",
    badges: ["Watch", "Spigen"],
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    imgAlt: "Mosmoc Rugged No Gap",
    name: "Mosmoc Rugged No Gap",
    badges: ["Watch", "Samsung"],
  },
];

const EquipmentList = ({ equipments }: EquipmentProps) => {
  if (equipments.length === 0) {
    equipments = equipmentList;
  }
  return (
    <section className="py-2">
      <div className="space-y-6">
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <span className="material-symbols-outlined text-primary">
            inventory_2
          </span>
          All Equipments
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Product Cards */}
          {equipments.map((equipment, index) => (
            <Card
              key={index}
              className={cn(
                "border-border bg-card overflow-hidden border shadow-sm transition-all hover:shadow-md",
                equipment.salePrice && "relative",
              )}
            >
              {/* Sale Badge */}
              {equipment.salePrice && (
                <Badge className="bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive absolute top-4 left-4 rounded-sm px-3 py-1 uppercase focus-visible:outline-none">
                  In use
                </Badge>
              )}

              <CardContent className="flex flex-1 flex-col justify-between gap-6 p-6">
                {/* Product Image */}
                <a href="#" className="block w-full">
                  <img
                    src={equipment.image}
                    alt={equipment.imgAlt}
                    className="mx-auto aspect-square w-full max-w-[180px] object-contain"
                  />
                </a>

                {/* Product Details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 text-center">
                    <a href="#">
                      <h3 className="text-xl font-semibold">
                        {equipment.name}
                      </h3>
                    </a>
                    <div className="flex items-center justify-center gap-2">
                      {equipment.badges.map((badge, idx) => (
                        <Badge
                          key={idx}
                          className="rounded-sm bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Product Price */}
                  <div className="flex items-center justify-center">
                    <Button variant="default" className="w-full">
                      Request Borrow <ArrowRightIcon />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentList;
