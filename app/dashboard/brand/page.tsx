"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconAward,
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

// Mock brand type
interface Brand {
  id: string
  code: string
  name: string
  description: string
  status: "Aktif" | "Non-Aktif"
}

// Initial Mock Data
const INITIAL_BRANDS: Brand[] = [
  {
    id: "1",
    code: "BRD-001",
    name: "Antam",
    description: "Logam mulia batangan bersertifikat LBMA (London Bullion Market Association) dari PT Aneka Tambang Tbk.",
    status: "Aktif",
  },
  {
    id: "2",
    code: "BRD-002",
    name: "UBS",
    description: "Emas batangan investasi dan perhiasan berkualitas tinggi dari PT Untung Bersama Sejahtera.",
    status: "Aktif",
  },
  {
    id: "3",
    code: "BRD-003",
    name: "Lotus Archi",
    description: "Emas batangan kolaborasi antara Lotus Lingga Pratama dan Archi Indonesia bersertifikat resmi.",
    status: "Aktif",
  },
  {
    id: "4",
    code: "BRD-004",
    name: "Hartadinata",
    description: "Perhiasan emas eksklusif dan logam mulia bersertifikat dari PT Hartadinata Abadi Tbk.",
    status: "Aktif",
  },
  {
    id: "5",
    code: "BRD-005",
    name: "King Halim",
    description: "Produsen perhiasan emas berkualitas tinggi dengan teknologi canggih dan desain premium.",
    status: "Non-Aktif",
  },
]

export default function BrandEmasPage() {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS)
  const [searchQuery, setSearchQuery] = useState("")

  // Form sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  // Temporary form values
  const [formCode, setFormCode] = useState("")
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<"Aktif" | "Non-Aktif">("Aktif")

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)

  // Calculations for Stats Card
  const totalBrands = brands.length
  const activeBrands = brands.filter((b) => b.status === "Aktif").length

  // Filtered brands based on search query
  const filteredBrands = useMemo(() => {
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [brands, searchQuery])

  // Open sheet for creating a new brand
  const handleAddClick = () => {
    setEditingBrand(null)
    setFormCode(`BRD-00${brands.length + 1}`)
    setFormName("")
    setFormDescription("")
    setFormStatus("Aktif")
    setIsSheetOpen(true)
  }

  // Open sheet for editing an existing brand
  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand)
    setFormCode(brand.code)
    setFormName(brand.name)
    setFormDescription(brand.description)
    setFormStatus(brand.status)
    setIsSheetOpen(true)
  }

  // Handle saving (Add or Edit)
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formCode.trim() || !formName.trim()) {
      toast.error("Kode dan Nama Brand wajib diisi!")
      return
    }

    if (editingBrand) {
      // Edit mode
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? {
                ...b,
                code: formCode,
                name: formName,
                description: formDescription,
                status: formStatus,
              }
            : b
        )
      )
      toast.success(`Brand "${formName}" berhasil diperbarui.`)
    } else {
      // Add mode
      const newBrand: Brand = {
        id: Date.now().toString(),
        code: formCode,
        name: formName,
        description: formDescription,
        status: formStatus,
      }
      setBrands((prev) => [...prev, newBrand])
      toast.success(`Brand "${formName}" berhasil ditambahkan.`)
    }

    setIsSheetOpen(false)
  }

  // Open delete confirm modal
  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete brand
  const handleConfirmDelete = () => {
    if (brandToDelete) {
      setBrands((prev) => prev.filter((b) => b.id !== brandToDelete.id))
      toast.success(`Brand "${brandToDelete.name}" berhasil dihapus.`)
      setIsDeleteModalOpen(false)
      setBrandToDelete(null)
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
            <span className="text-foreground font-medium">Brand Emas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Brand Emas
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola data brand dan merk persediaan emas di toko Anda.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconPlus className="size-4 mr-1" />
          Tambah Brand
        </Button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Total Brands Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl"></div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500 dark:bg-blue-500/20">
              <IconAward className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Brand
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {totalBrands} <span className="text-sm font-normal text-muted-foreground">Merk</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Active Brands Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl"></div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500 dark:bg-emerald-500/20">
              <IconTrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Brand Aktif
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {activeBrands} <span className="text-sm font-normal text-muted-foreground">/ {totalBrands} Aktif</span>
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
            placeholder="Cari berdasarkan kode, nama brand, atau deskripsi..."
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
                <TableHead className="min-w-[180px] font-semibold text-foreground">Nama Brand</TableHead>
                <TableHead className="min-w-[300px] font-semibold text-foreground">Deskripsi</TableHead>
                <TableHead className="w-[120px] font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-center w-[120px] font-semibold text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <TableRow
                    key={brand.id}
                    className="hover:bg-muted/30 dark:hover:bg-zinc-800/20 transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {brand.code}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {brand.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                      {brand.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                          brand.status === "Aktif"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            brand.status === "Aktif"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-zinc-400"
                          }`}
                        />
                        {brand.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(brand)}
                          title="Ubah Brand"
                          className="size-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary dark:hover:bg-primary/20"
                        >
                          <IconPencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(brand)}
                          title="Hapus Brand"
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
                      <p>Brand tidak ditemukan.</p>
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
              {editingBrand ? "Ubah Brand" : "Tambah Brand"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingBrand
                ? "Modifikasi data brand terpilih. Klik simpan untuk menyimpan perubahan."
                : "Masukkan detail informasi brand emas baru di bawah ini."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveBrand} className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Code Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="brand-code" className="text-sm font-medium text-foreground">
                  Kode Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand-code"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Contoh: BRD-001"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="brand-name" className="text-sm font-medium text-foreground">
                  Nama Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Antam"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="brand-desc" className="text-sm font-medium text-foreground">
                  Deskripsi Brand
                </Label>
                <textarea
                  id="brand-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tambahkan catatan detail mengenai brand ini..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Status Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="brand-status" className="text-sm font-medium text-foreground">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formStatus}
                  onValueChange={(val: "Aktif" | "Non-Aktif") => setFormStatus(val)}
                >
                  <SelectTrigger id="brand-status" className="h-10">
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
              <h3 className="text-lg font-bold text-foreground">Hapus Brand</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus brand{" "}
              <strong className="text-foreground">
                &ldquo;{brandToDelete?.name}&rdquo; ({brandToDelete?.code})
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
                  setBrandToDelete(null)
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
