mport { useState, useEffect, useMemo } from 'react';
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
      