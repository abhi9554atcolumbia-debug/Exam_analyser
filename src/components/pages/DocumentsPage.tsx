'use client';

import { useState, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Upload,
  Search,
  Plus,
  Eye,
  Download,
  MoreHorizontal,
  Trash2,
  FileText,
  FolderOpen,
  Clock,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  File,
  ArrowUpDown,
  FileSpreadsheet,
  FileCheck,
  FileKey,
  BookOpen,
  StickyNote,
  Paperclip,
  PieChart,
} from 'lucide-react';
import {
  getDocuments,
  getDocumentStats,
  createDocument,
  deleteDocument,
  getReflectionExamOptions,
  type Document as DocType,
  type DocumentStats as DocStats,
} from '@/lib/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { documentFormSchema } from '@/lib/validations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DonutChart } from '@/components/charts/DonutChart';

// ── Constants ────────────────────────────────────────────────
const CATEGORIES: { label: string; icon: React.ElementType; color: string; darkColor: string }[] = [
  { label: 'Scorecard', icon: FileCheck, color: 'text-emerald-600 bg-emerald-100', darkColor: 'dark:text-emerald-400 dark:bg-emerald-900/50' },
  { label: 'Admit Card', icon: FileSpreadsheet, color: 'text-blue-600 bg-blue-100', darkColor: 'dark:text-blue-400 dark:bg-blue-900/50' },
  { label: 'Result', icon: FileText, color: 'text-teal-600 bg-teal-100', darkColor: 'dark:text-teal-400 dark:bg-teal-900/50' },
  { label: 'Question Paper', icon: FileText, color: 'text-amber-600 bg-amber-100', darkColor: 'dark:text-amber-400 dark:bg-amber-900/50' },
  { label: 'Answer Key', icon: FileKey, color: 'text-purple-600 bg-purple-100', darkColor: 'dark:text-purple-400 dark:bg-purple-900/50' },
  { label: 'Syllabus', icon: BookOpen, color: 'text-orange-600 bg-orange-100', darkColor: 'dark:text-orange-400 dark:bg-orange-900/50' },
  { label: 'Notes', icon: StickyNote, color: 'text-rose-600 bg-rose-100', darkColor: 'dark:text-rose-400 dark:bg-rose-900/50' },
  { label: 'Misc', icon: Paperclip, color: 'text-slate-600 bg-slate-100', darkColor: 'dark:text-slate-400 dark:bg-slate-900/50' },
] as const;

const CATEGORY_OPTIONS = CATEGORIES.map((c) => c.label);
const YEAR_OPTIONS = ['2024', '2025', '2026'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Size (Largest)', value: 'size-desc' },
  { label: 'Size (Smallest)', value: 'size-asc' },
];

const PAGE_SIZE = 10;
const TOTAL_STORAGE_GB = 10;

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#ec4899', '#64748b'];

// ── Utilities ────────────────────────────────────────────────
function formatFileSize(bytes: number | null): string {
  if (bytes == null) return '—';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getCategoryConfig(category: string) {
  return CATEGORIES.find((c) => c.label === category) ?? CATEGORIES[7];
}

function getCategoryBadgeClasses(category: string) {
  const cfg = getCategoryConfig(category);
  return { cls: cn(cfg.color, cfg.darkColor), icon: cfg.icon };
}

// ── Create Document Dialog ───────────────────────────────────
function CreateDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState('');
  const [note, setNote] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: examOptions } = useQuery({
    queryKey: ['exam-options-docs'],
    queryFn: getReflectionExamOptions,
  });

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      toast.success('Document created successfully!');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-stats'] });
      onOpenChange(false);
      resetForm();
      onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create document');
    },
  });

  const resetForm = () => {
    setName('');
    setCategory('');
    setExamName('');
    setYear('');
    setNote('');
    setFormErrors({});
  };

  const handleSubmit = () => {
    const result = documentFormSchema.safeParse({ name: name.trim(), category, type: category, description: note || undefined, linkedExam: examName || undefined });
    if (!result.success) {
      const errors: Record<string, string> = {};
      const fieldErrors = result.error.flatten().fieldErrors;
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[key] = messages[0];
        }
      }
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    createMutation.mutate({
      name: name.trim(),
      category,
      examName: examName || undefined,
      year: year || undefined,
      note: note || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            Create Document
          </DialogTitle>
          <DialogDescription>Add a new document to your collection.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Document Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. IBPS PO 2024 Scorecard"
              value={name}
              onChange={(e) => { setName(e.target.value); if (formErrors.name) setFormErrors(prev => { const { name, ...rest } = prev; return rest; }); }}
            />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
          </div>

          {/* Category & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); if (formErrors.category) setFormErrors(prev => { const { category, ...rest } = prev; return rest; }); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => {
                    const cfg = getCategoryConfig(c);
                    const Icon = cfg.icon;
                    return (
                      <SelectItem key={c} value={c}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" /> {c}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Link to Exam */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Link to Exam (Optional)</Label>
            <Select value={examName} onValueChange={setExamName}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam..." />
              </SelectTrigger>
              <SelectContent>
                {examOptions?.map((e) => (
                  <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || !name.trim() || !category}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function DocumentsPage() {
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocType | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  // ── Queries ─────────────────────────────────────────────
  const { data: docsData, isLoading: loadingDocs } = useQuery({
    queryKey: ['documents', { search, categoryFilter, yearFilter, sort, page }],
    queryFn: () =>
      getDocuments({
        search: search || undefined,
        category: categoryFilter || undefined,
        year: yearFilter || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['document-stats'],
    queryFn: getDocumentStats,
  });

  // ── Mutations ───────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-stats'] });
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete document');
    },
  });

  // ── Computed ────────────────────────────────────────────
  const documents = docsData?.data ?? [];
  const pagination = docsData?.pagination ?? { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 };
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    stats?.categories?.forEach((c) => map.set(c.label, c.count));
    return map;
  }, [stats]);

  // Donut chart data
  const donutData = useMemo(() => {
    if (!stats?.categories?.length) return [];
    return stats.categories
      .filter((c) => c.count > 0)
      .map((c, i) => ({
        category: c.label,
        value: c.count,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));
  }, [stats]);

  const storageUsedGB = stats?.totalSize
    ? (stats.totalSize / (1024 * 1024 * 1024)).toFixed(2)
    : '0.00';
  const storagePercent = Math.min(
    ((stats?.totalSize ?? 0) / (TOTAL_STORAGE_GB * 1024 * 1024 * 1024)) * 100,
    100
  );

  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, pagination.total);

  // ── Loading ─────────────────────────────────────────────
  if (loadingDocs && loadingStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your exam-related documents
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Document
        </Button>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────── */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v === '__all' ? '' : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={yearFilter}
                onValueChange={(v) => {
                  setYearFilter(v === '__all' ? '' : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All Years</SelectItem>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[150px]">
                  <ArrowUpDown className="mr-1.5 size-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(search || categoryFilter || yearFilter) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('');
                    setYearFilter('');
                    setPage(1);
                  }}
                  title="Clear filters"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Category Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts.get(cat.label) ?? 0;
          const isActive = categoryFilter === cat.label;
          const Icon = cat.icon;
          return (
            <button
              key={cat.label}
              onClick={() => {
                if (isActive) {
                  setCategoryFilter('');
                } else {
                  setCategoryFilter(cat.label);
                }
                setPage(1);
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                isActive
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                  : 'hover:border-emerald-500/40',
              )}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                cat.color, cat.darkColor,
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn(
                'text-lg font-bold',
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
              )}>
                {count}
              </span>
              <p className="text-[11px] font-medium leading-tight text-muted-foreground">{cat.label}</p>
            </button>
          );
        })}
      </div>

      {/* ── Main Content: Table + Sidebar ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Documents Table */}
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <FolderOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">All Documents</CardTitle>
                <CardDescription className="text-xs">
                  {pagination.total} document{pagination.total !== 1 ? 's' : ''} in your collection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="size-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {search || categoryFilter || yearFilter
                      ? 'No documents match your search'
                      : 'No documents yet'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {search || categoryFilter || yearFilter
                      ? 'Try adjusting your search or filters'
                      : 'Click "Create Document" to add your first one'}
                  </p>
                </div>
                {!search && !categoryFilter && !yearFilter && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Document
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Name</TableHead>
                        <TableHead className="min-w-[120px] hidden sm:table-cell">Linked Exam</TableHead>
                        <TableHead className="min-w-[100px]">Category</TableHead>
                        <TableHead className="min-w-[100px] hidden md:table-cell">Uploaded</TableHead>
                        <TableHead className="min-w-[80px] hidden md:table-cell">Size</TableHead>
                        <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => {
                        const catCfg = getCategoryConfig(doc.category);
                        const CatIcon = catCfg.icon;
                        return (
                          <>
                            <TableRow
                              key={doc.id}
                              className="cursor-pointer transition-colors hover:bg-muted/50"
                              onClick={() =>
                                setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                              }
                            >
                              <TableCell>
                                <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md',
                                    catCfg.color, catCfg.darkColor,
                                  )}>
                                    <CatIcon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground sm:hidden">
                                      {doc.examName ?? '—'}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                                {doc.examName ?? '—'}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn('border text-[11px] font-medium', catCfg.color, catCfg.darkColor)}
                                >
                                  {doc.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                {formatDate(doc.createdAt)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                {formatFileSize(doc.fileSize)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedDoc(expandedDoc === doc.id ? null : doc.id);
                                    }}
                                    title="View details"
                                  >
                                    <Eye className="size-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download"
                                  >
                                    <Download className="size-3.5" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="size-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={(e) => { e.stopPropagation(); toast.info('Download started'); }}
                                      >
                                        <Download className="mr-2 size-4" /> Download
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-red-600 dark:text-red-400 focus:text-red-600"
                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(doc); }}
                                      >
                                        <Trash2 className="mr-2 size-4" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                            {expandedDoc === doc.id && (
                              <TableRow key={`${doc.id}-expanded`}>
                                <TableCell colSpan={6} className="bg-muted/30 px-6 py-4">
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Document Name</p>
                                      <p className="text-sm font-medium">{doc.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                                      <Badge variant="secondary">{doc.category}</Badge>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Linked Exam</p>
                                      <p className="text-sm">{doc.examName ?? 'None'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Year</p>
                                      <p className="text-sm">{doc.year ?? '—'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Uploaded</p>
                                      <p className="text-sm">{formatDate(doc.createdAt)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Size</p>
                                      <p className="text-sm">{formatFileSize(doc.fileSize)}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                      <p className="text-sm">{doc.note ?? 'No notes'}</p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{pagination.total > 0 ? startItem : 0}</span> to{' '}
                    <span className="font-medium text-foreground">{endItem}</span> of{' '}
                    <span className="font-medium text-foreground">{pagination.total}</span> documents
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="px-2 text-sm text-muted-foreground">{page} / {pagination.pages || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* ── Sidebar ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Category Distribution Donut */}
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <PieChart className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Category Distribution</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {donutData.length > 0 ? (
                <>
                  <DonutChart
                    data={donutData}
                    dataKey="value"
                    nameKey="category"
                    centerLabel="Docs"
                    centerValue={donutData.reduce((a, c) => a + c.value, 0)}
                    height={180}
                  />
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {donutData.map((d) => (
                      <div key={d.category} className="flex items-center gap-1.5 text-[11px]">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-muted-foreground">{d.category}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Storage Overview */}
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/50">
                  <HardDrive className="size-4 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-sm font-semibold">Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">{storageUsedGB} / {TOTAL_STORAGE_GB} GB</span>
              </div>
              <Progress
                value={storagePercent}
                className="h-2.5 [&_[data-slot=progress-indicator]]:bg-emerald-500"
              />
              <p className="text-xs text-muted-foreground">
                {(TOTAL_STORAGE_GB - parseFloat(storageUsedGB)).toFixed(2)} GB available
              </p>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-sm font-semibold">Recent Uploads</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.recentUploads && stats.recentUploads.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {stats.recentUploads.slice(0, 5).map((file, idx) => {
                    const catCfg = getCategoryConfig('Notes'); // default
                    return (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted',
                        )}>
                          <File className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatFileSize(file.fileSize)} · {formatDate(file.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No recent uploads</p>
              )}
            </CardContent>
          </Card>

          {/* Linked Exams */}
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <FolderOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-sm font-semibold">Linked Exams</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.linkedExams && stats.linkedExams.length > 0 ? (
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {stats.linkedExams.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{item.examName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.count} {item.count === 1 ? 'document' : 'documents'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[11px] shrink-0">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No linked exams</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Create Document Dialog ── */}
      <CreateDocumentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {}}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id); }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}