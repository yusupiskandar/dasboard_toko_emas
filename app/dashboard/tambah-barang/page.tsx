"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconChevronRight,
  IconCheck,
  IconX,
  IconPlus,
  IconPhoto,
  IconTrash,
  IconInfoCircle,
  IconRefresh,
  IconStar,
  IconStarFilled,
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

// ============================================================
// Master Data (inline – nantinya bisa dari API / context)
// ============================================================
const MASTER_KATEGORI = [
  { id: "KTG-001", nama: "Cincin Emas" },
  { id: "KTG-002", nama: "Kalung Emas" },
  { id: "KTG-003", nama: "Gelang Emas" },
  { id: "KTG-004", nama: "Anting Emas" },
  { id: "KTG-005", nama: "Logam Mulia" },
]

const MASTER_BRAND = [
  { id: "BRD-001", nama: "Antam" },
  { id: "BRD-002", nama: "UBS Gold" },
  { id: "BRD-003", nama: "Hartadinata" },
  { id: "BRD-004", nama: "Lotus Archi" },
  { id: "BRD-005", nama: "Tanpa Brand" },
]

const MASTER_SATUAN = [
  { id: "SAT-001", nama: "Gram", simbol: "gr" },
  { id: "SAT-002", nama: "Pcs", simbol: "pcs" },
  { id: "SAT-003", nama: "Pasang", simbol: "ps" },
  { id: "SAT-004", nama: "Set", simbol: "set" },
]

const MASTER_KADAR = [
  { id: "KDR-001", nama: "24K", fineness: 999, persentase: 99.9 },
  { id: "KDR-002", nama: "23K", fineness: 958, persentase: 95.8 },
  { id: "KDR-003", nama: "22K", fineness: 916, persentase: 91.6 },
  { id: "KDR-004", nama: "18K", fineness: 750, persentase: 75.0 },
  { id: "KDR-005", nama: "14K", fineness: 585, persentase: 58.5 },
]

const MASTER_BAKI = [
  { id: "BAKI-001", nama: "Baki Cincin Premium", area: "Etalase Depan A" },
  { id: "BAKI-002", nama: "Baki Kalung Rantai", area: "Safe Deposit Box A" },
  { id: "BAKI-003", nama: "Baki Gelang Bangle", area: "Safe Deposit Box B" },
  { id: "BAKI-004", nama: "Baki Logam Mulia", area: "Brankas Utama" },
]

const JENIS_BARANG = ["Perhiasan", "Logam Mulia", "Aksesori", "Koleksi Khusus"]

// ============================================================
// Helpers
// ============================================================
function formatRupiah(val: string): string {
  const num = val.replace(/\D/g, "")
  if (!num) return ""
  return new Intl.NumberFormat("id-ID").format(Number(num))
}

function parseRupiah(val: string): string {
  return val.replace(/\D/g, "")
}

function generateKodeBarang(existing: number) {
  return `BRG-${String(existing + 1).padStart(4, "0")}`
}

// ============================================================
// Initial Form State
// ============================================================
const EMPTY_FORM = {
  // Informasi Utama
  kodeBarang: generateKodeBarang(8), // 8 existing
  namaBarang: "",
  kategoriId: "",
  brandId: "",
  jenisBarang: "",
  sku: "",
  // Spesifikasi Emas
  kadarId: "",
  berat: "",
  satuanId: "",
  deskripsi: "",
  model: "",
  // Harga
  hargaModal: "",
  hargaJual: "",
  biayaTambahan: "",
  // Stok & Gudang
  stokAwal: "",
  minStok: "",
  bakiId: "",
  statusBarang: "Aktif" as "Aktif" | "Non-Aktif",
  // Informasi Tambahan
  catatanInternal: "",
  barangUnggulan: false,
  tanggalMasuk: new Date().toISOString().split("T")[0],
}

export default function TambahBarangPage() {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [hargaModalDisplay, setHargaModalDisplay] = useState("")
  const [hargaJualDisplay, setHargaJualDisplay] = useState("")
  const [biayaTambahanDisplay, setBiayaTambahanDisplay] = useState("")

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // ============================================================
  // Handlers
  // ============================================================
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, WEBP).")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2 MB.")
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
  }

  const handleHargaModal = (val: string) => {
    const raw = parseRupiah(val)
    set("hargaModal", raw)
    setHargaModalDisplay(formatRupiah(raw))
  }

  const handleHargaJual = (val: string) => {
    const raw = parseRupiah(val)
    set("hargaJual", raw)
    setHargaJualDisplay(formatRupiah(raw))
  }

  const handleBiayaTambahan = (val: string) => {
    const raw = parseRupiah(val)
    set("biayaTambahan", raw)
    setBiayaTambahanDisplay(formatRupiah(raw))
  }

  // Margin auto-calc
  const margin = (() => {
    const modal = Number(form.hargaModal) || 0
    const jual = Number(form.hargaJual) || 0
    if (!modal || !jual) return null
    const pct = ((jual - modal) / modal) * 100
    return pct
  })()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.kodeBarang.trim()) e.kodeBarang = "Kode barang wajib diisi."
    if (!form.namaBarang.trim()) e.namaBarang = "Nama barang wajib diisi."
    if (!form.kategoriId) e.kategoriId = "Kategori wajib dipilih."
    if (!form.satuanId) e.satuanId = "Satuan wajib dipilih."
    if (!form.kadarId) e.kadarId = "Kadar emas wajib dipilih."
    if (!form.berat || isNaN(Number(form.berat)) || Number(form.berat) <= 0)
      e.berat = "Berat harus angka positif."
    if (form.hargaModal && isNaN(Number(form.hargaModal)))
      e.hargaModal = "Harga modal harus angka."
    if (form.hargaJual && isNaN(Number(form.hargaJual)))
      e.hargaJual = "Harga jual harus angka."
    if (!form.stokAwal || isNaN(Number(form.stokAwal)) || Number(form.stokAwal) < 0)
      e.stokAwal = "Stok awal harus angka ≥ 0."
    return e
  }

  const handleSave = (e: React.FormEvent, addAnother = false) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error("Mohon perbaiki field yang tidak valid.")
      // Scroll to first error
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setErrors({})

    // Simulate save
    const kadar = MASTER_KADAR.find((k) => k.id === form.kadarId)
    const satuan = MASTER_SATUAN.find((s) => s.id === form.satuanId)
    const kategori = MASTER_KATEGORI.find((k) => k.id === form.kategoriId)

    toast.success(
      `Barang "${form.namaBarang}" (${form.kodeBarang}) berhasil disimpan!`,
      {
        description: `${kategori?.nama} · ${kadar?.nama} · ${form.berat} ${satuan?.simbol}`,
        duration: 4000,
      }
    )

    if (addAnother) {
      setForm({
        ...EMPTY_FORM,
        kodeBarang: generateKodeBarang(9),
      })
      setHargaModalDisplay("")
      setHargaJualDisplay("")
      setBiayaTambahanDisplay("")
      setPhotoPreview(null)
      setPhotoFile(null)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleReset = () => {
    setForm({ ...EMPTY_FORM })
    setHargaModalDisplay("")
    setHargaJualDisplay("")
    setBiayaTambahanDisplay("")
    setPhotoPreview(null)
    setPhotoFile(null)
    setErrors({})
    toast.info("Form direset ke kondisi awal.")
  }

  const selectedKadar = MASTER_KADAR.find((k) => k.id === form.kadarId)
  const selectedBaki = MASTER_BAKI.find((b) => b.id === form.bakiId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span>Persediaan Emas</span>
            <IconChevronRight className="size-3" />
            <Link href="/dashboard/data-barang" className="hover:text-foreground">
              Data Barang
            </Link>
            <IconChevronRight className="size-3" />
            <span className="text-foreground font-medium">Tambah Barang</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tambah Barang
          </h1>
          <p className="text-sm text-muted-foreground">
            Buat data barang emas baru yang terhubung ke semua master data toko.
          </p>
        </div>

        {/* Action Buttons – header */}
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-9 text-sm gap-1.5"
          >
            <IconRefresh className="size-4" />
            Reset
          </Button>
          <Link href="/dashboard/data-barang">
            <Button variant="outline" className="h-9 text-sm gap-1.5">
              <IconX className="size-4" />
              Batal
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={(e) => handleSave(e, true)}
            className="h-9 text-sm gap-1.5"
          >
            <IconPlus className="size-4" />
            Simpan &amp; Tambah Lagi
          </Button>
          <Button
            onClick={(e) => handleSave(e)}
            className="h-9 text-sm gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <IconCheck className="size-4" />
            Simpan
          </Button>
        </div>
      </div>

      {/* ── Form Body ── */}
      <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-5" noValidate>
        {/* ── SECTION 1: Informasi Utama ── */}
        <SectionCard title="Informasi Utama" subtitle="Identitas dasar barang dalam sistem">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Kode Barang */}
            <Field label="Kode Barang" required error={errors.kodeBarang}>
              <div className="relative">
                <Input
                  id="kodeBarang"
                  value={form.kodeBarang}
                  onChange={(e) => set("kodeBarang", e.target.value)}
                  placeholder="BRG-0001"
                  className={inputCls(errors.kodeBarang)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Kode unik untuk identifikasi barang di sistem.
              </p>
            </Field>

            {/* Nama Barang */}
            <Field label="Nama Barang" required error={errors.namaBarang}>
              <Input
                id="namaBarang"
                value={form.namaBarang}
                onChange={(e) => set("namaBarang", e.target.value)}
                placeholder="Contoh: Cincin Emas Bunga 22K"
                className={inputCls(errors.namaBarang)}
              />
            </Field>

            {/* Kategori */}
            <Field label="Kategori Barang" required error={errors.kategoriId}>
              <Select value={form.kategoriId} onValueChange={(v) => set("kategoriId", v)}>
                <SelectTrigger id="kategoriId" className={inputCls(errors.kategoriId)}>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {MASTER_KATEGORI.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Brand */}
            <Field label="Brand Emas">
              <Select value={form.brandId} onValueChange={(v) => set("brandId", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih brand..." />
                </SelectTrigger>
                <SelectContent>
                  {MASTER_BRAND.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Jenis Barang */}
            <Field label="Jenis Barang">
              <Select value={form.jenisBarang} onValueChange={(v) => set("jenisBarang", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih jenis..." />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_BARANG.map((j) => (
                    <SelectItem key={j} value={j}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* SKU / Barcode */}
            <Field label="SKU / Barcode" hint="Opsional">
              <Input
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="Scan atau ketik barcode..."
                className="h-10"
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── SECTION 2: Spesifikasi Emas ── */}
        <SectionCard title="Spesifikasi Emas" subtitle="Kadar, berat, dan karakteristik fisik barang">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Kadar Emas */}
            <Field label="Kadar Emas" required error={errors.kadarId}>
              <Select value={form.kadarId} onValueChange={(v) => set("kadarId", v)}>
                <SelectTrigger id="kadarId" className={inputCls(errors.kadarId)}>
                  <SelectValue placeholder="Pilih kadar..." />
                </SelectTrigger>
                <SelectContent>
                  {MASTER_KADAR.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.nama} — {k.fineness} ({k.persentase}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedKadar && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs font-bold text-amber-600 border-amber-500/30 bg-amber-500/10 dark:text-amber-400">
                    {selectedKadar.nama}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Fineness {selectedKadar.fineness} · {selectedKadar.persentase}% murni
                  </span>
                </div>
              )}
            </Field>

            {/* Berat + Satuan */}
            <Field label="Berat &amp; Satuan" required error={errors.berat || errors.satuanId}>
              <div className="flex gap-2">
                <Input
                  id="berat"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.berat}
                  onChange={(e) => set("berat", e.target.value)}
                  placeholder="0.00"
                  className={`flex-1 h-10 ${errors.berat ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
                />
                <Select value={form.satuanId} onValueChange={(v) => set("satuanId", v)}>
                  <SelectTrigger id="satuanId" className={`w-[130px] h-10 ${errors.satuanId ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {MASTER_SATUAN.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama} ({s.simbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Field>

            {/* Model / Koleksi */}
            <Field label="Model / Koleksi" hint="Opsional">
              <Input
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Contoh: Classic Series, Bunga Matahari"
                className="h-10"
              />
            </Field>
          </div>

          {/* Deskripsi */}
          <div className="mt-4">
            <Field label="Deskripsi Barang" hint="Opsional">
              <textarea
                value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                placeholder="Catatan detail mengenai barang, kondisi, keunikan, dsb..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── SECTION 3: Harga ── */}
        <SectionCard title="Informasi Harga" subtitle="Harga modal, harga jual, dan margin">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Harga Modal */}
            <Field label="Harga Modal" error={errors.hargaModal}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Rp</span>
                <Input
                  id="hargaModal"
                  value={hargaModalDisplay}
                  onChange={(e) => handleHargaModal(e.target.value)}
                  placeholder="0"
                  className={`pl-9 h-10 ${errors.hargaModal ? "border-red-500" : ""}`}
                />
              </div>
            </Field>

            {/* Harga Jual */}
            <Field label="Harga Jual" error={errors.hargaJual}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Rp</span>
                <Input
                  id="hargaJual"
                  value={hargaJualDisplay}
                  onChange={(e) => handleHargaJual(e.target.value)}
                  placeholder="0"
                  className={`pl-9 h-10 ${errors.hargaJual ? "border-red-500" : ""}`}
                />
              </div>
            </Field>

            {/* Biaya Tambahan */}
            <Field label="Biaya / Ongkos Tambahan" hint="Opsional">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Rp</span>
                <Input
                  value={biayaTambahanDisplay}
                  onChange={(e) => handleBiayaTambahan(e.target.value)}
                  placeholder="0"
                  className="pl-9 h-10"
                />
              </div>
            </Field>

            {/* Margin Preview */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Margin (otomatis)</Label>
              <div className={`flex items-center h-10 px-3 rounded-md border text-sm font-semibold ${
                margin === null
                  ? "bg-muted/30 text-muted-foreground border-muted"
                  : margin >= 0
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 border-red-500/20"
              }`}>
                {margin === null ? "— (isi harga modal & jual)" : `${margin.toFixed(1)}%`}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── SECTION 4: Stok & Gudang ── */}
        <SectionCard title="Stok &amp; Lokasi Gudang" subtitle="Jumlah stok awal dan penempatan fisik barang">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Stok Awal */}
            <Field label="Stok Awal" required error={errors.stokAwal}>
              <Input
                id="stokAwal"
                type="number"
                min={0}
                step={1}
                value={form.stokAwal}
                onChange={(e) => set("stokAwal", e.target.value)}
                placeholder="0"
                className={inputCls(errors.stokAwal)}
              />
            </Field>

            {/* Minimum Stok */}
            <Field label="Minimum Stok" hint="Opsional — untuk alert restock">
              <Input
                type="number"
                min={0}
                value={form.minStok}
                onChange={(e) => set("minStok", e.target.value)}
                placeholder="0"
                className="h-10"
              />
            </Field>

            {/* Lokasi Baki */}
            <Field label="Lokasi Baki / Gudang" hint="Opsional">
              <Select value={form.bakiId} onValueChange={(v) => set("bakiId", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih baki..." />
                </SelectTrigger>
                <SelectContent>
                  {MASTER_BAKI.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.id} — {b.nama} ({b.area})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBaki && (
                <p className="text-xs text-muted-foreground mt-1">
                  📍 {selectedBaki.area}
                </p>
              )}
            </Field>

            {/* Status Barang */}
            <Field label="Status Barang" required>
              <Select
                value={form.statusBarang}
                onValueChange={(v) => set("statusBarang", v as "Aktif" | "Non-Aktif")}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
              {form.statusBarang === "Non-Aktif" && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Barang non-aktif tidak akan muncul pada transaksi baru.
                </p>
              )}
            </Field>
          </div>
        </SectionCard>

        {/* ── SECTION 5: Media / Foto ── */}
        <SectionCard title="Foto Barang" subtitle="Upload foto utama untuk ditampilkan di listing dan detail barang">
          {photoPreview ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border shadow-sm bg-muted shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Preview foto barang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">{photoFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {photoFile ? `${(photoFile.size / 1024).toFixed(0)} KB` : ""}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removePhoto}
                  className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600 w-fit"
                >
                  <IconTrash className="size-3.5 mr-1.5" />
                  Hapus Foto
                </Button>
                <label
                  htmlFor="photo-upload-replace"
                  className="cursor-pointer text-xs text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Ganti foto
                  <input
                    id="photo-upload-replace"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all cursor-pointer p-10 text-center"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <IconPhoto className="size-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Klik untuk upload foto</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  JPG, PNG, atau WEBP · Maks. 2 MB
                </p>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </SectionCard>

        {/* ── SECTION 6: Informasi Tambahan ── */}
        <SectionCard title="Informasi Tambahan" subtitle="Catatan internal, label unggulan, dan tanggal masuk">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Tanggal Masuk */}
            <Field label="Tanggal Masuk" hint="Opsional">
              <Input
                type="date"
                value={form.tanggalMasuk}
                onChange={(e) => set("tanggalMasuk", e.target.value)}
                className="h-10"
              />
            </Field>

            {/* Barang Unggulan */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">
                Barang Unggulan <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
              </Label>
              <button
                type="button"
                onClick={() => set("barangUnggulan", !form.barangUnggulan)}
                className={`flex items-center gap-3 h-10 px-3 rounded-md border text-sm transition-all ${
                  form.barangUnggulan
                    ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                    : "border-input text-muted-foreground hover:bg-muted/30"
                }`}
              >
                {form.barangUnggulan ? (
                  <IconStarFilled className="size-4 text-yellow-500" />
                ) : (
                  <IconStar className="size-4" />
                )}
                {form.barangUnggulan ? "Ditandai sebagai Unggulan" : "Tandai sebagai Unggulan"}
              </button>
            </div>

            {/* Catatan Internal */}
            <div className="sm:col-span-2">
              <Field label="Catatan Internal" hint="Opsional — tidak tampil di publik">
                <textarea
                  value={form.catatanInternal}
                  onChange={(e) => set("catatanInternal", e.target.value)}
                  placeholder="Catatan khusus untuk tim internal..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* ── Preview Summary ── */}
        {(form.namaBarang || form.kodeBarang) && (
          <div className="rounded-xl border bg-card/50 p-5 backdrop-blur-md dark:bg-zinc-900/30 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center border shrink-0 overflow-hidden">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <IconPhoto className="size-7 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {form.kodeBarang}
                </span>
                {form.statusBarang && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      form.statusBarang === "Aktif"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    }`}
                  >
                    {form.statusBarang}
                  </Badge>
                )}
                {form.barangUnggulan && (
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <IconStarFilled className="size-3 mr-1" />
                    Unggulan
                  </Badge>
                )}
              </div>
              <p className="font-semibold text-foreground truncate">
                {form.namaBarang || "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {MASTER_KATEGORI.find(k => k.id === form.kategoriId)?.nama && (
                  <span>{MASTER_KATEGORI.find(k => k.id === form.kategoriId)?.nama}</span>
                )}
                {selectedKadar && <span>{selectedKadar.nama}</span>}
                {form.berat && form.satuanId && (
                  <span>{form.berat} {MASTER_SATUAN.find(s => s.id === form.satuanId)?.simbol}</span>
                )}
                {form.hargaJual && (
                  <span className="font-medium text-foreground">
                    Rp {Number(form.hargaJual).toLocaleString("id-ID")}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconInfoCircle className="size-4 shrink-0" />
              <span>Preview ringkasan barang</span>
            </div>
          </div>
        )}

        {/* ── Bottom Action Bar ── */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t">
          <Button type="button" variant="outline" onClick={handleReset} className="h-10 gap-1.5">
            <IconRefresh className="size-4" />
            Reset
          </Button>
          <Link href="/dashboard/data-barang">
            <Button type="button" variant="outline" className="h-10 gap-1.5">
              <IconX className="size-4" />
              Batal
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSave(e, true)}
            className="h-10 gap-1.5"
          >
            <IconPlus className="size-4" />
            Simpan &amp; Tambah Lagi
          </Button>
          <Button
            type="submit"
            className="h-10 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <IconCheck className="size-4" />
            Simpan Barang
          </Button>
        </div>
      </form>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card/50 shadow-xs backdrop-blur-md dark:bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b bg-muted/30 dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-muted-foreground ml-1">({hint})</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
    </div>
  )
}

function inputCls(error?: string) {
  return `h-10 ${error ? "border-red-500 focus-visible:ring-red-500/30" : "focus-visible:ring-primary/50 focus-visible:border-primary"}`
}
