import EquipmentList from "@/components/common/EquipmentList";
import { SearchBar } from "@/components/common/SearchBar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import {
  AppWindow,
  ShoppingBag,
  Cpu,
  Gamepad2,
  Music,
  BookOpen,
  Coffee,
} from "lucide-react"; // hoặc từ thư viện icon bạn đang dùng

const ListCategory = () => {
  const listCategory = [
    {
      id: 1,
      name: "Application",
      icon: <AppWindow size={32} />,
    },
    {
      id: 2,
      name: "Shopping",
      icon: <ShoppingBag size={32} />,
    },
    {
      id: 3,
      name: "Technology",
      icon: <Cpu size={32} />,
    },
    {
      id: 4,
      name: "Gaming",
      icon: <Gamepad2 size={32} />,
    },
    {
      id: 5,
      name: "Music",
      icon: <Music size={32} />,
    },
    {
      id: 6,
      name: "Education",
      icon: <BookOpen size={32} />,
    },
    {
      id: 7,
      name: "Cafe",
      icon: <Coffee size={32} />,
    },
  ];

  return (
    <div className="my-2 grid grid-cols-4 gap-2 py-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-6 xl:grid-cols-7">
      {listCategory.map((category) => (
        <Card
          key={category.id}
          className="bg-muted border-border flex aspect-square cursor-pointer flex-col items-center justify-center gap-0 rounded-lg border p-6 transition-all duration-200 hover:scale-101"
        >
          <div className="text-primary mb-4">{category.icon}</div>
          <p className="line-clamp-2 text-center text-sm leading-tight font-medium">
            {category.name}
          </p>
        </Card>
      ))}
    </div>
  );
};

const AvailableEquipment = () => {
  return (
    <div className="available-equipment">
      <EquipmentList equipments={[]} />
    </div>
  );
};

export default function EquipmentPage() {
  return (
    <>
      <div className="equipment-page">
        <div className="search-bar">
          <SearchBar />
        </div>

        <ListCategory />
        <AvailableEquipment />
      </div>
    </>
  );
}
