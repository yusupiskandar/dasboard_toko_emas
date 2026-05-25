"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconRuler,
  IconCheck,
  IconAlertTriangle,
  IconChevronRight,
  IconInfoCircle,
  IconScale,
  IconBox,
  IconBan,
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

// ----- Types -----
type TipeSatuan = "Unit" | "Berat" | "Pasangan" | "Paket"
type StatusSatuan = "Aktif" | "Non-Aktif"

interface Satuan {
  id: string
  kodeSatuan: string
  namaSatuan: string
  simbol: string
  tipeSatuan: TipeSatuan
  deskripsi: string
  status: StatusSatuan
  isDefault: boolean
  jumlahBarang: number
}

// ----- Initial Mock Data -----
const INITIAL_SATUAN: Satuan[] = [
  {
    id: "1",
    kodeSatuan: "SAT-001",
    namaSatuan: "Gram",
    simbol: "gr",
    tipeSatuan: "Berat",
    deskripsi: "Satuan berat standar untuk emas batangan dan perhiasan",
    status: "Aktif",
    isDefault: true,
    jumlahBarang: 12,
  },
  {
    id: "2",
    kodeSatuan: "SAT-002",
    namaSatuan: "Pcs",
    simbol: "pcs",
    tipeSatuan: "Unit",
    deskripsi: "Satuan per item / per buah",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 34,
  },
  {
    id: "3",
    kodeSatuan: "SAT-003",
    namaSatuan: "Pasang",
    simbol: "ps",
    tipeSatuan: "Pasangan",
    deskripsi: "Satuan untuk barang berpasangan, seperti anting",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 8,
  },
  {
    id: "4",
    kodeSatuan: "SAT-004",
    namaSatuan: "Set",
    simbol: "set",
    tipeSatuan: "Paket",
    deskripsi: "Satuan satu paket perhiasan (mis. kalung + gelang + cincin)",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 3,
  },
  {
    id: "5",
    kodeSatuan: "SAT-005",
    namaSatuan: "Kilogram",
    simbol: "kg",
    tipeSatuan: "Berat",
    deskripsi: "Satuan berat kilogram, jarang dipakai di toko emas",
    status: "Non-Aktif",
    isDefault: false,
    jumlahBarang: 0,
  },
]

// ----- Helpers -----
const TIPE_OPTIONS: TipeSatuan[] = ["Unit", "Berat", "Pasangan", "Paket"]

const tipeColors: Record<TipeSatuan, string> = {
  Unit: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  Berat: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Pasangan: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  Paket: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
}

function generateKode(list: Satuan[]) {
  const num = list.length + 1
  return `SAT-${String(num).padStart(3, "0")}`
}

// ----- Page Component -----
export default function SatuanBarangPage() {
  const [satuanList, setSatuanList] = useState<Satuan[]>(INITIAL_SATUAN)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"Semua" | StatusSatuan>("Semua")
  const [filterTipe, setFilterTipe] = useState<"Semua" | TipeSatuan>("Semua")

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingSatuan, setEditingSatuan] = useState<Satuan | null>(null)

  // Form state
  const [formKode, setFormKode] = useState("")
  const [formNama, setFormNama] = useState("")
  const [formSimbol, setFormSimbol] = useState("")
  const [formTipe, setFormTipe] = useState<TipeSatuan>("Unit")
  const [formDeskripsi, setFormDeskripsi] = useState("")
  const [formStatus, setFormStatus] = useState<StatusSatuan>("Aktif")

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [satuanToDelete, setSatuanToDelete] = useState<Satuan | null>(null)

  // ----- Stats -----
  const totalSatuan = satuanList.length
  const satuanAktif = satuanList.filter((s) => s.status === "Aktif").length
  const satuanNonAktif = satuanList.filter((s) => s.status === "Non-Aktif").length
  const satuanTerpakai = satuanList.filter((s) => s.jumlahBarang > 0).length

  // ----- Filtered list -----
  const filteredList = useMemo(() => {
    return satuanList.filter((s) => {
      const matchSearch =
        s.namaSatuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kodeSatuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.simbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = filterStatus === "Semua" || s.status === filterStatus
      const matchTipe = filterTipe === "Semua" || s.tipeSatuan === filterTipe
      return matchSearch && matchStatus && matchTipe
    })
  }, [satuanList, searchQuery, filterStatus, filterTipe])

  // ----- Handlers -----
  const openAddSheet = () => {
    setEditingSatuan(null)
    setFormKode(generateKode(satuanList))
    setFormNama("")
    setFormSimbol("")
    setFormTipe("Unit")
    setFormDeskripsi("")
    setFormStatus("Aktif")
    setIsSheetOpen(true)
  }

  const openEditSheet = (satuan: Satuan) => {
    setEditingSatuan(satuan)
    setFormKode(satuan.kodeSatuan)
    setFormNama(satuan.namaSatuan)
    setFormSimbol(satuan.simbol)
    setFormTipe(satuan.tipeSatuan)
    setFormDeskripsi(satuan.deskripsi)
    setFormStatus(satuan.status)
    setIsSheetOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formKode.trim() || !formNama.trim()) {
      toast.error("Kode dan Nama Satuan wajib diisi!")
      return
    }

    // Cek duplikat nama (kecuali diri sendiri saat edit)
    const isDuplicate = satuanList.some(
      (s) =>
        s.namaSatuan.toLowerCase() === formNama.toLowerCase() &&
        s.id !== editingSatuan?.id
    )
    if (isDuplicate) {
      toast.error(`Nama satuan "${formNama}" sudah ada. Gunakan nama yang berbeda.`)
      return
    }

    if (editingSatuan) {
      setSatuanList((prev) =>
        prev.map((s) =>
          s.id === editingSatuan.id
            ? {
                ...s,
                kodeSatuan: formKode,
                namaSatuan: formNama,
                simbol: formSimbol,
                tipeSatuan: formTipe,
                deskripsi: formDeskripsi,
                status: formStatus,
              }
            : s
        )
      )
      toast.success(`Satuan "${formNama}" berhasil diperbarui.`)
    } else {
      const newSatuan: Satuan = {
        id: Date.now().toString(),
        kodeSatuan: formKode,
        namaSatuan: formNama,
        simbol: formSimbol,
        tipeSatuan: formTipe,
        deskripsi: formDeskripsi,
        status: formStatus,
        isDefault: false,
        jumlahBarang: 0,
      }
      setSatuanList((prev) => [...prev, newSatuan])
      toast.success(`Satuan "${formNama}" berhasil ditambahkan.`)
    }

    setIsSheetOpen(false)
  }

  const handleDeleteClick = (satuan: Satuan) => {
    setSatuanToDelete(satuan)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!satuanToDelete) return

    if (satuanToDelete.jumlahBarang > 0) {
      toast.error(
        `Satuan "${satuanToDelete.namaSatuan}" tidak dapat dihapus karena masih digunakan oleh ${satuanToDelete.jumlahBarang} barang. Nonaktifkan saja.`
      )
      setIsDeleteModalOpen(false)
      setSatuanToDelete(null)
      return
    }

    setSatuanList((prev) => prev.filter((s) => s.id !== satuanToDelete.id))
    toast.success(`Satuan "${satuanToDelete.namaSatuan}" berhasil dihapus.`)
    setIsDeleteModalOpen(false)
    setSatuanToDelete(null)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("Semua")
    setFilterTipe("Semua")
  }

  const hasActiveFilters =
    searchQuery !== "" || filterStatus !== "Semua" || filterTipe !== "Semua"

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span>Persediaan Emas</span>
            <IconChevronRight className="size-3" />
            <span className="text-foreground font-medium">Satuan Barang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Satuan Barang
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola master data satuan yang digunakan oleh seluruh barang emas di toko Anda.
          </p>
        </div>
        <Button
          onClick={openAddSheet}
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconPlus className="size-4 mr-1" />
          Tambah Satuan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Satuan */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-blue-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500 dark:bg-blue-500/20">
              <IconRuler className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Satuan
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {totalSatuan}
              </h3>
            </div>
          </div>
        </div>

        {/* Satuan Aktif */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500 dark:bg-emerald-500/20">
              <IconCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Satuan Aktif
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {satuanAktif}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / {totalSatuan}
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Satuan Non-Aktif */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-zinc-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-500/10 p-2.5 text-zinc-500 dark:bg-zinc-500/20">
              <IconBan className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Non-Aktif
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {satuanNonAktif}
              </h3>
            </div>
          </div>
        </div>

        {/* Satuan Terpakai */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-amber-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500 dark:bg-amber-500/20">
              <IconScale className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Terpakai Barang
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {satuanTerpakai}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card/30 p-4 shadow-xs backdrop-blur-xs dark:bg-zinc-950/20 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama satuan, atau simbol..."
            className="pl-9 h-10 border-muted bg-background/50 focus-visible:ring-primary/50 focus-visible:border-primary dark:bg-zinc-900/50"
          />
        </div>

        {/* Filter Status */}
        <Select
          value={filterStatus}
          onValueChange={(val) => setFilterStatus(val as "Semua" | StatusSatuan)}
        >
          <SelectTrigger className="h-10 w-full md:w-[150px] bg-background/50 dark:bg-zinc-900/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Tipe */}
        <Select
          value={filterTipe}
          onValueChange={(val) => setFilterTipe(val as "Semua" | TipeSatuan)}
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-background/50 dark:bg-zinc-900/50">
            <SelectValue placeholder="Tipe Satuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Tipe</SelectItem>
            {TIPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filter */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground md:w-auto w-full h-10"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
              <TableRow>
                <TableHead className="w-[120px] font-semibold text-foreground">
                  Kode
                </TableHead>
                <TableHead className="min-w-[160px] font-semibold text-foreground">
                  Nama Satuan
                </TableHead>
                <TableHead className="w-[90px] font-semibold text-foreground">
                  Simbol
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-foreground">
                  Tipe
                </TableHead>
                <TableHead className="min-w-[200px] font-semibold text-foreground">
                  Deskripsi
                </TableHead>
                <TableHead className="w-[110px] font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[110px] font-semibold text-foreground text-center">
                  Jml. Barang
                </TableHead>
                <TableHead className="text-center w-[100px] font-semibold text-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length > 0 ? (
                filteredList.map((satuan) => (
                  <TableRow
                    key={satuan.id}
                    className="hover:bg-muted/30 dark:hover:bg-zinc-800/20 transition-colors duration-150"
                  >
                    {/* Kode */}
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {satuan.kodeSatuan}
                    </TableCell>

                    {/* Nama Satuan */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {satuan.namaSatuan}
                        </span>
                        {satuan.isDefault && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Simbol */}
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                        {satuan.simbol || "-"}
                      </code>
                    </TableCell>

                    {/* Tipe */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 rounded-full border ${tipeColors[satuan.tipeSatuan]}`}
                      >
                        {satuan.tipeSatuan}
                      </Badge>
                    </TableCell>

                    {/* Deskripsi */}
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {satuan.deskripsi || "-"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                          satuan.status === "Aktif"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            satuan.status === "Aktif"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-zinc-400"
                          }`}
                        />
                        {satuan.status}
                      </Badge>
                    </TableCell>

                    {/* Jumlah Barang */}
                    <TableCell className="text-center">
                      {satuan.jumlahBarang > 0 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <IconBox className="size-3" />
                          {satuan.jumlahBarang}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditSheet(satuan)}
                          title="Ubah Satuan"
                          className="size-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary dark:hover:bg-primary/20"
                        >
                          <IconPencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(satuan)}
                          title="Hapus Satuan"
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
                    colSpan={8}
                    className="h-40 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <IconInfoCircle className="size-10 text-muted-foreground/40" />
                      <div>
                        <p className="font-medium">
                          {hasActiveFilters
                            ? "Tidak ada satuan yang sesuai filter."
                            : "Belum ada satuan barang."}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {hasActiveFilters
                            ? "Coba ubah kata kunci atau filter Anda."
                            : "Tambahkan satuan agar barang dapat dibuat dengan data yang konsisten."}
                        </p>
                      </div>
                      {hasActiveFilters ? (
                        <Button variant="link" onClick={clearFilters} className="text-xs">
                          Reset Filter
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openAddSheet}
                          className="mt-1"
                        >
                          <IconPlus className="size-3.5 mr-1" />
                          Tambah Satuan
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        {filteredList.length > 0 && (
          <div className="border-t px-4 py-2.5 bg-muted/20 dark:bg-zinc-900/30">
            <p className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">{filteredList.length}</span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">{totalSatuan}</span> satuan
            </p>
          </div>
        )}
      </div>

      {/* ======================== Sheet (Add / Edit Form) ======================== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l bg-background shadow-xl flex flex-col gap-0 overflow-y-auto">
          <SheetHeader className="pb-4 border-b px-6 pt-6">
            <SheetTitle className="text-xl font-bold text-foreground">
              {editingSatuan ? "Ubah Satuan" : "Tambah Satuan"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingSatuan
                ? "Modifikasi data satuan terpilih. Klik simpan untuk menyimpan perubahan."
                : "Masukkan detail informasi satuan barang baru di bawah ini."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-5 px-6 py-5 flex-1">
            {/* Kode Satuan */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-kode" className="text-sm font-medium text-foreground">
                Kode Satuan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sat-kode"
                value={formKode}
                onChange={(e) => setFormKode(e.target.value)}
                placeholder="Contoh: SAT-001"
                required
                className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </div>

            {/* Nama Satuan */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-nama" className="text-sm font-medium text-foreground">
                Nama Satuan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sat-nama"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Gram"
                required
                className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Nama satuan harus unik. Hindari variasi penulisan (mis. gram dan Gram).
              </p>
            </div>

            {/* Simbol */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-simbol" className="text-sm font-medium text-foreground">
                Simbol / Singkatan
              </Label>
              <Input
                id="sat-simbol"
                value={formSimbol}
                onChange={(e) => setFormSimbol(e.target.value)}
                placeholder="Contoh: gr"
                maxLength={10}
                className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </div>

            {/* Tipe Satuan */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-tipe" className="text-sm font-medium text-foreground">
                Tipe Satuan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formTipe}
                onValueChange={(val) => setFormTipe(val as TipeSatuan)}
              >
                <SelectTrigger id="sat-tipe" className="h-10">
                  <SelectValue placeholder="Pilih tipe satuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit">Unit — per item / per buah</SelectItem>
                  <SelectItem value="Berat">Berat — berdasarkan bobot (gram, kg)</SelectItem>
                  <SelectItem value="Pasangan">Pasangan — per pasang (anting, dll.)</SelectItem>
                  <SelectItem value="Paket">Paket — set / bundel barang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-deskripsi" className="text-sm font-medium text-foreground">
                Deskripsi
              </Label>
              <textarea
                id="sat-deskripsi"
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                placeholder="Catatan singkat mengenai penggunaan satuan ini..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="sat-status" className="text-sm font-medium text-foreground">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formStatus}
                onValueChange={(val) => setFormStatus(val as StatusSatuan)}
              >
                <SelectTrigger id="sat-status" className="h-10">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
              {formStatus === "Non-Aktif" && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Satuan non-aktif tidak akan muncul di dropdown pemilihan barang baru.
                </p>
              )}
            </div>

            {/* Footer */}
            <SheetFooter className="mt-auto pt-5 border-t flex flex-row items-center gap-2 sm:justify-end">
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

      {/* ======================== Delete Confirmation Modal ======================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-200">
          <div className="w-full max-w-md scale-100 rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-red-500/10 p-2 text-red-600 dark:bg-red-500/20">
                <IconAlertTriangle className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Hapus Satuan</h3>
            </div>

            {satuanToDelete && satuanToDelete.jumlahBarang > 0 ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                Satuan{" "}
                <strong className="text-foreground">
                  &ldquo;{satuanToDelete.namaSatuan}&rdquo;
                </strong>{" "}
                tidak dapat dihapus karena masih digunakan oleh{" "}
                <strong className="text-amber-600 dark:text-amber-400">
                  {satuanToDelete.jumlahBarang} barang
                </strong>
                . Silakan nonaktifkan satuan ini jika tidak ingin digunakan lagi.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                Apakah Anda yakin ingin menghapus satuan{" "}
                <strong className="text-foreground">
                  &ldquo;{satuanToDelete?.namaSatuan}&rdquo; ({satuanToDelete?.kodeSatuan})
                </strong>
                ?<br />
                Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSatuanToDelete(null)
                }}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              {satuanToDelete && satuanToDelete.jumlahBarang === 0 && (
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="w-full sm:w-auto"
                >
                  Ya, Hapus
                </Button>
              )}
              {satuanToDelete && satuanToDelete.jumlahBarang > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Nonaktifkan satuan
                    setSatuanList((prev) =>
                      prev.map((s) =>
                        s.id === satuanToDelete.id
                          ? { ...s, status: "Non-Aktif" }
                          : s
                      )
                    )
                    toast.success(
                      `Satuan "${satuanToDelete.namaSatuan}" telah dinonaktifkan.`
                    )
                    setIsDeleteModalOpen(false)
                    setSatuanToDelete(null)
                  }}
                  className="w-full sm:w-auto border-amber-500/50 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                >
                  Nonaktifkan Saja
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
