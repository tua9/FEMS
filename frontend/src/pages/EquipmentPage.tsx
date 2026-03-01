import EquipmentList from "@/components/common/EquipmentList";
import { SearchBar } from "@/components/common/SearchBar";
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
      name: "Cafe & Lifestyle",
      icon: <Coffee size={32} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
      {listCategory.map((category) => (
        <Card
          key={category.id}
          className="border-border flex aspect-square cursor-pointer flex-col items-center justify-center gap-0 rounded-lg border p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <div className="text-primary mb-4 scale-110">{category.icon}</div>
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
