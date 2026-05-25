"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconCheck,
  IconAlertTriangle,
  IconChevronRight,
  IconInfoCircle,
  IconBan,
  IconStar,
  IconDiamond,
  IconFlame,
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
type StatusKadar = "Aktif" | "Non-Aktif"

interface KadarEmas {
  id: string
  kodeKadar: string
  namaKadar: string
  karat: number
  fineness: number
  persentase: number
  deskripsi: string
  status: StatusKadar
  isDefault: boolean
  jumlahBarang: number
}

// ----- Initial Mock Data -----
const INITIAL_KADAR: KadarEmas[] = [
  {
    id: "1",
    kodeKadar: "KDR-001",
    namaKadar: "24K",
    karat: 24,
    fineness: 999,
    persentase: 99.9,
    deskripsi: "Emas murni, digunakan untuk emas batangan dan logam mulia",
    status: "Aktif",
    isDefault: true,
    jumlahBarang: 8,
  },
  {
    id: "2",
    kodeKadar: "KDR-002",
    namaKadar: "23K",
    karat: 23,
    fineness: 958,
    persentase: 95.8,
    deskripsi: "Emas 23 karat, kemurnian tinggi namun lebih mudah dibentuk",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 5,
  },
  {
    id: "3",
    kodeKadar: "KDR-003",
    namaKadar: "22K",
    karat: 22,
    fineness: 916,
    persentase: 91.6,
    deskripsi: "Emas 22 karat, paling umum untuk perhiasan di Indonesia",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 24,
  },
  {
    id: "4",
    kodeKadar: "KDR-004",
    namaKadar: "18K",
    karat: 18,
    fineness: 750,
    persentase: 75.0,
    deskripsi: "Emas 18 karat, cocok untuk perhiasan berdesain dan bertahta batu",
    status: "Aktif",
    isDefault: false,
    jumlahBarang: 15,
  },
  {
    id: "5",
    kodeKadar: "KDR-005",
    namaKadar: "14K",
    karat: 14,
    fineness: 585,
    persentase: 58.5,
    deskripsi: "Emas 14 karat, lebih tahan lama dan ekonomis",
    status: "Non-Aktif",
    isDefault: false,
    jumlahBarang: 0,
  },
]

// ----- Helper -----
function generateKode(list: KadarEmas[]) {
  const num = list.length + 1
  return `KDR-${String(num).padStart(3, "0")}`
}

function hitungPersentase(karat: number): number {
  return Math.round((karat / 24) * 1000) / 10
}

function getKaratColor(karat: number): string {
  if (karat >= 24) return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400"
  if (karat >= 22) return "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400"
  if (karat >= 18) return "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400"
  return "bg-zinc-500/15 text-zinc-500 border-zinc-500/30"
}

// ----- Page Component -----
export default function KadarEmasPage() {
  const [kadarList, setKadarList] = useState<KadarEmas[]>(INITIAL_KADAR)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"Semua" | StatusKadar>("Semua")

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingKadar, setEditingKadar] = useState<KadarEmas | null>(null)

  // Form state
  const [formKode, setFormKode] = useState("")
  const [formNama, setFormNama] = useState("")
  const [formKarat, setFormKarat] = useState("")
  const [formFineness, setFormFineness] = useState("")
  const [formPersentase, setFormPersentase] = useState("")
  const [formDeskripsi, setFormDeskripsi] = useState("")
  const [formStatus, setFormStatus] = useState<StatusKadar>("Aktif")

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [kadarToDelete, setKadarToDelete] = useState<KadarEmas | null>(null)

  // ----- Stats -----
  const totalKadar = kadarList.length
  const kadarAktif = kadarList.filter((k) => k.status === "Aktif").length
  const kadarNonAktif = kadarList.filter((k) => k.status === "Non-Aktif").length
  const kadarTerpakai = kadarList.filter((k) => k.jumlahBarang > 0).length

  // ----- Filtered list -----
  const filteredList = useMemo(() => {
    return kadarList.filter((k) => {
      const matchSearch =
        k.namaKadar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.kodeKadar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(k.karat).includes(searchQuery) ||
        String(k.fineness).includes(searchQuery)
      const matchStatus = filterStatus === "Semua" || k.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [kadarList, searchQuery, filterStatus])

  // ----- Handlers -----
  const openAddSheet = () => {
    setEditingKadar(null)
    setFormKode(generateKode(kadarList))
    setFormNama("")
    setFormKarat("")
    setFormFineness("")
    setFormPersentase("")
    setFormDeskripsi("")
    setFormStatus("Aktif")
    setIsSheetOpen(true)
  }

  const openEditSheet = (kadar: KadarEmas) => {
    setEditingKadar(kadar)
    setFormKode(kadar.kodeKadar)
    setFormNama(kadar.namaKadar)
    setFormKarat(String(kadar.karat))
    setFormFineness(String(kadar.fineness))
    setFormPersentase(String(kadar.persentase))
    setFormDeskripsi(kadar.deskripsi)
    setFormStatus(kadar.status)
    setIsSheetOpen(true)
  }

  // Auto-hitung persentase dari karat
  const handleKaratChange = (val: string) => {
    setFormKarat(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0 && num <= 24) {
      setFormPersentase(String(hitungPersentase(num)))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const karatNum = parseFloat(formKarat)
    const finenessNum = parseFloat(formFineness)
    const persentaseNum = parseFloat(formPersentase)

    if (!formKode.trim() || !formNama.trim()) {
      toast.error("Kode dan Nama Kadar wajib diisi!")
      return
    }
    if (isNaN(karatNum) || karatNum <= 0 || karatNum > 24) {
      toast.error("Nilai karat harus angka antara 1–24.")
      return
    }
    if (isNaN(finenessNum) || finenessNum <= 0) {
      toast.error("Nilai fineness harus angka positif.")
      return
    }

    // Cek duplikat nama
    const isDuplicate = kadarList.some(
      (k) =>
        k.namaKadar.toLowerCase() === formNama.toLowerCase() &&
        k.id !== editingKadar?.id
    )
    if (isDuplicate) {
      toast.error(`Nama kadar "${formNama}" sudah ada. Gunakan nama yang berbeda.`)
      return
    }

    if (editingKadar) {
      setKadarList((prev) =>
        prev.map((k) =>
          k.id === editingKadar.id
            ? {
                ...k,
                kodeKadar: formKode,
                namaKadar: formNama,
                karat: karatNum,
                fineness: finenessNum,
                persentase: isNaN(persentaseNum) ? hitungPersentase(karatNum) : persentaseNum,
                deskripsi: formDeskripsi,
                status: formStatus,
              }
            : k
        )
      )
      toast.success(`Kadar "${formNama}" berhasil diperbarui.`)
    } else {
      const newKadar: KadarEmas = {
        id: Date.now().toString(),
        kodeKadar: formKode,
        namaKadar: formNama,
        karat: karatNum,
        fineness: finenessNum,
        persentase: isNaN(persentaseNum) ? hitungPersentase(karatNum) : persentaseNum,
        deskripsi: formDeskripsi,
        status: formStatus,
        isDefault: false,
        jumlahBarang: 0,
      }
      setKadarList((prev) => [...prev, newKadar])
      toast.success(`Kadar "${formNama}" berhasil ditambahkan.`)
    }

    setIsSheetOpen(false)
  }

  const handleDeleteClick = (kadar: KadarEmas) => {
    setKadarToDelete(kadar)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!kadarToDelete) return
    setKadarList((prev) => prev.filter((k) => k.id !== kadarToDelete.id))
    toast.success(`Kadar "${kadarToDelete.namaKadar}" berhasil dihapus.`)
    setIsDeleteModalOpen(false)
    setKadarToDelete(null)
  }

  const handleNonaktifkan = (kadar: KadarEmas) => {
    setKadarList((prev) =>
      prev.map((k) => (k.id === kadar.id ? { ...k, status: "Non-Aktif" } : k))
    )
    toast.success(`Kadar "${kadar.namaKadar}" telah dinonaktifkan.`)
    setIsDeleteModalOpen(false)
    setKadarToDelete(null)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("Semua")
  }

  const hasActiveFilters = searchQuery !== "" || filterStatus !== "Semua"

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span>Persediaan Emas</span>
            <IconChevronRight className="size-3" />
            <span className="text-foreground font-medium">Kadar Emas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Kadar Emas
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola master data kadar atau kemurnian emas yang digunakan pada seluruh barang.
          </p>
        </div>
        <Button
          onClick={openAddSheet}
          className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <IconPlus className="size-4 mr-1" />
          Tambah Kadar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-yellow-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-500 dark:bg-yellow-500/20">
              <IconDiamond className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Kadar</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalKadar}</h3>
            </div>
          </div>
        </div>

        {/* Aktif */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500 dark:bg-emerald-500/20">
              <IconCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Kadar Aktif</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {kadarAktif}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ {totalKadar}</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Non-Aktif */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-zinc-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-500/10 p-2.5 text-zinc-500 dark:bg-zinc-500/20">
              <IconBan className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Non-Aktif</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{kadarNonAktif}</h3>
            </div>
          </div>
        </div>

        {/* Terpakai */}
        <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-amber-500/10 blur-xl" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500 dark:bg-amber-500/20">
              <IconFlame className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Terpakai Barang</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{kadarTerpakai}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card/30 p-4 shadow-xs backdrop-blur-xs dark:bg-zinc-950/20 md:flex-row md:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama kadar, karat, atau fineness..."
            className="pl-9 h-10 border-muted bg-background/50 focus-visible:ring-primary/50 focus-visible:border-primary dark:bg-zinc-900/50"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(val) => setFilterStatus(val as "Semua" | StatusKadar)}
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-background/50 dark:bg-zinc-900/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
          </SelectContent>
        </Select>

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
                <TableHead className="w-[110px] font-semibold text-foreground">Kode</TableHead>
                <TableHead className="min-w-[130px] font-semibold text-foreground">Nama Kadar</TableHead>
                <TableHead className="w-[80px] font-semibold text-foreground text-center">Karat</TableHead>
                <TableHead className="w-[90px] font-semibold text-foreground text-center">Fineness</TableHead>
                <TableHead className="w-[100px] font-semibold text-foreground text-center">Kemurnian</TableHead>
                <TableHead className="min-w-[200px] font-semibold text-foreground">Deskripsi</TableHead>
                <TableHead className="w-[110px] font-semibold text-foreground">Status</TableHead>
                <TableHead className="w-[110px] font-semibold text-foreground text-center">Jml. Barang</TableHead>
                <TableHead className="w-[100px] font-semibold text-foreground text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length > 0 ? (
                filteredList.map((kadar) => (
                  <TableRow
                    key={kadar.id}
                    className="hover:bg-muted/30 dark:hover:bg-zinc-800/20 transition-colors duration-150"
                  >
                    {/* Kode */}
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {kadar.kodeKadar}
                    </TableCell>

                    {/* Nama */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getKaratColor(kadar.karat)}`}
                        >
                          {kadar.namaKadar}
                        </Badge>
                        {kadar.isDefault && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400"
                          >
                            <IconStar className="size-2.5 mr-0.5" />
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Karat */}
                    <TableCell className="text-center">
                      <span className="font-semibold text-foreground text-sm">{kadar.karat}K</span>
                    </TableCell>

                    {/* Fineness */}
                    <TableCell className="text-center">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold text-foreground">
                        {kadar.fineness}
                      </code>
                    </TableCell>

                    {/* Persentase */}
                    <TableCell className="text-center">
                      <span className="text-sm font-medium text-foreground">
                        {kadar.persentase}%
                      </span>
                    </TableCell>

                    {/* Deskripsi */}
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {kadar.deskripsi || "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                          kadar.status === "Aktif"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            kadar.status === "Aktif"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-zinc-400"
                          }`}
                        />
                        {kadar.status}
                      </Badge>
                    </TableCell>

                    {/* Jumlah Barang */}
                    <TableCell className="text-center">
                      {kadar.jumlahBarang > 0 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {kadar.jumlahBarang} barang
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
                          onClick={() => openEditSheet(kadar)}
                          title="Ubah Kadar"
                          className="size-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary dark:hover:bg-primary/20"
                        >
                          <IconPencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(kadar)}
                          title="Hapus Kadar"
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
                  <TableCell colSpan={9} className="h-40 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <IconInfoCircle className="size-10 text-muted-foreground/40" />
                      <div>
                        <p className="font-medium">
                          {hasActiveFilters
                            ? "Tidak ada kadar yang sesuai filter."
                            : "Belum ada data kadar emas."}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {hasActiveFilters
                            ? "Coba ubah kata kunci atau filter Anda."
                            : "Tambahkan kadar emas agar barang dapat dibuat dengan data kemurnian yang konsisten."}
                        </p>
                      </div>
                      {hasActiveFilters ? (
                        <Button variant="link" onClick={clearFilters} className="text-xs">
                          Reset Filter
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={openAddSheet} className="mt-1">
                          <IconPlus className="size-3.5 mr-1" />
                          Tambah Kadar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredList.length > 0 && (
          <div className="border-t px-4 py-2.5 bg-muted/20 dark:bg-zinc-900/30">
            <p className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">{filteredList.length}</span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">{totalKadar}</span> kadar
            </p>
          </div>
        )}
      </div>

      {/* ======================== Sheet (Form) ======================== */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l bg-background shadow-xl flex flex-col gap-0 overflow-y-auto">
          <SheetHeader className="pb-4 border-b px-6 pt-6">
            <SheetTitle className="text-xl font-bold text-foreground">
              {editingKadar ? "Ubah Kadar Emas" : "Tambah Kadar Emas"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingKadar
                ? "Modifikasi data kadar terpilih. Perhatikan perubahan nilai pada kadar yang sudah dipakai barang."
                : "Masukkan informasi kadar emas baru. Persentase akan dihitung otomatis dari nilai karat."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="flex flex-col gap-5 px-6 py-5 flex-1">
            {/* Preview Badge */}
            {formNama && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
                <span className="text-xs text-muted-foreground">Preview:</span>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold px-2.5 py-1 border ${getKaratColor(parseFloat(formKarat) || 0)}`}
                >
                  {formNama}
                </Badge>
                {formKarat && (
                  <span className="text-xs text-muted-foreground">
                    {formKarat}K · {formFineness || "—"} · {formPersentase || "—"}%
                  </span>
                )}
              </div>
            )}

            {/* Kode */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="kdr-kode" className="text-sm font-medium text-foreground">
                Kode Kadar <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kdr-kode"
                value={formKode}
                onChange={(e) => setFormKode(e.target.value)}
                placeholder="Contoh: KDR-001"
                required
                className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </div>

            {/* Nama Kadar */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="kdr-nama" className="text-sm font-medium text-foreground">
                Nama Kadar <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kdr-nama"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: 22K"
                required
                className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan format standar seperti 24K, 23K, 22K, 18K, dst.
              </p>
            </div>

            {/* Karat & Fineness dalam 1 baris */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="kdr-karat" className="text-sm font-medium text-foreground">
                  Karat <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kdr-karat"
                  type="number"
                  min={1}
                  max={24}
                  step={1}
                  value={formKarat}
                  onChange={(e) => handleKaratChange(e.target.value)}
                  placeholder="1–24"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="kdr-fineness" className="text-sm font-medium text-foreground">
                  Fineness <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kdr-fineness"
                  type="number"
                  min={1}
                  max={999}
                  value={formFineness}
                  onChange={(e) => setFormFineness(e.target.value)}
                  placeholder="Mis: 916"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>
            </div>

            {/* Persentase (auto) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="kdr-persen" className="text-sm font-medium text-foreground">
                Persentase Kemurnian
              </Label>
              <div className="relative">
                <Input
                  id="kdr-persen"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={formPersentase}
                  onChange={(e) => setFormPersentase(e.target.value)}
                  placeholder="Otomatis dari karat"
                  className="h-10 pr-8 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Otomatis dihitung dari karat. Bisa diubah manual jika diperlukan.
              </p>
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="kdr-deskripsi" className="text-sm font-medium text-foreground">
                Deskripsi
              </Label>
              <textarea
                id="kdr-deskripsi"
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                placeholder="Catatan singkat mengenai kadar ini..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="kdr-status" className="text-sm font-medium text-foreground">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formStatus}
                onValueChange={(val) => setFormStatus(val as StatusKadar)}
              >
                <SelectTrigger id="kdr-status" className="h-10">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
              {formStatus === "Non-Aktif" && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Kadar non-aktif tidak akan muncul di dropdown pembuatan barang baru.
                </p>
              )}
            </div>

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

      {/* ======================== Delete Modal ======================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-200">
          <div className="w-full max-w-md scale-100 rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-red-500/10 p-2 text-red-600 dark:bg-red-500/20">
                <IconAlertTriangle className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Hapus Kadar Emas</h3>
            </div>

            {kadarToDelete && kadarToDelete.jumlahBarang > 0 ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kadar{" "}
                <strong className="text-foreground">
                  &ldquo;{kadarToDelete.namaKadar}&rdquo;
                </strong>{" "}
                tidak dapat dihapus karena masih digunakan oleh{" "}
                <strong className="text-amber-600 dark:text-amber-400">
                  {kadarToDelete.jumlahBarang} barang
                </strong>
                . Pilih untuk menonaktifkan saja.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                Apakah Anda yakin ingin menghapus kadar{" "}
                <strong className="text-foreground">
                  &ldquo;{kadarToDelete?.namaKadar}&rdquo; ({kadarToDelete?.kodeKadar})
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
                  setKadarToDelete(null)
                }}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>

              {kadarToDelete && kadarToDelete.jumlahBarang > 0 && (
                <Button
                  variant="outline"
                  onClick={() => kadarToDelete && handleNonaktifkan(kadarToDelete)}
                  className="w-full sm:w-auto border-amber-500/50 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                >
                  Nonaktifkan Saja
                </Button>
              )}

              {kadarToDelete && kadarToDelete.jumlahBarang === 0 && (
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="w-full sm:w-auto"
                >
                  Ya, Hapus
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
