"use client"

import { useState, useMemo, useEffect } from "react"
import {
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconInfoCircle,
  IconChevronRight,
  IconCheck,
  IconAlertTriangle,
  IconArrowLeft,
  IconBox,
  IconExchange,
  IconHistory,
  IconDatabase,
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

// Types
interface Tray {
  id: string
  code: string
  name: string
  area: string
  description: string
  capacity: number
  status: "Aktif" | "Non-Aktif"
}

interface Item {
  id: string
  code: string
  name: string
  category: string
  weight: number
  purity: string
  stock: number
  bakiId: string | null
  dateAddedToBaki?: string
}

interface Mutation {
  id: string
  itemCode: string
  itemName: string
  fromTrayCode: string
  toTrayCode: string
  timestamp: string
  user: string
  notes: string
}

// Initial Mock Data
const INITIAL_TRAYS: Tray[] = [
  {
    id: "1",
    code: "BAKI-001",
    name: "Baki Cincin Premium",
    area: "Etalase Depan A",
    description: "Khusus untuk display cincin emas premium dan bermata berlian",
    capacity: 20,
    status: "Aktif",
  },
  {
    id: "2",
    code: "BAKI-002",
    name: "Baki Kalung Rantai",
    area: "Safe Deposit Box A",
    description: "Penyimpanan kalung rantai panjang dan tebal di brankas",
    capacity: 15,
    status: "Aktif",
  },
  {
    id: "3",
    code: "BAKI-003",
    name: "Baki Gelang Bangle",
    area: "Safe Deposit Box B",
    description: "Penyimpanan gelang model bangle / gelang kaku",
    capacity: 25,
    status: "Aktif",
  },
  {
    id: "4",
    code: "BAKI-004",
    name: "Baki Logam Mulia",
    area: "Brankas Utama",
    description: "Khusus penyimpanan emas batangan bersertifikat Antam / UBS",
    capacity: 50,
    status: "Aktif",
  },
  {
    id: "5",
    code: "BAKI-005",
    name: "Baki Anting Anak",
    area: "Etalase Belakang B",
    description: "Display anting emas kecil dan anting anak-anak",
    capacity: 30,
    status: "Non-Aktif",
  },
]

const INITIAL_ITEMS: Item[] = [
  {
    id: "item-1",
    code: "BRG-001",
    name: "Cincin Emas Solitaire 24K",
    category: "Cincin Emas",
    weight: 5.5,
    purity: "99.9%",
    stock: 5,
    bakiId: "BAKI-001",
    dateAddedToBaki: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "item-2",
    code: "BRG-002",
    name: "Cincin Emas Listring",
    category: "Cincin Emas",
    weight: 3.2,
    purity: "75%",
    stock: 4,
    bakiId: "BAKI-001",
    dateAddedToBaki: "2026-05-20T10:15:00.000Z",
  },
  {
    id: "item-3",
    code: "BRG-003",
    name: "Cincin Emas Pria Naga",
    category: "Cincin Emas",
    weight: 12.0,
    purity: "70%",
    stock: 2,
    bakiId: "BAKI-001",
    dateAddedToBaki: "2026-05-20T10:30:00.000Z",
  },
  {
    id: "item-4",
    code: "BRG-004",
    name: "Kalung Emas Italy Santa",
    category: "Kalung Emas",
    weight: 8.5,
    purity: "75%",
    stock: 3,
    bakiId: "BAKI-002",
    dateAddedToBaki: "2026-05-21T14:30:00.000Z",
  },
  {
    id: "item-5",
    code: "BRG-005",
    name: "Kalung Emas Putih Rose",
    category: "Kalung Emas",
    weight: 4.8,
    purity: "75%",
    stock: 6,
    bakiId: "BAKI-002",
    dateAddedToBaki: "2026-05-21T14:45:00.000Z",
  },
  {
    id: "item-6",
    code: "BRG-006",
    name: "Logam Mulia Antam 10g",
    category: "Logam Mulia",
    weight: 10.0,
    purity: "99.99%",
    stock: 10,
    bakiId: "BAKI-004",
    dateAddedToBaki: "2026-05-22T09:15:00.000Z",
  },
  {
    id: "item-7",
    code: "BRG-007",
    name: "Gelang Emas Serut",
    category: "Gelang Emas",
    weight: 6.2,
    purity: "75%",
    stock: 4,
    bakiId: null,
  },
  {
    id: "item-8",
    code: "BRG-008",
    name: "Anting Emas Giwang",
    category: "Anting Emas",
    weight: 1.5,
    purity: "70%",
    stock: 12,
    bakiId: null,
  },
]

const INITIAL_MUTATIONS: Mutation[] = [
  {
    id: "mut-1",
    itemCode: "BRG-001",
    itemName: "Cincin Emas Solitaire 24K",
    fromTrayCode: "TANPA LOKASI",
    toTrayCode: "BAKI-001",
    timestamp: "2026-05-20T10:00:00.000Z",
    user: "Admin Toko",
    notes: "Inisialisasi lokasi penempatan awal",
  },
  {
    id: "mut-2",
    itemCode: "BRG-004",
    itemName: "Kalung Emas Italy Santa",
    fromTrayCode: "TANPA LOKASI",
    toTrayCode: "BAKI-002",
    timestamp: "2026-05-21T14:30:00.000Z",
    user: "Admin Toko",
    notes: "Pindah dari gudang transit",
  },
  {
    id: "mut-3",
    itemCode: "BRG-006",
    itemName: "Logam Mulia Antam 10g",
    fromTrayCode: "TANPA LOKASI",
    toTrayCode: "BAKI-004",
    timestamp: "2026-05-22T09:15:00.000Z",
    user: "Kasir-01",
    notes: "Barang restock baru masuk baki",
  },
]

export default function GudangPage() {
  const [trays, setTrays] = useState<Tray[]>(INITIAL_TRAYS)
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [mutations, setMutations] = useState<Mutation[]>(INITIAL_MUTATIONS)

  const [activeTab, setActiveTab] = useState<"baki" | "orphaned" | "mutations">("baki")
  const [selectedTrayId, setSelectedTrayId] = useState<string | null>(null)
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [filterArea, setFilterArea] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterOccupancy, setFilterOccupancy] = useState("all")

  // Sheet drawer state for Tray form
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTray, setEditingTray] = useState<Tray | null>(null)
  const [formCode, setFormCode] = useState("")
  const [formName, setFormName] = useState("")
  const [formArea, setFormArea] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formCapacity, setFormCapacity] = useState<number>(30)
  const [formStatus, setFormStatus] = useState<"Aktif" | "Non-Aktif">("Aktif")

  // Delete Tray Confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [trayToDelete, setTrayToDelete] = useState<Tray | null>(null)

  // Move Item modal state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [movingItem, setMovingItem] = useState<Item | null>(null)
  const [targetTrayCode, setTargetTrayCode] = useState("")
  const [mutationNotes, setMutationNotes] = useState("")

  // Quick Assign state inside tray detail
  const [quickAssignItemId, setQuickAssignItemId] = useState("")

  // Sync state from localStorage
  useEffect(() => {
    const savedTrays = localStorage.getItem("gold_dashboard_trays")
    const savedItems = localStorage.getItem("gold_dashboard_items")
    const savedMutations = localStorage.getItem("gold_dashboard_mutations")

    if (savedTrays) setTrays(JSON.parse(savedTrays))
    if (savedItems) setItems(JSON.parse(savedItems))
    if (savedMutations) setMutations(JSON.parse(savedMutations))
  }, [])

  // State update helpers with persistence
  const updateTrays = (newTrays: Tray[]) => {
    setTrays(newTrays)
    localStorage.setItem("gold_dashboard_trays", JSON.stringify(newTrays))
  }

  const updateItems = (newItems: Item[]) => {
    setItems(newItems)
    localStorage.setItem("gold_dashboard_items", JSON.stringify(newItems))
  }

  const updateMutations = (newMutations: Mutation[]) => {
    setMutations(newMutations)
    localStorage.setItem("gold_dashboard_mutations", JSON.stringify(newMutations))
  }

  // Calculate items sum in a baki
  const getTrayUsage = (bakiCode: string) => {
    return items
      .filter((i) => i.bakiId === bakiCode)
      .reduce((sum, item) => sum + item.stock, 0)
  }

  // Summary counts
  const totalTrays = trays.length
  const occupiedTrays = trays.filter((t) => getTrayUsage(t.code) > 0).length
  const emptyTrays = trays.filter((t) => getTrayUsage(t.code) === 0).length
  const orphanedItemsCount = items.filter((i) => i.bakiId === null).length
  const orphanedItemsQty = items.filter((i) => i.bakiId === null).reduce((sum, item) => sum + item.stock, 0)

  // Areas list for filter dropdown
  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(trays.map((t) => t.area)))
  }, [trays])

  // Filtered master trays
  const filteredTrays = useMemo(() => {
    return trays.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesArea = filterArea === "all" || t.area === filterArea
      const matchesStatus = filterStatus === "all" || t.status === filterStatus
      
      const usage = getTrayUsage(t.code)
      let matchesOccupancy = true
      if (filterOccupancy === "empty") {
        matchesOccupancy = usage === 0
      } else if (filterOccupancy === "filled") {
        matchesOccupancy = usage > 0
      } else if (filterOccupancy === "full") {
        matchesOccupancy = usage >= t.capacity
      }

      return matchesSearch && matchesArea && matchesStatus && matchesOccupancy
    })
  }, [trays, items, searchQuery, filterArea, filterStatus, filterOccupancy])

  // Selected tray object
  const selectedTray = useMemo(() => {
    return trays.find((t) => t.id === selectedTrayId) || null
  }, [trays, selectedTrayId])

  // Items currently inside selected tray
  const selectedTrayItems = useMemo(() => {
    if (!selectedTray) return []
    return items.filter((i) => i.bakiId === selectedTray.code)
  }, [items, selectedTray])

  // Selected tray local history
  const selectedTrayMutations = useMemo(() => {
    if (!selectedTray) return []
    return mutations.filter(
      (m) => m.fromTrayCode === selectedTray.code || m.toTrayCode === selectedTray.code
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [mutations, selectedTray])

  // Open add sheet
  const handleAddTrayClick = () => {
    setEditingTray(null)
    setFormCode(`BAKI-00${trays.length + 1}`)
    setFormName("")
    setFormArea("")
    setFormDescription("")
    setFormCapacity(30)
    setFormStatus("Aktif")
    setIsSheetOpen(true)
  }

  // Open edit sheet
  const handleEditTrayClick = (tray: Tray, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click selecting details
    setEditingTray(tray)
    setFormCode(tray.code)
    setFormName(tray.name)
    setFormArea(tray.area)
    setFormDescription(tray.description)
    setFormCapacity(tray.capacity)
    setFormStatus(tray.status)
    setIsSheetOpen(true)
  }

  // Save Tray
  const handleSaveTray = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formCode.trim() || !formName.trim() || !formArea.trim() || formCapacity <= 0) {
      toast.error("Semua field wajib diisi dengan benar!")
      return
    }

    if (!editingTray) {
      // Check duplicate code
      const isDuplicate = trays.some((t) => t.code.toLowerCase() === formCode.toLowerCase())
      if (isDuplicate) {
        toast.error(`Kode Baki "${formCode}" sudah digunakan!`)
        return
      }

      const newTray: Tray = {
        id: Date.now().toString(),
        code: formCode,
        name: formName,
        area: formArea,
        description: formDescription,
        capacity: Number(formCapacity),
        status: formStatus,
      }
      updateTrays([...trays, newTray])
      toast.success(`Baki "${formName}" berhasil ditambahkan.`)
    } else {
      updateTrays(
        trays.map((t) =>
          t.id === editingTray.id
            ? {
                ...t,
                name: formName,
                area: formArea,
                description: formDescription,
                capacity: Number(formCapacity),
                status: formStatus,
              }
            : t
        )
      )
      toast.success(`Baki "${formName}" berhasil diperbarui.`)
    }
    setIsSheetOpen(false)
  }

  // Open delete confirm
  const handleDeleteTrayClick = (tray: Tray, e: React.MouseEvent) => {
    e.stopPropagation()
    // Business rule check: tray cannot contain items
    const currentUsage = getTrayUsage(tray.code)
    if (currentUsage > 0) {
      toast.error(`Baki "${tray.name}" tidak dapat dihapus karena masih berisi ${currentUsage} barang!`, {
        icon: <IconAlertTriangle className="text-red-500" />,
        duration: 4000,
      })
      return
    }
    setTrayToDelete(tray)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete
  const handleConfirmDeleteTray = () => {
    if (trayToDelete) {
      updateTrays(trays.filter((t) => t.id !== trayToDelete.id))
      toast.success(`Baki "${trayToDelete.name}" berhasil dihapus.`)
      setIsDeleteModalOpen(false)
      setTrayToDelete(null)
    }
  }

  // Open move modal
  const handleOpenMoveModal = (item: Item, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setMovingItem(item)
    setTargetTrayCode(item.bakiId || "")
    setMutationNotes("")
    setIsMoveModalOpen(true)
  }

  // Confirm Move Item
  const handleConfirmMoveItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!movingItem) return

    const sourceCode = movingItem.bakiId || "TANPA LOKASI"
    const targetCode = targetTrayCode || "TANPA LOKASI"

    if (sourceCode === targetCode) {
      toast.error("Lokasi tujuan harus berbeda dari lokasi saat ini!")
      return
    }

    if (targetCode !== "TANPA LOKASI") {
      const targetTray = trays.find((t) => t.code === targetCode)
      if (!targetTray) {
        toast.error("Baki tujuan tidak ditemukan.")
        return
      }
      if (targetTray.status === "Non-Aktif") {
        toast.error("Baki tujuan tidak aktif!")
        return
      }

      // Check capacity
      const targetCurrentUsage = getTrayUsage(targetCode)
      if (targetCurrentUsage + movingItem.stock > targetTray.capacity) {
        toast.error(
          `Kapasitas Baki "${targetTray.name}" tidak mencukupi! (Kapasitas: ${targetTray.capacity}, Terisi: ${targetCurrentUsage}, Ingin Memasukkan: ${movingItem.stock})`
        )
        return
      }
    }

    // Update item location
    updateItems(
      items.map((i) =>
        i.id === movingItem.id
          ? {
              ...i,
              bakiId: targetCode === "TANPA LOKASI" ? null : targetCode,
              dateAddedToBaki: targetCode === "TANPA LOKASI" ? undefined : new Date().toISOString(),
            }
          : i
      )
    )

    // Add mutation history log
    const newMutation: Mutation = {
      id: Date.now().toString(),
      itemCode: movingItem.code,
      itemName: movingItem.name,
      fromTrayCode: sourceCode,
      toTrayCode: targetCode,
      timestamp: new Date().toISOString(),
      user: "Admin Toko",
      notes: mutationNotes.trim() || "Perpindahan lokasi penyimpanan barang",
    }
    updateMutations([...mutations, newMutation])

    toast.success(`Barang "${movingItem.name}" berhasil dipindahkan ke ${targetCode}.`)
    setIsMoveModalOpen(false)
    setMovingItem(null)
  }

  // Quick placement inside detail view
  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTray || !quickAssignItemId) return

    const itemToAssign = items.find((i) => i.id === quickAssignItemId)
    if (!itemToAssign) return

    const currentUsage = getTrayUsage(selectedTray.code)
    if (currentUsage + itemToAssign.stock > selectedTray.capacity) {
      toast.error(
        `Kapasitas Baki "${selectedTray.name}" tidak mencukupi! (Kapasitas: ${selectedTray.capacity}, Terisi: ${currentUsage}, Ingin Memasukkan: ${itemToAssign.stock})`
      )
      return
    }

    // Update item
    updateItems(
      items.map((i) =>
        i.id === itemToAssign.id
          ? {
              ...i,
              bakiId: selectedTray.code,
              dateAddedToBaki: new Date().toISOString(),
            }
          : i
      )
    )

    // Log mutation
    const newMutation: Mutation = {
      id: Date.now().toString(),
      itemCode: itemToAssign.code,
      itemName: itemToAssign.name,
      fromTrayCode: "TANPA LOKASI",
      toTrayCode: selectedTray.code,
      timestamp: new Date().toISOString(),
      user: "Admin Toko",
      notes: "Penempatan barang ke baki via menu detail",
    }
    updateMutations([...mutations, newMutation])

    toast.success(`Barang "${itemToAssign.name}" dimasukkan ke ${selectedTray.code}.`)
    setQuickAssignItemId("")
  }

  // Format date helper
  const formatDate = (isoString: string) => {
    if (!isoString) return "-"
    const d = new Date(isoString)
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  }

  // Available trays for selection list (in move modal)
  const availableTraysForMove = useMemo(() => {
    return trays.filter((t) => t.status === "Aktif")
  }, [trays])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          {selectedTrayId ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span>Persediaan Emas</span>
              <IconChevronRight className="size-3" />
              <button onClick={() => setSelectedTrayId(null)} className="hover:text-foreground">
                Gudang
              </button>
              <IconChevronRight className="size-3" />
              <span className="text-foreground font-medium">{selectedTray?.code}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span>Persediaan Emas</span>
              <IconChevronRight className="size-3" />
              <span className="text-foreground font-medium">Gudang</span>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {selectedTrayId ? `Detail Baki: ${selectedTray?.code}` : "Gudang & Baki Penyimpanan"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedTrayId
              ? `Kelola daftar isi barang dan histrori mutasi pada baki "${selectedTray?.name}".`
              : "Pengelolaan lokasi penyimpanan barang emas berdasarkan baki fisik."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTrayId ? (
            <Button
              variant="outline"
              onClick={() => setSelectedTrayId(null)}
              className="w-full md:w-auto h-10"
            >
              <IconArrowLeft className="size-4 mr-1" />
              Kembali
            </Button>
          ) : (
            <>
              {activeTab === "baki" && (
                <Button
                  onClick={handleAddTrayClick}
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md transition-all"
                >
                  <IconPlus className="size-4 mr-1" />
                  Tambah Baki
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Baki Sub-view */}
      {selectedTrayId && selectedTray ? (
        <div className="flex flex-col gap-6">
          {/* Detailed Tray Info Card */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-xl border bg-card/60 p-6 shadow-sm backdrop-blur-md dark:bg-zinc-900/40">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                      {selectedTray.code}
                    </span>
                    <Badge
                      variant="outline"
                      className={`rounded-full border text-xs px-2.5 py-0.5 font-medium ${
                        selectedTray.status === "Aktif"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      }`}
                    >
                      {selectedTray.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mt-2 text-foreground">{selectedTray.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTray.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground uppercase font-semibold block">Lokasi Area</span>
                  <span className="text-sm font-semibold text-foreground">{selectedTray.area}</span>
                </div>
              </div>

              {/* Tray capacity progress bar */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Persentase Kapasitas</span>
                  <span className="font-semibold text-foreground">
                    {getTrayUsage(selectedTray.code)} / {selectedTray.capacity} Pcs ({Math.round((getTrayUsage(selectedTray.code) / selectedTray.capacity) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-muted dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (getTrayUsage(selectedTray.code) / selectedTray.capacity) * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      getTrayUsage(selectedTray.code) >= selectedTray.capacity
                        ? "bg-red-500 animate-pulse"
                        : getTrayUsage(selectedTray.code) >= selectedTray.capacity * 0.8
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Quick Assign Form */}
            <div className="rounded-xl border bg-card/40 p-6 shadow-sm backdrop-blur-md dark:bg-zinc-900/20 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Masukkan Barang ke Baki</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Tempatkan barang yang belum memiliki lokasi ke dalam baki ini secara langsung.
                </p>

                <form onSubmit={handleQuickAssign} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quick-item-select" className="text-xs font-medium text-foreground">
                      Pilih Barang
                    </Label>
                    <Select
                      value={quickAssignItemId}
                      onValueChange={setQuickAssignItemId}
                    >
                      <SelectTrigger id="quick-item-select" className="w-full">
                        <SelectValue placeholder="Pilih barang tanpa baki" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.filter(i => i.bakiId === null).length > 0 ? (
                          items
                            .filter((i) => i.bakiId === null)
                            .map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name} ({i.stock} Pcs - {i.weight}g)
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="_empty" disabled>
                            Tidak ada barang tanpa baki
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={!quickAssignItemId || quickAssignItemId === "_empty" || getTrayUsage(selectedTray.code) >= selectedTray.capacity}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <IconPlus className="size-4 mr-1" />
                    Masukkan ke Baki
                  </Button>
                </form>
              </div>

              {getTrayUsage(selectedTray.code) >= selectedTray.capacity && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
                  <IconInfoCircle className="size-5 shrink-0" />
                  <span>Baki ini telah penuh! Kosongkan isi terlebih dahulu sebelum memuat barang baru.</span>
                </div>
              )}
            </div>
          </div>

          {/* Sub-view Tabs */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* List Barang inside Baki (2 Columns) */}
            <div className="md:col-span-2 overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
              <div className="p-4 border-b bg-muted/30 dark:bg-zinc-900/50 flex justify-between items-center">
                <h4 className="font-bold text-foreground">Daftar Barang Tersimpan</h4>
                <Badge variant="secondary" className="font-mono">
                  {selectedTrayItems.length} Jenis Barang
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Kode</TableHead>
                      <TableHead className="font-semibold text-foreground">Nama Barang</TableHead>
                      <TableHead className="font-semibold text-foreground">Kategori</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Berat / Kadar</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Stok</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTrayItems.length > 0 ? (
                      selectedTrayItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/20">
                          <TableCell className="font-mono text-xs font-bold text-foreground">
                            {item.code}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                          <TableCell className="text-right text-xs">
                            <span className="font-semibold text-foreground">{item.weight}g</span>
                            <span className="text-muted-foreground block text-[10px]">{item.purity}</span>
                          </TableCell>
                          <TableCell className="text-center font-bold text-foreground">{item.stock}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenMoveModal(item)}
                                className="h-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 flex items-center gap-1"
                              >
                                <IconExchange className="size-3.5" />
                                Pindahkan
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <IconBox className="size-8 text-muted-foreground/30" />
                            <p>Tidak ada barang di baki ini.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tray history log (1 Column) */}
            <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20 flex flex-col">
              <div className="p-4 border-b bg-muted/30 dark:bg-zinc-900/50 flex justify-between items-center">
                <h4 className="font-bold text-foreground">Log Mutasi Baki</h4>
                <IconHistory className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 p-4 overflow-y-auto max-h-[300px] space-y-4">
                {selectedTrayMutations.length > 0 ? (
                  selectedTrayMutations.map((mut) => (
                    <div key={mut.id} className="relative pl-4 border-l-2 border-primary/20 text-xs">
                      <div className="absolute left-[-5px] top-1 size-2 rounded-full bg-primary" />
                      <div className="flex justify-between font-semibold text-foreground">
                        <span>{mut.itemName}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(mut.timestamp).split(" ")[0]}</span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {mut.fromTrayCode} &rarr; {mut.toTrayCode}
                      </p>
                      <p className="text-[11px] text-foreground mt-1 italic">&ldquo;{mut.notes}&rdquo;</p>
                      <span className="text-[9px] text-muted-foreground mt-1 block">Oleh: {mut.user}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10 gap-2">
                    <IconHistory className="size-6 text-muted-foreground/30" />
                    <p className="text-xs">Belum ada riwayat aktivitas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Master Views (Tray List, Orphaned, mutations) */
        <div className="flex flex-col gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Baki */}
            <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all dark:bg-zinc-900/40">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10 blur-xl"></div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500 dark:bg-blue-500/20">
                  <IconDatabase className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Baki</p>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">{totalTrays} <span className="text-xs font-normal text-muted-foreground">Unit</span></h3>
                </div>
              </div>
            </div>

            {/* Baki Terisi */}
            <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all dark:bg-zinc-900/40">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl"></div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500 dark:bg-emerald-500/20">
                  <IconBox className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Baki Terisi</p>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">{occupiedTrays} <span className="text-xs font-normal text-muted-foreground">/ {totalTrays} Unit</span></h3>
                </div>
              </div>
            </div>

            {/* Baki Kosong */}
            <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all dark:bg-zinc-900/40">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-amber-500/10 blur-xl"></div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500 dark:bg-amber-500/20">
                  <IconInfoCircle className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Baki Kosong</p>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">{emptyTrays} <span className="text-xs font-normal text-muted-foreground">Unit</span></h3>
                </div>
              </div>
            </div>

            {/* Barang Tanpa Baki */}
            <div className="relative overflow-hidden rounded-xl border bg-card/60 p-5 shadow-xs backdrop-blur-md hover:shadow-sm transition-all dark:bg-zinc-900/40">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-red-500/10 blur-xl"></div>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-red-500/10 p-2.5 text-red-500 dark:bg-red-500/20">
                  <IconAlertTriangle className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tanpa Lokasi</p>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">{orphanedItemsCount} <span className="text-xs font-normal text-muted-foreground">Barang ({orphanedItemsQty} Pcs)</span></h3>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b pb-px">
            <button
              onClick={() => {
                setActiveTab("baki")
                setSelectedTrayId(null)
              }}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === "baki"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Master Baki ({totalTrays})
            </button>
            <button
              onClick={() => {
                setActiveTab("orphaned")
                setSelectedTrayId(null)
              }}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "orphaned"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Barang Tanpa Baki
              {orphanedItemsCount > 0 && (
                <Badge variant="destructive" className="size-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                  {orphanedItemsCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("mutations")
                setSelectedTrayId(null)
              }}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === "mutations"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Riwayat Mutasi ({mutations.length})
            </button>
          </div>

          {/* Tab 1: Master Baki list */}
          {activeTab === "baki" && (
            <>
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col gap-4 rounded-xl border bg-card/30 p-4 shadow-xs backdrop-blur-xs dark:bg-zinc-950/20 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kode baki, nama baki, atau deskripsi..."
                    className="pl-9 h-10 border-muted bg-background/50 focus-visible:ring-primary/50 dark:bg-zinc-900/50"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Area */}
                  <Select value={filterArea} onValueChange={setFilterArea}>
                    <SelectTrigger className="h-10 w-[150px]">
                      <SelectValue placeholder="Semua Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Area</SelectItem>
                      {uniqueAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filter Status */}
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-10 w-[140px]">
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Keterisian */}
                  <Select value={filterOccupancy} onValueChange={setFilterOccupancy}>
                    <SelectTrigger className="h-10 w-[140px]">
                      <SelectValue placeholder="Keterisian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Keterisian</SelectItem>
                      <SelectItem value="empty">Kosong</SelectItem>
                      <SelectItem value="filled">Terisi</SelectItem>
                      <SelectItem value="full">Penuh</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || filterArea !== "all" || filterStatus !== "all" || filterOccupancy !== "all") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery("")
                        setFilterArea("all")
                        setFilterStatus("all")
                        setFilterOccupancy("all")
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground h-10"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
                      <TableRow>
                        <TableHead className="w-[120px] font-semibold text-foreground">Kode</TableHead>
                        <TableHead className="min-w-[160px] font-semibold text-foreground">Nama Baki</TableHead>
                        <TableHead className="min-w-[150px] font-semibold text-foreground">Area Lokasi</TableHead>
                        <TableHead className="w-[140px] font-semibold text-foreground">Kapasitas</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">Status</TableHead>
                        <TableHead className="text-center w-[150px] font-semibold text-foreground">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrays.length > 0 ? (
                        filteredTrays.map((tray) => {
                          const usage = getTrayUsage(tray.code)
                          const pct = Math.round((usage / tray.capacity) * 100)
                          
                          return (
                            <TableRow
                              key={tray.id}
                              onClick={() => setSelectedTrayId(tray.id)}
                              className="hover:bg-muted/30 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors duration-150"
                            >
                              <TableCell className="font-mono text-xs font-bold text-foreground">
                                {tray.code}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-foreground">{tray.name}</div>
                                <div className="text-xs text-muted-foreground max-w-[240px] truncate">{tray.description || "-"}</div>
                              </TableCell>
                              <TableCell className="text-sm text-foreground">{tray.area}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-xs flex justify-between">
                                    <span className="font-semibold text-foreground">{usage}</span>
                                    <span className="text-muted-foreground">/ {tray.capacity} Pcs</span>
                                  </div>
                                  <div className="w-full bg-muted dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      style={{ width: `${Math.min(100, pct)}%` }}
                                      className={`h-full rounded-full ${
                                        usage >= tray.capacity
                                          ? "bg-red-500"
                                          : usage >= tray.capacity * 0.8
                                          ? "bg-amber-500"
                                          : "bg-primary"
                                      }`}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${
                                    tray.status === "Aktif"
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                      : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${
                                      tray.status === "Aktif" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                                    }`}
                                  />
                                  {tray.status}
                                </Badge>
                              </TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1">
                                  {/* View detail button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTrayId(tray.id)}
                                    className="h-8 text-xs text-muted-foreground hover:text-primary"
                                  >
                                    Detail
                                  </Button>
                                  {/* Edit button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleEditTrayClick(tray, e)}
                                    title="Ubah Baki"
                                    className="size-8 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary dark:hover:bg-primary/20"
                                  >
                                    <IconPencil className="size-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  {/* Delete button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDeleteTrayClick(tray, e)}
                                    title="Hapus Baki"
                                    className="size-8 rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-500 focus-visible:ring-red-500 dark:hover:bg-red-500/20"
                                  >
                                    <IconTrash className="size-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <IconInfoCircle className="size-8 text-muted-foreground/50" />
                              <p>Baki tidak ditemukan.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Orphaned items list */}
          {activeTab === "orphaned" && (
            <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
              <div className="p-4 border-b bg-muted/30 dark:bg-zinc-900/50">
                <h4 className="font-bold text-foreground">Barang Belum Masuk Baki</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daftar produk emas yang belum ditentukan baki fisiknya. Hubungkan produk ke baki agar stok tersusun rapi.
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Kode Barang</TableHead>
                      <TableHead className="font-semibold text-foreground">Nama Barang</TableHead>
                      <TableHead className="font-semibold text-foreground">Kategori</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Berat / Kadar</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Jumlah Stok</TableHead>
                      <TableHead className="text-center font-semibold text-foreground">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.filter((i) => i.bakiId === null).length > 0 ? (
                      items
                        .filter((i) => i.bakiId === null)
                        .map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/20">
                            <TableCell className="font-mono text-xs font-bold text-foreground">
                              {item.code}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                            <TableCell className="text-right text-xs">
                              <span className="font-semibold text-foreground">{item.weight}g</span>
                              <span className="text-muted-foreground block text-[10px]">{item.purity}</span>
                            </TableCell>
                            <TableCell className="text-center font-bold text-foreground">{item.stock}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenMoveModal(item)}
                                  className="h-8 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 flex items-center gap-1"
                                >
                                  <IconPlus className="size-3.5" />
                                  Tentukan Baki
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <IconCheck className="size-8 text-emerald-500/80" />
                            <p>Semua barang telah teratur di dalam baki penyimpanan.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Tab 3: Global mutations list */}
          {activeTab === "mutations" && (
            <div className="overflow-hidden rounded-xl border bg-card/40 shadow-xs backdrop-blur-md dark:bg-zinc-900/20">
              <div className="p-4 border-b bg-muted/30 dark:bg-zinc-900/50">
                <h4 className="font-bold text-foreground">Riwayat Pergerakan Barang (Mutasi)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Log pencatatan perpindahan lokasi penyimpanan barang antar baki secara riil.
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50 dark:bg-zinc-900/60">
                    <TableRow>
                      <TableHead className="font-semibold text-foreground">Tanggal & Waktu</TableHead>
                      <TableHead className="font-semibold text-foreground">Barang</TableHead>
                      <TableHead className="font-semibold text-foreground">Dari Baki</TableHead>
                      <TableHead className="font-semibold text-foreground">Ke Baki</TableHead>
                      <TableHead className="font-semibold text-foreground">Catatan</TableHead>
                      <TableHead className="font-semibold text-foreground">Petugas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mutations.length > 0 ? (
                      mutations
                        .slice()
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((mut) => (
                          <TableRow key={mut.id} className="hover:bg-muted/10">
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(mut.timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">{mut.itemName}</div>
                              <span className="font-mono text-[10px] text-muted-foreground">{mut.itemCode}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {mut.fromTrayCode}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs bg-primary/10 border-primary/20 text-primary">
                                {mut.toTrayCode}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-foreground italic">&ldquo;{mut.notes}&rdquo;</TableCell>
                            <TableCell className="text-xs text-muted-foreground font-semibold">{mut.user}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <IconHistory className="size-8 text-muted-foreground/30" />
                            <p>Belum ada riwayat aktivitas perpindahan lokasi.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-out Sheet (Add / Edit Baki Form) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l bg-background shadow-xl flex flex-col gap-6">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-bold text-foreground">
              {editingTray ? "Ubah Baki" : "Tambah Baki Baru"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {editingTray
                ? "Ubah data baki penyimpanan yang terdaftar. Klik simpan jika sudah sesuai."
                : "Masukkan detail data baki penyimpanan emas baru di bawah ini."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveTray} className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Code Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-code" className="text-sm font-medium text-foreground">
                  Kode Baki <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tray-code"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Contoh: BAKI-001"
                  required
                  disabled={!!editingTray}
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary disabled:opacity-75"
                />
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-name" className="text-sm font-medium text-foreground">
                  Nama Baki <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tray-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Baki Cincin Berlian"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Area Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-area" className="text-sm font-medium text-foreground">
                  Lokasi Area Baki <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tray-area"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  placeholder="Contoh: Etalase Depan A, Brankas Utama"
                  required
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Capacity Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-capacity" className="text-sm font-medium text-foreground">
                  Kapasitas Maksimum (Pcs) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tray-capacity"
                  type="number"
                  min={1}
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(Number(e.target.value))}
                  placeholder="Contoh: 30"
                  required
                  className="h-10 focus-visible:ring-primary/50"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-desc" className="text-sm font-medium text-foreground">
                  Deskripsi / Catatan Baki
                </Label>
                <textarea
                  id="tray-desc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tambahkan detail catatan fisik mengenai baki ini..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Status Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tray-status" className="text-sm font-medium text-foreground">
                  Status Baki <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formStatus}
                  onValueChange={(val: "Aktif" | "Non-Aktif") => setFormStatus(val)}
                >
                  <SelectTrigger id="tray-status" className="h-10">
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

      {/* Delete Baki Confirmation Dialog Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-200">
          <div className="w-full max-w-md scale-100 rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="rounded-full bg-red-500/10 p-2 text-red-600 dark:bg-red-500/20">
                <IconAlertTriangle className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Hapus Baki Penyimpanan</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus baki penyimpanan{" "}
              <strong className="text-foreground">
                &ldquo;{trayToDelete?.name}&rdquo; ({trayToDelete?.code})
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
                  setTrayToDelete(null)
                }}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteTray}
                className="w-full sm:w-auto"
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Move / Transfer Item Modal Dialog */}
      {isMoveModalOpen && movingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-200">
          <div className="w-full max-w-md scale-100 rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-primary mb-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary dark:bg-primary/20">
                <IconExchange className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Tentukan / Pindahkan Baki</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Posisikan barang <strong className="text-foreground">{movingItem.name}</strong> ({movingItem.stock} Pcs) ke baki yang sesuai. Kapasitas baki tujuan akan divalidasi.
            </p>

            <form onSubmit={handleConfirmMoveItem} className="space-y-4">
              {/* Selected Target Tray Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="move-target-tray" className="text-xs font-semibold text-foreground">
                  Pilih Baki Tujuan
                </Label>
                <Select
                  value={targetTrayCode}
                  onValueChange={setTargetTrayCode}
                >
                  <SelectTrigger id="move-target-tray" className="w-full">
                    <SelectValue placeholder="Pilih baki penerima" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TANPA LOKASI">Keluarkan dari Baki (Jadikan Tanpa Lokasi)</SelectItem>
                    {availableTraysForMove.map((t) => {
                      const usage = getTrayUsage(t.code)
                      const isFull = usage + movingItem.stock > t.capacity
                      
                      return (
                        <SelectItem
                          key={t.id}
                          value={t.code}
                          disabled={isFull}
                        >
                          {t.code} - {t.name} ({usage} / {t.capacity} Pcs) {isFull ? "[PENUH]" : ""}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <Label htmlFor="move-notes" className="text-xs font-semibold text-foreground">
                  Catatan Mutasi
                </Label>
                <Input
                  id="move-notes"
                  value={mutationNotes}
                  onChange={(e) => setMutationNotes(e.target.value)}
                  placeholder="Contoh: Display di rak depan, restocking baki, dsb"
                  className="h-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsMoveModalOpen(false)
                    setMovingItem(null)
                  }}
                  className="w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Konfirmasi Pindah
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
