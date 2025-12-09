"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Subscription = {
  id: string
  email: string
  plan: string
  amount: number
  payment_method: string
  crypto_currency?: string
  crypto_network?: string
  order_number: string
  status: string
  subscription_start_date: string
  subscription_end_date: string
  created_at: string
}

type SupportRequest = {
  id: string
  email: string
  objet: string
  criticite: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_session")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsCheckingAuth(false)
    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [subsRes, supportRes] = await Promise.all([
        fetch("/api/admin/subscriptions"),
        fetch("/api/admin/support-requests"),
      ])

      if (subsRes.ok) {
        const subsData = await subsRes.json()
        setSubscriptions(subsData.subscriptions || [])
      }

      if (supportRes.ok) {
        const supportData = await supportRes.json()
        setSupportRequests(supportData.requests || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.order_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    const matchesPlan = planFilter === "all" || sub.plan === planFilter

    const createdDate = new Date(sub.created_at)
    const matchesStartDate = !startDate || createdDate >= new Date(startDate)
    const matchesEndDate = !endDate || createdDate <= new Date(endDate)

    return matchesSearch && matchesStatus && matchesPlan && matchesStartDate && matchesEndDate
  })

  const filteredSupportRequests = supportRequests.filter((req) => {
    const matchesSearch =
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.objet.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedSubscription) return

    setUpdatingStatus(true)
    try {
      const response = await fetch("/api/update-subscription-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedSubscription.email,
          status: newStatus,
        }),
      })

      if (response.ok) {
        await fetchData()
        setIsDialogOpen(false)
        setSelectedSubscription(null)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSupportStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/update-support-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status: newStatus }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error updating support status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
      active: { variant: "default", label: "Actif" },
      pending: { variant: "secondary", label: "En attente" },
      en_cours_de_traitement: { variant: "outline", label: "En traitement" },
      expired: { variant: "destructive", label: "Expiré" },
    }

    const config = variants[status] || { variant: "outline", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getSupportStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
      nouveau: { variant: "secondary", label: "Nouveau" },
      en_cours: { variant: "outline", label: "En cours" },
      resolu: { variant: "default", label: "Résolu" },
      ferme: { variant: "destructive", label: "Fermé" },
    }

    const config = variants[status] || { variant: "outline", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCriticiteBadge = (criticite: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
      faible: { variant: "secondary", label: "Faible" },
      moyenne: { variant: "outline", label: "Moyenne" },
      haute: { variant: "default", label: "Haute" },
      urgente: { variant: "destructive", label: "Urgente" },
    }

    const config = variants[criticite] || { variant: "outline", label: criticite }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
    pendingSubscriptions: subscriptions.filter((s) => s.status === "pending" || s.status === "en_cours_de_traitement")
      .length,
    totalRevenue: subscriptions.reduce((sum, s) => sum + s.amount, 0),
    newSupportRequests: supportRequests.filter((r) => r.status === "nouveau").length,
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPlanFilter("all")
    setStartDate("")
    setEndDate("")
  }

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-1">Gestion des utilisateurs et réclamations</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalRevenue.toFixed(2)} MAD</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.newSupportRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscriptions" className="gap-2">
              <Users className="h-4 w-4" />
              Abonnements
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <Mail className="h-4 w-4" />
              Support ({stats.newSupportRequests})
            </TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
                <CardDescription>Rechercher et filtrer les abonnements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Email ou commande..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="en_cours_de_traitement">En traitement</SelectItem>
                        <SelectItem value="expired">Expiré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="semestre">6 mois</SelectItem>
                        <SelectItem value="annuel">1 an</SelectItem>
                        <SelectItem value="2ans">2 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date début</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Date fin</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={resetFilters} variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Réinitialiser
                  </Button>
                  <div className="text-sm text-muted-foreground flex items-center">
                    {filteredSubscriptions.length} résultat(s) sur {subscriptions.length}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liste des abonnements</CardTitle>
                <CardDescription>Gérer tous les abonnements clients</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Chargement...</div>
                ) : filteredSubscriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucun abonnement trouvé</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date création</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {sub.plan === "semestre" ? "6 mois" : sub.plan === "annuel" ? "1 an" : "2 ans"}
                            </Badge>
                          </TableCell>
                          <TableCell>{sub.amount} MAD</TableCell>
                          <TableCell className="capitalize">
                            {console.log("[v0] Payment method for", sub.email, ":", sub.payment_method)}
                            {sub.payment_method === "crypto"
                              ? `${sub.crypto_currency}`
                              : sub.payment_method === "cash"
                                ? "Espèce"
                                : "Carte"}
                          </TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>{new Date(sub.created_at).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(sub)
                                setIsDialogOpen(true)
                              }}
                            >
                              Modifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Réclamations support</CardTitle>
                <CardDescription>Gérer toutes les demandes de support client</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Chargement...</div>
                ) : filteredSupportRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucune réclamation trouvée</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Objet</TableHead>
                        <TableHead>Criticité</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSupportRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.email}</TableCell>
                          <TableCell>{req.objet}</TableCell>
                          <TableCell>{getCriticiteBadge(req.criticite)}</TableCell>
                          <TableCell className="max-w-xs truncate">{req.message}</TableCell>
                          <TableCell>{getSupportStatusBadge(req.status)}</TableCell>
                          <TableCell>{new Date(req.created_at).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <Select
                              value={req.status}
                              onValueChange={(value) => handleSupportStatusChange(req.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nouveau">Nouveau</SelectItem>
                                <SelectItem value="en_cours">En cours</SelectItem>
                                <SelectItem value="resolu">Résolu</SelectItem>
                                <SelectItem value="ferme">Fermé</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Change Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le statut de l'abonnement</DialogTitle>
              <DialogDescription>
                Changer le statut de l'abonnement pour {selectedSubscription?.email}
              </DialogDescription>
            </DialogHeader>

            {selectedSubscription && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={selectedSubscription.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Input
                    value={
                      selectedSubscription.plan === "semestre"
                        ? "6 mois"
                        : selectedSubscription.plan === "annuel"
                          ? "1 an"
                          : "2 ans"
                    }
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Statut actuel</Label>
                  <div>{getStatusBadge(selectedSubscription.status)}</div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Choisissez le nouveau statut pour cet abonnement. Si vous sélectionnez "Actif", les dates de début
                    et fin seront automatiquement calculées.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={updatingStatus}>
                Annuler
              </Button>
              <Button
                variant="default"
                onClick={() => handleStatusChange("active")}
                disabled={updatingStatus || selectedSubscription?.status === "active"}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Activer
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleStatusChange("pending")}
                disabled={updatingStatus || selectedSubscription?.status === "pending"}
              >
                En attente
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("expired")}
                disabled={updatingStatus || selectedSubscription?.status === "expired"}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Expirer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
