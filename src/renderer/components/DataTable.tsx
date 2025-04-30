import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { useState } from "react";
import { ClassNameValue } from "tailwind-merge";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  isImage?: boolean;
}

interface DataTableProps {
  title?: string;
  actionButton?: React.ReactNode;
  columns: Column[];
  data: Record<string, any>[];
  loading?: boolean;
  rowsPerPage?: number;
  fixedHeight?: string;
  className?: ClassNameValue;
  onRowClick?: (row: Record<string, any>) => void;
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
  onBulkDelete?: (rows: Record<string, any>[]) => void;
}

export default function DataTable({
  title,
  actionButton,
  columns,
  data,
  loading,
  rowsPerPage = 10,
  fixedHeight = "290px",
  onRowClick,
  onEdit,
  onDelete,
  onBulkDelete,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = data
    .filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label);
    const rows = filteredData.map((row) =>
      columns.map((col) => row[col.key] ?? "").join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      const rowsToDelete = paginatedData.filter((row) =>
        selectedRows.has(row.id)
      );
      onBulkDelete(rowsToDelete);
      setSelectedRows(new Set());
    }
  };

  return (
    <div className="w-full space-y-3 shadow border rounded-lg p-4">
      {(title || actionButton) && (
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              Export
            </Button>
            {selectedRows.size > 0 && onBulkDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedRows.size})
              </Button>
            )}
            {actionButton && <div>{actionButton}</div>}
          </div>
        </div>
      )}

      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />

      <div
        className="overflow-auto rounded-lg border hide-scrollbar"
        style={{ maxHeight: fixedHeight }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="bg-gray-100">
              <TableHead>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(
                        new Set(paginatedData.map((row) => row.id))
                      );
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                  checked={
                    selectedRows.size > 0 &&
                    paginatedData.every((row) => selectedRows.has(row.id))
                  }
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={
                    column.sortable ? "cursor-pointer select-none" : ""
                  }
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.isImage ? (
                        row[column.key] ? (
                          <img
                            src={row[column.key]}
                            alt=""
                            className="h-8 w-8 object-cover rounded"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-muted rounded" />
                        )
                      ) : (
                        row[column.key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit?.(row)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(row)}
                          className="text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > rowsPerPage && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
