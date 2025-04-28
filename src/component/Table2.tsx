import { useEffect, useRef, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";

type Selection = {
  start: { rowIdx: number; colIdx: number };
  end: { rowIdx: number; colIdx: number };
};

type Range = {
  id: number;
  color: string;
  selection: Selection;
};

const rows = [
  { id: 0, title: "Example 1", count: 20 },
  { id: 1, title: "Example 2", count: 40 },
  { id: 2, title: "Example 3", count: 60 },
  { id: 3, title: "Example 4", count: 60 },
  { id: 4, title: "Example 5", count: 60 },
  { id: 5, title: "Example 6", count: 60 },
  { id: 6, title: "Example 7", count: 60 },
  { id: 7, title: "Example 8", count: 60 },
  { id: 8, title: "Example 9", count: 60 },
];

export const Table2 = () => {
  const { show, hideAll } = useContextMenu({ id: "menu_id" });
  const gridRef = useRef<HTMLDivElement>(null);

  const [ranges, setRanges] = useState<Range[]>([
    {
      id: 1,
      color: "pink",
      selection: {
        start: { rowIdx: 1, colIdx: 1 },
        end: { rowIdx: 2, colIdx: 2 },
      },
    },
  ]);
  console.log("Ranges", ranges);

  const [isResizing, setIsResizing] = useState(false);
  const [activeRangeId, setActiveRangeId] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{
    rowIdx: number;
    colIdx: number;
  } | null>(null);
  const [tempSelection, setTempSelection] = useState<Selection | null>(null);

  const columns = [
    { key: "id", name: "ID", renderCell: (props: any) => renderCell(props, 0) },
    {
      key: "title",
      name: "Title",
      renderCell: (props: any) => renderCell(props, 1),
    },
    {
      key: "count",
      name: "Count",
      renderCell: (props: any) => renderCell(props, 2),
    },
  ];

  const renderCell = (props: any, colIdx: number) => {
    const color = getCellColor(props.rowIdx, colIdx);
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: color,
          userSelect: "none",
        }}
        onMouseDown={(e) => {
          if (e.button === 0) handleCellMouseDown(props.rowIdx, colIdx);
        }}
        onMouseEnter={() => {
          if (isSelecting) handleCellMouseEnter(props.rowIdx, colIdx);
        }}
      >
        {props.row[columns[colIdx].key]}
      </div>
    );
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    show({ event: e });
  };

  const handleCellMouseDown = (rowIdx: number, colIdx: number) => {
    if (!isResizing) return;
    const selection = { start: { rowIdx, colIdx }, end: { rowIdx, colIdx } };
    setStartCell({ rowIdx, colIdx });
    setTempSelection(selection);
    setIsSelecting(true);
  };

  const handleCellMouseEnter = (rowIdx: number, colIdx: number) => {
    if (!isResizing || !isSelecting || !startCell) return;
    setTempSelection({ start: startCell, end: { rowIdx, colIdx } });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const addNewRange = () => {
    setActiveRangeId(null);
    setIsResizing(true);
  };

  const startResizeExistingRange = (id: number) => {
    setActiveRangeId(id);
    setIsResizing(true);
  };

  const confirmResize = () => {
    if (!tempSelection) return;

    if (activeRangeId === null) {
      const nextId = (ranges[ranges.length - 1]?.id ?? 0) + 1;
      const color =
        nextId === 1 ? "pink" : nextId === 2 ? "lightgreen" : "lightblue";
      setRanges([...ranges, { id: nextId, color, selection: tempSelection }]);
    } else {
      setRanges(
        ranges.map((r) =>
          r.id === activeRangeId ? { ...r, selection: tempSelection } : r
        )
      );
    }

    resetResizingState();
  };

  const cancelResize = () => {
    resetResizingState();
  };

  const resetResizingState = () => {
    setIsResizing(false);
    setIsSelecting(false);
    setStartCell(null);
    setTempSelection(null);
    setActiveRangeId(null);
    hideAll();
  };

  const getCellColor = (rowIdx: number, colIdx: number) => {
    if (tempSelection) {
      const [rowStart, rowEnd] = [
        tempSelection.start.rowIdx,
        tempSelection.end.rowIdx,
      ].sort((a, b) => a - b);
      const [colStart, colEnd] = [
        tempSelection.start.colIdx,
        tempSelection.end.colIdx,
      ].sort((a, b) => a - b);

      if (
        rowIdx >= rowStart &&
        rowIdx <= rowEnd &&
        colIdx >= colStart &&
        colIdx <= colEnd
      ) {
        return activeRangeId === null
          ? ranges.length === 0
            ? "pink"
            : ranges.length === 1
            ? "lightgreen"
            : "lightblue"
          : ranges.find((r) => r.id === activeRangeId)?.color ?? undefined;
      }

      if (
        (rowIdx >= rowStart && rowIdx <= rowEnd && colIdx === colStart - 1) ||
        (colIdx >= colStart && colIdx <= colEnd && rowIdx === rowStart - 1)
      ) {
        return "yellow";
      }
    }

    for (const range of ranges) {
      if (activeRangeId !== null && range.id === activeRangeId) {
        continue;
      }

      const [rowStart, rowEnd] = [
        range.selection.start.rowIdx,
        range.selection.end.rowIdx,
      ].sort((a, b) => a - b);
      const [colStart, colEnd] = [
        range.selection.start.colIdx,
        range.selection.end.colIdx,
      ].sort((a, b) => a - b);

      if (
        rowIdx >= rowStart &&
        rowIdx <= rowEnd &&
        colIdx >= colStart &&
        colIdx <= colEnd
      ) {
        return range.color;
      }

      if (
        (rowIdx >= rowStart && rowIdx <= rowEnd && colIdx === colStart - 1) ||
        (colIdx >= colStart && colIdx <= colEnd && rowIdx === rowStart - 1)
      ) {
        return "yellow";
      }
    }

    return undefined;
  };

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;
    gridElement.addEventListener("mouseup", handleMouseUp);
    return () => {
      gridElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const RangeMenuItems = ({
    ranges,
    startResizeExistingRange,
    addNewRange,
  }: {
    ranges: Range[];
    startResizeExistingRange: (id: number) => void;
    addNewRange: () => void;
  }) => {
    return (
      <>
        {ranges.map((range) => (
          <Item
            key={range.id}
            onClick={() => startResizeExistingRange(range.id)}
          >
            範囲{range.id}のリサイズ
          </Item>
        ))}
        <Item onClick={addNewRange}>新しい範囲を追加</Item>
      </>
    );
  };

  const ResizeMenuItems = ({
    confirmResize,
    cancelResize,
  }: {
    confirmResize: () => void;
    cancelResize: () => void;
  }) => {
    return (
      <>
        <Item onClick={confirmResize}>確定</Item>
        <Item onClick={cancelResize}>キャンセル</Item>
      </>
    );
  };

  return (
    <div
      ref={gridRef}
      style={{ height: 400, width: 800 }}
      onContextMenu={handleContextMenu}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        onCellClick={(args) => {
          if (!isResizing) return;
          const colIdx = columns.findIndex((c) => c.key === args.column.key);
          const rowIdx = args.row.id;
          handleCellMouseDown(rowIdx, colIdx);
        }}
      />
      <Menu id="menu_id">
        {!isResizing ? (
          <RangeMenuItems
            ranges={ranges}
            startResizeExistingRange={startResizeExistingRange}
            addNewRange={addNewRange}
          />
        ) : (
          <ResizeMenuItems
            confirmResize={confirmResize}
            cancelResize={cancelResize}
          />
        )}
      </Menu>
    </div>
  );
};
