import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileEdit as Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface CRUD {
  read: boolean;
  update: boolean;
  delete: boolean;
  view: boolean;
  add: boolean;
}

interface CRUDTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  loading?: boolean;
  permissions?: CRUD;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterComponent?: React.ReactNode;
  extraActions?: React.ReactNode;
  rowsPerPage?: number;
  onCustomEdit?: (item: T) => void;
  customUpdate?: boolean;

  onCustomAdd?: () => void;
  customCreate?: boolean;

  onView?: (item: T) => void;
  
  /** Pagination */
  serverPagination?: boolean; // if true, we fetch new data from server on page change
  totalRecords?: number; // required if serverPagination is true
  onPageChange?: (page: number, limit: number, searchTerm?: string) => void; // trigger backend fetch
}

export default function CRUDTable<T extends { id: number | string }>({
  data,
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  filterComponent,
  extraActions,
  permissions = {
    read: true,
    update: true,
    delete: true,
    view: true,
    add: true,
  },
  rowsPerPage = 10,
  serverPagination = false,
  totalRecords,
  onPageChange,
  onCustomEdit,
  customUpdate = false,
  onCustomAdd,
  customCreate = false,

  onView
  
}: CRUDTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔎 Search filter (client-side only)
  const filteredData = useMemo(() => {
    if (serverPagination || !searchable) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchable, serverPagination]);

  // 📄 Pagination logic
  const totalPages = useMemo(() => {
    return serverPagination
      ? Math.ceil((totalRecords || 0) / rowsPerPage)
      : Math.ceil(filteredData.length / rowsPerPage);
  }, [serverPagination, totalRecords, filteredData.length, rowsPerPage]);

  const currentData = useMemo(() => {
    if (serverPagination) return data; // server sends paginated data
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [data, filteredData, currentPage, rowsPerPage, serverPagination]);

  const handleDelete = (item: T) => setDeleteItem(item);
  const confirmDelete = () => {
    if (deleteItem) onDelete(deleteItem);
    setDeleteItem(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (serverPagination && onPageChange) {
      onPageChange(page, rowsPerPage, searchTerm);
    }
  };

  // Reset to first page when search/filter changes (client side only)
  useEffect(() => {
    if (!serverPagination) setCurrentPage(1);
  }, [searchTerm, data, serverPagination]);

  // Trigger server fetch when page or search changes
  useEffect(() => {
    if (serverPagination && onPageChange) {
      onPageChange(currentPage, rowsPerPage, searchTerm);
    }
  }, [currentPage, rowsPerPage]); // intentionally not watching searchTerm here to debounce manually if needed

  if (loading) {
    return (
      <div className="card p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>

            <div className="flex items-center gap-3">
              {extraActions && <div>{extraActions}</div>}
              {permissions.add && (
                <button
                  onClick={() => {
                    if (customUpdate && onCustomEdit) {
                      onCustomAdd();
                    } else {
                      onAdd();
                    }
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New
                </button>
              )}
            </div>
          </div>

          {/* Filters + Search */}
          {(filterComponent || searchable) && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {filterComponent && (
                <div className="w-full md:w-auto">{filterComponent}</div>
              )}

              {searchable && (
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (serverPagination && onPageChange) {
                        onPageChange(1, rowsPerPage, e.target.value); // reset to page 1 when searching server-side
                      }
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {(permissions.update || permissions.delete) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((row, index) => (
                <motion.tr
                  key={String(row.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                    >
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] || "")}
                    </td>
                  ))}

                  {(permissions.update || permissions.delete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {permissions.update && (
                          <button
                            onClick={() => {
                              if (customUpdate && onCustomEdit) {
                                onCustomEdit(row);
                              } else {
                                onEdit(row);
                              }
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {permissions.view && (
                          <button
                            onClick={() => (onView ? onView(row) : null)}
                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {permissions.delete && (
                          <button
                            onClick={() => handleDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>

          {(!currentData || currentData.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No items match your search." : "No items found."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}
