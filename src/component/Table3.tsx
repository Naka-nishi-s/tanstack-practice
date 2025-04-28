import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

// モジュール登録
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const Table3 = () => {
  const [rowData] = useState([
    { make: "Toyota", model: "Corolla", price: 3000000 },
    { make: "Ford", model: "Focus", price: 2500000 },
    { make: "BMW", model: "5 Series", price: 6000000 },
  ]);

  const { show } = useContextMenu({ id: "menu_id" });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (params: any) => {
    const mouseEvent = params.event as MouseEvent;
    show({ event: mouseEvent });
  };

  useEffect(() => {
    const preventDefaultContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const gridElement = gridRef.current;

    if (gridElement) {
      gridElement.addEventListener("contextmenu", preventDefaultContextMenu);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener(
          "contextmenu",
          preventDefaultContextMenu
        );
      }
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="ag-theme-alpine"
      style={{ height: 400, width: 600 }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={[
          { field: "make", headerName: "メーカー" },
          { field: "model", headerName: "モデル" },
          { field: "price", headerName: "価格" },
        ]}
        onCellContextMenu={handleContextMenu}
      />
      <Menu id="menu_id">
        <Item onClick={() => alert("リサイズモードに入る")}>
          リサイズモード
        </Item>
        <Item onClick={() => alert("確定する")}>確定</Item>
      </Menu>
    </div>
  );
};
