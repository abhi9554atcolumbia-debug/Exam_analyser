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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
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

// ── Constants ────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Scorecard', icon: '📊' },
  { label: 'Admit Card', icon: '🎫' },
  { label: 'Result', icon: '📋' },
  { label: 'Question Paper', icon: '📝' },
  { label: 'Answer Key', icon: '🔑' },
  { label: 'Syllabus', icon: '📚' },
  { label: 'Notes', icon: '🗒️' },
  { label: 'Misc', icon: '📎' },
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

function getCategoryIcon(category: string): string {
  return CATEGORIES.find((c) => c.label === category)?.icon ?? '📎';
}

function getCategoryBadgeVariant(
  category: string
): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    Scorecard: 'default',
    'Admit Card': 'secondary',
    Result: 'default',
    'Question Paper': 'outline',
    'Answer Key': 'outline',
    Syllabus: 'secondary',
    Notes: 'outline',
    Misc: 'secondary',
  };
  return map[category] ?? 'secondary';
}

// ── Upload Form Sub-component ────────────────────────────────
function UploadForm({
  onUpload,
  onCancel,
  isPending,
}: {
  onUpload: (data: {
    name: string;
    category: string;
    examName?: string;
    year?: string;
    note?: string;
    fileSize?: number;
  }) => void;
  onCancel?: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [examName, setExamName] = useState('');
  const [year, setYear] = useState('');
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const { data: examOptions } = useQuery({
    queryKey: ['exam-options-docs'],
    queryFn: getReflectionExamOptions,
  });

  const handleDrop = () => {
    // Simulate a file drop
    const ext = 'pdf';
    const fakeName = `document-${Date.now().toString(36)}.${ext}`;
    setFileName(fakeName);
    setName(name || fakeName);
    setFileSize(Math.floor(Math.random() * 5000000) + 100000); // 100KB - 5MB
  };

  const handleSubmit = () => {
    if (!name.trim() || !category) {
      toast.error('Please fill in document name and category');
      return;
    }
    onUpload({
      name: name.trim(),
      category,
      examName: examName || undefined,
      year: year || undefined,
      note: note || undefined,
      fileSize: fileSize || undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onClick={handleDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer"
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {fileName ? `📎 ${fileName} (${formatFileSize(fileSize)})` : 'Click to select a file'}
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label>Document Name</Label>
        <Input
          placeholder="e.g. IBPS PO 2024 Scorecard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Category & Year */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {getCategoryIcon(c)} {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Link to Exam */}
      <div className="space-y-2">
        <Label>Link to Exam (Optional)</Label>
        <Select value={examName} onValueChange={setExamName}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select exam..." />
          </SelectTrigger>
          <SelectContent>
            {examOptions?.map((e) => (
              <SelectItem key={e.id} value={e.name}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Textarea
          placeholder="Add any notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Upload className="mr-2 size-4" />
          {isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
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
  const uploadMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      toast.success('Document uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-stats'] });
      setUploadDialogOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to upload document');
    },
  });

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

  const handleUpload = (data: Parameters<typeof createDocument>[0]) => {
    uploadMutation.mutate(data);
  };

  // ── Computed ────────────────────────────────────────────
  const documents = docsData?.data ?? [];
  const pagination = docsData?.pagination ?? { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 };
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    stats?.categories?.forEach((c) => map.set(c.label, c.count));
    return map;
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
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Manage your exam-related documents
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Upload className="mr-2 size-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Add a new document to your collection.
              </DialogDescription>
            </DialogHeader>
            <UploadForm
              onUpload={handleUpload}
              onCancel={() => setUploadDialogOpen(false)}
              isPending={uploadMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────── */}
      <Card>
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
            <div className="flex items-center gap-2">
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
                    <SelectItem key={c} value={c}>
                      {getCategoryIcon(c)} {c}
                    </SelectItem>
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
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
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
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
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

      {/* ── Category Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts.get(cat.label) ?? 0;
          const isActive = categoryFilter === cat.label;
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
              className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                  : 'hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span
                  className={`text-lg font-bold ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium leading-tight">{cat.label}</p>
            </button>
          );
        })}
      </div>

      {/* ── Main Content: Table + Sidebar ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Documents Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
              All Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <FileText className="size-12 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {search || categoryFilter || yearFilter
                    ? 'No documents match your filters'
                    : 'No documents yet. Upload your first document!'}
                </p>
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
                      {documents.map((doc) => (
                        <>
                          <TableRow
                            key={doc.id}
                            className="cursor-pointer"
                            onClick={() =>
                              setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <File className="size-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {doc.name}
                                  </p>
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
                                variant={getCategoryBadgeVariant(doc.category)}
                                className={
                                  doc.category === 'Scorecard' || doc.category === 'Result'
                                    ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20'
                                    : ''
                                }
                              >
                                {getCategoryIcon(doc.category)} {doc.category}
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
                                    setExpandedDoc(
                                      expandedDoc === doc.id ? null : doc.id
                                    );
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toast.info('Download started');
                                      }}
                                    >
                                      <Download className="mr-2 size-4" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 dark:text-red-400 focus:text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(doc);
                                      }}
                                    >
                                      <Trash2 className="mr-2 size-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                          {/* Expanded row */}
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
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium text-foreground">
                      {pagination.total > 0 ? startItem : 0}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium text-foreground">{endItem}</span> of{' '}
                    <span className="font-medium text-foreground">{pagination.total}</span>{' '}
                    documents
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
                    <span className="px-2 text-sm text-muted-foreground">
                      {page} / {pagination.pages || 1}
                    </span>
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
        <div className="space-y-4 hidden lg:block">
          {/* Storage Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <HardDrive className="size-4 text-emerald-600 dark:text-emerald-400" />
                Storage Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">
                  {storageUsedGB} / {TOTAL_STORAGE_GB} GB
                </span>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentUploads && stats.recentUploads.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUploads.slice(0, 4).map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        <File className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatFileSize(file.fileSize)} · {formatDate(file.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No recent uploads
                </p>
              )}
            </CardContent>
          </Card>

          {/* Linked Exams */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FolderOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                Linked Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.linkedExams && stats.linkedExams.length > 0 ? (
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {stats.linkedExams.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{item.examName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.count} {item.count === 1 ? 'document' : 'documents'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[11px] shrink-0">
                        {item.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No linked exams
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Quick Upload Section ────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="size-4 text-emerald-600 dark:text-emerald-400" />
            Quick Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm
            onUpload={handleUpload}
            isPending={uploadMutation.isPending}
          />
        </CardContent>
      </Card>

      {/* ── Delete Confirmation Dialog ──────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
              }}
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