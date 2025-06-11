import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventoryHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddItem: () => void;
  onExportInventory: () => void;
  onImportInventory: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InventoryHeader({
  searchTerm,
  setSearchTerm,
  onAddItem,
  onExportInventory,
  onImportInventory,
}: InventoryHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Firearms Inventory</h1>
          <p className="text-muted-foreground">Manage and track your firearms collection.</p>
        </div>

        <Separator
          orientation="horizontal"
          className="bg-[#8E9196] h-[1px] w-full my-4 lg:hidden"
        />

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-[#8E9196]"
            />
          </div>

          <div className="flex gap-1 flex-nowrap">
            <Button
              variant="outline"
              onClick={onExportInventory}
              // size="lg"
              className="flex-shrink-0 whitespace-nowrap"
            >
              <Download className="h-4 w-4 mr-1" />
              {!isMobile && "Export"}
            </Button>

            <div className="relative">
              <input
                type="file"
                id="import-file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={onImportInventory}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("import-file")?.click()}
                className="flex-shrink-0 whitespace-nowrap"
              >
                <Upload className="h-4 w-4 mr-1" />
                {!isMobile && "Import"}
              </Button>
            </div>

            <Button onClick={onAddItem} className="flex-shrink-0 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" />
              {!isMobile && "Add Firearm"}
            </Button>

            <Button
              onClick={() => navigate("/trading")}
              variant="secondary"
              className="flex-shrink-0 whitespace-nowrap"
            >
              {!isMobile ? "View Trading" : "Trading"}
            </Button>
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" className="bg-[#8E9196] h-[1px] w-full mb-6" />
    </>
  );
}
