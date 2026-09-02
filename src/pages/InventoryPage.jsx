import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const CATEGORIES = ['Smartphone', 'Laptop', 'Wearable', 'Audio'];
const ROLES = ['Engineer', 'Tester'];

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('gadgetName', { header: 'Gadget name' }),
  columnHelper.accessor('category', { header: 'Category' }),
  columnHelper.accessor('manufacturer', { header: 'Manufacturer' }),
  columnHelper.accessor('healthRating', { header: 'Health' }),
  columnHelper.accessor('brandName', { header: 'Brand' }),
  columnHelper.accessor('userRole', { header: 'Role' }),
];

const inputStyle =
  'w-full bg-[#1B212A] border border-[#2B323D] rounded-md px-3.5 py-2.5 ' +
  'text-[#E5E9EF] font-mono text-sm placeholder-[#5B6470] ' +
  'focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:border-[#E2A254] transition';

const selectStyle =
  'border border-[#2B323D] bg-[#1B212A] text-[#E5E9EF] rounded-md px-2 py-1.5 text-sm ' +
  'focus:outline-none focus:ring-1 focus:ring-[#E2A254] transition';

export default function InventoryPage() {
  const [gadgetName, setGadgetName] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [healthRating, setHealthRating] = useState('');
  const [brandName, setBrandName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [errors, setErrors] = useState({});

  const [items, setItems] = useState([]);
  const [view, setView] = useState('form');

  const [selectedId, setSelectedId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [roleHighlight, setRoleHighlight] = useState('None');

  function validateForm() {
    const newErrors = {};

    if (gadgetName.trim().length < 3) {
      newErrors.gadgetName = 'Gadget name must be at least 3 characters.';
    }
    if (!CATEGORIES.includes(category)) {
      newErrors.category = 'Please select a category.';
    }
    if (manufacturer.trim().length < 2) {
      newErrors.manufacturer = 'Manufacturer is required.';
    }

    const rating = Number(healthRating);
    if (healthRating === '' || rating < 1 || rating > 100) {
      newErrors.healthRating = 'Health rating must be between 1 and 100.';
    }

    if (brandName.trim().length < 2) {
      newErrors.brandName = 'Tech brand name is required.';
    }
    if (!ROLES.includes(userRole)) {
      newErrors.userRole = 'Please select a user role.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newItem = {
      id: Date.now(),
      gadgetName: gadgetName.trim(),
      category: category,
      manufacturer: manufacturer.trim(),
      healthRating: Number(healthRating),
      brandName: brandName.trim(),
      userRole: userRole,
    };

    setItems([...items, newItem]);

    setGadgetName('');
    setCategory('');
    setManufacturer('');
    setHealthRating('');
    setBrandName('');
    setUserRole('');
    setErrors({});

    setView('table');
  }

  useEffect(() => {
    if (selectedId === null) {
      setActiveItem(null);
      return;
    }
    const found = items.find((item) => item.id === selectedId);
    setActiveItem(found || null);
  }, [selectedId, items]);

  const visibleItems = useMemo(() => {
    if (categoryFilter === 'All') return items;
    return items.filter((item) => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const table = useReactTable({
    data: visibleItems,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 4 },
    },
  });

  function healthTextClass(value) {
    if (value >= 70) return 'text-emerald-400';
    if (value >= 40) return 'text-amber-400';
    return 'text-red-400';
  }

  function healthDotClass(value) {
    if (value >= 70) return 'bg-emerald-400';
    if (value >= 40) return 'bg-amber-400';
    return 'bg-red-400';
  }

  function handleCategoryFilterChange(e) {
    setCategoryFilter(e.target.value);
    table.setPageIndex(0);
  }

  function handleRoleHighlightChange(e) {
    setRoleHighlight(e.target.value);
    table.setPageIndex(0);
  }

  return (
    <div>
      <div className="inline-flex gap-1 mb-8 border border-[#2B323D] rounded-md p-1 bg-[#161A21]">
        <button
          onClick={() => setView('form')}
          className={
            view === 'form'
              ? 'px-4 py-2 rounded text-sm font-medium bg-[#E2A254] text-[#161A21] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:ring-offset-1 focus:ring-offset-[#161A21]'
              : 'px-4 py-2 rounded text-sm font-medium text-[#8890A0] hover:text-[#E5E9EF] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:ring-offset-1 focus:ring-offset-[#161A21]'
          }
        >
          Add gadget
        </button>
        <button
          onClick={() => setView('table')}
          className={
            view === 'table'
              ? 'px-4 py-2 rounded text-sm font-medium bg-[#E2A254] text-[#161A21] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:ring-offset-1 focus:ring-offset-[#161A21]'
              : 'px-4 py-2 rounded text-sm font-medium text-[#8890A0] hover:text-[#E5E9EF] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:ring-offset-1 focus:ring-offset-[#161A21]'
          }
        >
          Registry ({items.length})
        </button>
      </div>

      {view === 'form' && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#161A21] border border-[#2B323D] rounded-lg p-8 sm:p-12 max-w-2xl mx-auto"
        >
          <div className="mb-8 pb-5 border-b border-[#2B323D]">
            <h2 className="font-semibold text-[#E5E9EF] text-xl">New gadget entry</h2>
            <p className="text-sm text-[#8890A0] mt-1.5">
              Enter the specs below to log this device in the registry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#8890A0] mb-2">Gadget name</label>
              <input
                type="text"
                value={gadgetName}
                onChange={(e) => setGadgetName(e.target.value)}
                placeholder="e.g. Pixel Fold 3"
                className={inputStyle}
              />
              {errors.gadgetName && <p className="text-red-400 text-sm mt-1.5">{errors.gadgetName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8890A0] mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputStyle}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-sm mt-1.5">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8890A0] mb-2">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Google"
                className={inputStyle}
              />
              {errors.manufacturer && <p className="text-red-400 text-sm mt-1.5">{errors.manufacturer}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8890A0] mb-2">Health rating (1–100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={healthRating}
                onChange={(e) => setHealthRating(e.target.value)}
                placeholder="e.g. 92"
                className={inputStyle}
              />
              {errors.healthRating && <p className="text-red-400 text-sm mt-1.5">{errors.healthRating}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8890A0] mb-2">Tech brand name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Nest Labs"
                className={inputStyle}
              />
              {errors.brandName && <p className="text-red-400 text-sm mt-1.5">{errors.brandName}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#8890A0] mb-2.5">User role</label>
              <div className="flex gap-3">
                {ROLES.map((role) => (
                  <label
                    key={role}
                    className={
                      userRole === role
                        ? 'flex items-center gap-2 text-sm text-[#161A21] bg-[#E2A254] border border-[#E2A254] font-medium rounded-md px-5 py-2.5 cursor-pointer transition'
                        : 'flex items-center gap-2 text-sm text-[#E5E9EF] border border-[#2B323D] rounded-md px-5 py-2.5 cursor-pointer hover:border-[#39424F] transition'
                    }
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value={role}
                      checked={userRole === role}
                      onChange={(e) => setUserRole(e.target.value)}
                      style={{ accentColor: '#E2A254' }}
                    />
                    {role}
                  </label>
                ))}
              </div>
              {errors.userRole && <p className="text-red-400 text-sm mt-1.5">{errors.userRole}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 bg-[#E2A254] hover:bg-[#EDB36C] text-[#161A21] px-7 py-3 rounded-md font-medium transition focus:outline-none focus:ring-1 focus:ring-[#E2A254] focus:ring-offset-2 focus:ring-offset-[#161A21]"
          >
            Save to registry
          </button>
        </form>
      )}

      {view === 'table' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-4 bg-[#161A21] border border-[#2B323D] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#8890A0]">Filter category:</span>
                <select value={categoryFilter} onChange={handleCategoryFilterChange} className={selectStyle}>
                  <option value="All">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#8890A0]">Highlight role:</span>
                <select value={roleHighlight} onChange={handleRoleHighlightChange} className={selectStyle}>
                  <option value="None">None</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="border-2 border-dashed border-[#2B323D] rounded-lg p-12 text-center text-[#5B6470] bg-[#161A21]">
                No gadgets yet. Add one from the "Add gadget" tab.
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="border-2 border-dashed border-[#2B323D] rounded-lg p-12 text-center text-[#5B6470] bg-[#161A21]">
                No gadgets match this filter. Try selecting a different category.
              </div>
            ) : (
              <div className="border border-[#2B323D] rounded-lg bg-[#161A21] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1B212A]">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="text-left px-4 py-3 border-b border-[#2B323D] font-medium text-[#8890A0] text-xs whitespace-nowrap"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => {
                        const item = row.original;
                        const isSelected = item.id === selectedId;
                        const isHighlighted = roleHighlight !== 'None' && item.userRole === roleHighlight;

                        let rowClass = 'cursor-pointer border-b border-[#212832] hover:bg-[#1B212A] transition';
                        if (isSelected) {
                          rowClass =
                            'cursor-pointer border-b border-[#212832] border-l-2 border-l-[#E2A254] bg-[#1F2730] transition';
                        } else if (isHighlighted) {
                          rowClass =
                            'cursor-pointer border-b border-[#212832] bg-[#241C10] hover:bg-[#2B2213] transition';
                        }

                        return (
                          <tr key={row.id} onClick={() => setSelectedId(item.id)} className={rowClass}>
                            {row.getVisibleCells().map((cell) => {
                              if (cell.column.id === 'healthRating') {
                                return (
                                  <td
                                    key={cell.id}
                                    className={`px-4 py-3 font-mono text-[13px] font-medium ${healthTextClass(item.healthRating)}`}
                                  >
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${healthDotClass(item.healthRating)}`} />
                                    {item.healthRating}
                                  </td>
                                );
                              }
                              return (
                                <td key={cell.id} className="px-4 py-3 text-[#C3C9D3] font-mono text-[13px] whitespace-nowrap">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-[#2B323D] bg-[#1B212A]">
                  <span className="text-sm text-[#8890A0] font-mono">
                    Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="px-3 py-1.5 text-sm border border-[#2B323D] rounded-md bg-[#161A21] text-[#C3C9D3] hover:border-[#39424F] hover:text-[#E5E9EF] disabled:opacity-30 disabled:hover:border-[#2B323D] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254]"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="px-3 py-1.5 text-sm border border-[#2B323D] rounded-md bg-[#161A21] text-[#C3C9D3] hover:border-[#39424F] hover:text-[#E5E9EF] disabled:opacity-30 disabled:hover:border-[#2B323D] transition focus:outline-none focus:ring-1 focus:ring-[#E2A254]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#161A21] border border-[#2B323D] rounded-lg p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-[#8890A0] mb-4">Item profile</h3>

              {!activeItem ? (
                <p className="text-sm text-[#5B6470]">Select a row in the table to view its profile.</p>
              ) : (
                <div>
                  <p className="text-xl font-semibold text-[#E5E9EF]">{activeItem.gadgetName}</p>
                  <p className="text-sm text-[#8890A0] mb-5 font-mono">{activeItem.category}</p>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm border-b border-[#212832] pb-2">
                      <span className="text-[#8890A0]">Manufacturer</span>
                      <span className="text-[#E5E9EF] font-medium font-mono">{activeItem.manufacturer}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-[#212832] pb-2">
                      <span className="text-[#8890A0]">Health rating</span>
                      <span className={`font-semibold font-mono flex items-center ${healthTextClass(activeItem.healthRating)}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${healthDotClass(activeItem.healthRating)}`} />
                        {activeItem.healthRating}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-[#212832] pb-2">
                      <span className="text-[#8890A0]">Brand</span>
                      <span className="text-[#E5E9EF] font-medium font-mono">{activeItem.brandName}</span>
                    </div>
                  </div>

                  <span className="inline-block text-xs font-medium font-mono px-3 py-1.5 rounded-md border border-[#E2A254]/40 text-[#E2A254] bg-[#241C10]">
                    {activeItem.userRole}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}