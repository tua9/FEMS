import { SearchBar } from "@/components/common/SearchBar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionDatatable, {
  type Item,
} from "@/components/shadcn-studio/blocks/datatable-transaction";

const transactionData: Item[] = [
  {
    id: "1",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    avatarFallback: "DX",
    name: "Dell XPS 15",
    device_id: "DELL-XPS-001",
    transaction_id: "TXN-2025-1000",
    period: "01 Oct - 08 Oct 2025",
    status: "borrowing",
  },
  {
    id: "2",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    avatarFallback: "MP",
    name: 'MacBook Pro 14"',
    device_id: "MAC-PRO-002",
    transaction_id: "TXN-2025-1001",
    period: "05 Oct - 12 Oct 2025",
    status: "returned",
  },
  {
    id: "3",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-3.png",
    avatarFallback: "HP",
    name: "HP LaserJet Pro",
    device_id: "HP-LJP-003",
    transaction_id: "TXN-2025-1002",
    period: "10 Oct - 17 Oct 2025",
    status: "pending",
  },
  {
    id: "4",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
    avatarFallback: "LG",
    name: "LG UltraWide Monitor",
    device_id: "LG-UW-004",
    transaction_id: "TXN-2025-1003",
    period: "12 Oct - 21 Oct 2025",
    status: "overdue",
  },
  {
    id: "5",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png",
    avatarFallback: "EP",
    name: "Epson Projector EB-X",
    device_id: "EPS-PJ-005",
    transaction_id: "TXN-2025-1004",
    period: "15 Oct - 22 Oct 2025",
    status: "returned",
  },
  {
    id: "6",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png",
    avatarFallback: "IP",
    name: "iPad Pro 12.9",
    device_id: "IPAD-PRO-006",
    transaction_id: "TXN-2025-1005",
    period: "18 Oct - 25 Oct 2025",
    status: "borrowing",
  },
  {
    id: "7",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    avatarFallback: "CE",
    name: "Canon EOS 90D",
    device_id: "CAN-90D-007",
    transaction_id: "TXN-2025-1006",
    period: "20 Oct - 27 Oct 2025",
    status: "pending",
  },
  {
    id: "8",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    avatarFallback: "RP",
    name: "Raspberry Pi 4B",
    device_id: "RPI-4B-008",
    transaction_id: "TXN-2025-1007",
    period: "22 Oct - 29 Oct 2025",
    status: "returned",
  },
  {
    id: "9",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-3.png",
    avatarFallback: "CS",
    name: "Cisco Switch 24P",
    device_id: "CSC-SW24-009",
    transaction_id: "TXN-2025-1008",
    period: "25 Oct - 01 Nov 2025",
    status: "overdue",
  },
  {
    id: "10",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
    avatarFallback: "SW",
    name: "Sony WH-1000XM5",
    device_id: "SNY-WH5-010",
    transaction_id: "TXN-2025-1009",
    period: "28 Oct - 04 Nov 2025",
    status: "borrowing",
  },
  {
    id: "11",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png",
    avatarFallback: "WI",
    name: "Wacom Intuos Pro",
    device_id: "WAC-INT-011",
    transaction_id: "TXN-2025-1010",
    period: "01 Nov - 08 Nov 2025",
    status: "pending",
  },
  {
    id: "12",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png",
    avatarFallback: "AH",
    name: "Anker USB-C Hub",
    device_id: "ANK-HUB-012",
    transaction_id: "TXN-2025-1011",
    period: "03 Nov - 10 Nov 2025",
    status: "returned",
  },
  {
    id: "13",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    avatarFallback: "BS",
    name: "Bose SoundLink Max",
    device_id: "BSE-SLM-013",
    transaction_id: "TXN-2025-1012",
    period: "05 Nov - 14 Nov 2025",
    status: "overdue",
  },
  {
    id: "14",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    avatarFallback: "AM",
    name: "Arduino Mega 2560",
    device_id: "ARD-M2560-014",
    transaction_id: "TXN-2025-1013",
    period: "08 Nov - 15 Nov 2025",
    status: "borrowing",
  },
  {
    id: "15",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-3.png",
    avatarFallback: "GH",
    name: "GoPro Hero 12",
    device_id: "GPR-H12-015",
    transaction_id: "TXN-2025-1014",
    period: "10 Nov - 17 Nov 2025",
    status: "returned",
  },
  {
    id: "16",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
    avatarFallback: "NZ",
    name: "Nikon Z50 Camera",
    device_id: "NKN-Z50-016",
    transaction_id: "TXN-2025-1015",
    period: "12 Nov - 21 Nov 2025",
    status: "pending",
  },
  {
    id: "17",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png",
    avatarFallback: "DM",
    name: "DJI Mini 4 Pro",
    device_id: "DJI-M4P-017",
    transaction_id: "TXN-2025-1016",
    period: "15 Nov - 22 Nov 2025",
    status: "overdue",
  },
  {
    id: "18",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png",
    avatarFallback: "SG",
    name: "Samsung Galaxy Tab S9",
    device_id: "SAM-GTS9-018",
    transaction_id: "TXN-2025-1017",
    period: "18 Nov - 27 Nov 2025",
    status: "borrowing",
  },
  {
    id: "19",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    avatarFallback: "TX",
    name: "ThinkPad X1 Carbon",
    device_id: "LNV-X1C-019",
    transaction_id: "TXN-2025-1018",
    period: "20 Nov - 29 Nov 2025",
    status: "returned",
  },
  {
    id: "20",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    avatarFallback: "LM",
    name: "Logitech MX Keys",
    device_id: "LOG-MX-020",
    transaction_id: "TXN-2025-1019",
    period: "25 Nov - 05 Dec 2025",
    status: "pending",
  },
];

const BorrowingHistoryTab = () => {
  return (
    <Card className="bg-muted text-muted-foreground col-span-full w-full rounded p-0">
      <TransactionDatatable data={transactionData} />
    </Card>
  );
};

const CurrentBorrowingTab = () => {
  const items = transactionData.filter((item) => item.status === "borrowing");
  return (
    <Card className="bg-muted text-muted-foreground col-span-full w-full rounded p-0">
      <TransactionDatatable data={items} />
    </Card>
  );
};

const PendingRequestsTab = () => {
  const items = transactionData.filter((item) => item.status === "pending");
  return (
    <Card className="bg-muted text-muted-foreground col-span-full w-full rounded p-0">
      <TransactionDatatable data={items} />
    </Card>
  );
};

const BorrowHistoryTable = () => {
  const tabs = [
    {
      value: "borrowing-history",
      label: "Borrowing history",
      component: <BorrowingHistoryTab />,
    },
    {
      value: "current-borrowing",
      label: "Current borrowing",
      component: <CurrentBorrowingTab />,
    },
    {
      value: "pending-requests",
      label: "Pending requests",
      component: <PendingRequestsTab />,
    },
  ];

  return (
    <Tabs defaultValue="borrowing-history" className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="bg-muted text-muted-foreground text-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="text-muted-foreground w-fulltext-sm rounded-none border-none"
        >
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

const BorrowHistory = () => {
  return (
    <div className="mx-auto w-full">
      <div className="mb-12 text-left">
        <h1 className="text-foreground mb-2 text-4xl font-extrabold">
          My History
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          Keep track of your past equipment borrowings and service resolutions.
        </p>
      </div>

      <div className="space-y-8">
        <SearchBar />
        <BorrowHistoryTable />
      </div>
    </div>
  );
};

export default BorrowHistory;
