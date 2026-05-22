"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconFolder,
  IconTrendingUp,
  IconInfoCircle,
  IconChevronRight,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Mock category type
interface Kategori {
  id: string
  code: string
  name: string
  description: string
  status: "Aktif" | "Non-Aktif"
}

// Initial Mock Data
const INITIAL_CATEGORIES: Kategori[] = [
  {
    id: "1",
    code: "KTG-001",
    name: "Cincin Emas",
    description: "Semua ukuran dan jenis cincin emas pria dan wanita",
    status: "Aktif",
  },
  {
    id: "2",
    code: "KTG-002",
    name: "Kalung Emas",
    description: "Rantai leher emas putih, kuning, dan rose gold",
    status: "Aktif",
  },
  {
    id: "3",
    code: "KTG-003",
    name: "Gelang Emas",
    description: "Gelang rantai, gelang serut, dan gelang kaku (bangle)",
    status: "Aktif",
  },
  {
    id: "4",
    code: "KTG-004",
    name: "Anting Emas",
    description: "Anting tusuk (stud), giwang, jepit, dan anting gantung",
    status: "Aktif",
  },
  {
    id: "5",
    code: "KTG-005",
    name: "Logam Mulia",
    description: "Emas batangan murni bersertifikat SNI / Antam / UBS",
    status: "Non-Aktif",
  },
]

export default function KategoriBarangPage() {
  const [categories, setCategories] = useState<Kategori[]>(INITIAL_CATEGORIES)
  const [searchQuery, setSearchQuery] = useState("")

  // Form sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Kategori | null>(null)

  // Temporary form values
  const [formCode, setFormCode] = useState("")
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<"Aktif" | "Non-Aktif">("Aktif")

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Kategori | null>(null)

  // Calculations for Stats Card
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === "Aktif").length

  // Filtered categories based on search query
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  // Open sheet for creating a new category
  const handleAddClick = () => {
    setEditingCategory(null)
    setFormCode(`KTG-00${categories.length + 1}`)
    setFormName("")
    setFormDescription("")
    setFormStatus("Aktif")
    setIsSheetOpen(true)
  }

  // Open sheet for editing an existing category
  const handleEditClick = (category: Kategori) => {
    setEditingCategory(category)
    setFormCode(category.code)
    setFormName(category.name)
    setFormDescription(category.description)
    setFormStatus(category.status)
    setIsSheetOpen(true)
  }

  // Handle saving (Add or Edit)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formCode.trim() || !formName.trim()) {
      toast.error("Kode dan Nama Kategori wajib diisi!")
      return
    }

    if (editingCategory) {
      // Edit mode
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
              ...c,
              code: formCode,
              name: formName,
              description: formDescription,
              status: formStatus,
            }
            : c
        )
      )
      toast.success(`Kategori "${formName}" berhasil diperbarui.`)
    } else {
      // Add mode
      const newCategory: Kategori = {
        id: Date.now().toString(),
        code: formCode,
        name: formName,
        description: formDescription,
        status: formStatus,
      }
      setCategories((prev) => [...prev, newCategory])
      toast.success(`Kategori "${formName}" berhasil ditambahkan.`)
    }

    setIsSheetOpen(false)
  }

  // Open delete confirm modal
  const handleDeleteClick = (category: Kategori) => {
    setCategoryToDelete(category)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete category
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`)
      setIsDeleteModalOpen(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span>Persediaan Emas</span>
            <IconChevronRight className="size-3" />
            <span className="text-foreground font-medium">Kategori Barang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Kategori Barang
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola klasifikasi dan jenis persediaan emas di toko Anda.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconPlus className="size-4 mr-1" />
          Tambah Kategori
        </Button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Total Categories Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl"></div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500 dark:bg-blue-500/20">
              <IconFolder className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Kategori
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {totalCategories} <span className="text-sm font-normal text-muted-foreground">Jenis</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Active Categories Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl"></div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500 dark:bg-emerald-500/20">
              <IconTrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Kategori Aktif
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {activeCategories} <span className="text-sm font-normal text-muted-foreground">/ {totalCategories} Aktif</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar / Search Section */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card/30 p-4 shadow-xs backdrop-blur-xs dark:bg-zinc-950/20 md:flex-row md:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan kode, nama kategori, atau deskripsi..."
            className="pl-9 h-10 border-muted bg-background/50 focus-visible:ring-primary/50 focus-visible:border-primary dark:bg-zinc-900/50"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className="text-xs text-muted-foreground hover:text-foreground md:w-auto w-full h-10"
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
              <TableRow>
                <TableHead className="w-[120px] font-semibold text-foreground">Kode</TableHead>
                <TableHead className="min-w-[180px] font-semibold text-foreground">Nama Kategori</TableHead>
                <TableHead className="min-w-[300px] font-semibold text-foreground">Deskripsi</TableHead>
                <TableHead className="w-[120px] font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-center w-[120px] font-semibold text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="hover:bg-muted/30 dark:hover:bg-zinc-800/20 transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {category.code}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${category.status === "Aktif"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                          }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${category.status === "Aktif"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-zinc-400"
                            }`}
                        />
                        {category.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(category)}
                          title="Ubah Kategori"
                          className="size-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary dark:hover:bg-primary/20"
                        >
                          <IconPencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(category)}
                          title="Hapus Kategori"
                          className="size-8 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-500 focus-visible:ring-red-500 dark:hover:bg-red-500/20"
                        >
                          <IconTrash className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconInfoCircle className="size-8 text-muted-foreground/50" />
                      <p>Kategori tidak ditemukan.</p>
                      {searchQuery && (
                        <Button
                          variant="link"
                          onClick={() => setSearchQuery("")}
                          className="text-xs"
                        >
                          Reset Pencarian
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Slide-out Sheet (Add / Edit Form) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l bg-background shadow-xl flex flex-col gap-6">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-bold text-foreground">
              {editingCategory ? "Ubah Kategori" : "Tambah Kategori"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingCategory
                ? "Modifikasi data kategori terpilih. Klik simpan untuk menyimpan perubahan."
                : "Masukkan detail informasi kategori barang baru di bawah ini."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveCategory} className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Code Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-code" className="text-sm font-medium text-foreground">
                  Kode Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category-code"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Contoh: KTG-001"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-name" className="text-sm font-medium text-foreground">
                  Nama Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kalung Putih"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-desc" className="text-sm font-medium text-foreground">
                  Deskripsi Kategori
                </Label>
                <textarea
                  id="category-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tambahkan catatan detail mengenai kategori ini..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Status Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="category-status" className="text-sm font-medium text-foreground">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formStatus}
                  onValueChange={(val: "Aktif" | "Non-Aktif") => setFormStatus(val)}
                >
                  <SelectTrigger id="category-status" className="h-10">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer buttons inside the form */}
            <SheetFooter className="mt-auto pt-6 border-t flex flex-row items-center gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                className="flex-1 sm:flex-initial h-10"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-initial h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <IconCheck className="size-4 mr-1" />
                Simpan
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-200">
          <div className="w-full max-w-md scale-100 rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="rounded-full bg-red-500/10 p-2 text-red-600 dark:bg-red-500/20">
                <IconAlertTriangle className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Hapus Kategori</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <strong className="text-foreground">
                &ldquo;{categoryToDelete?.name}&rdquo; ({categoryToDelete?.code})
              </strong>
              ?
              <br />
              Tindakan ini bersifat permanen secara lokal di halaman ini dan tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setCategoryToDelete(null)
                }}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto"
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
