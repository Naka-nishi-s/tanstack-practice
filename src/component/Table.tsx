import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  age: number;
  category: string;
  skills: string;
  status: string;
};

const sampleData = [
  {
    firstName: "React",
    lastName: "太郎",
    age: 25,
    category: "フロントエンド",
    skills: "React",
    status: "Done",
  },
  {
    firstName: "Vue",
    lastName: "花子",
    age: 30,
    category: "フロントエンド",
    skills: "Vue",
    status: "In Progress",
  },
  {
    firstName: "Node",
    lastName: "次郎",
    age: 35,
    category: "バックエンド",
    skills: "Node",
    status: "ToDo",
  },
];

export const Table = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "firstName",
      header: "名前",
      size: 120,
    },
    {
      accessorKey: "lastName",
      header: "苗字",
    },
    {
      accessorKey: "age",
      header: "年齢",
    },
  ];

  const [data, setData] = useState<User[]>(sampleData);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    enableColumnResizing: true,
  });

  /** ソート用の関数 */
  const tableSort = (
    header: Header<User, unknown>,
    e: React.MouseEvent<HTMLElement>
  ) => {
    const handler = header.column.getToggleSortingHandler();
    if (handler) {
      handler(e);
    }
  };

  return (
    <div>
      <button onClick={() => setData([])}>でーーた削除</button>
      <table style={{ borderCollapse: "collapse", border: "1px solid" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    onClick={(e) => tableSort(header, e)}
                    style={{ border: "1px solid" }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{ asc: "↑", desc: "↓" }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    style={{
                      width: "120px",
                      border: "1px solid",
                      backgroundColor: cellIndex === 0 ? "pink" : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
