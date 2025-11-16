import { useState } from "react";
import { Users, AlertTriangle, TrendingUp, CheckCircle, Bell, Download, Search, Filter, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = {
  primary: "hsl(217 91% 60%)",
  success: "hsl(142 71% 45%)",
  danger: "hsl(0 84% 60%)",
  warning: "hsl(38 92% 50%)",
  purple: "hsl(262 83% 58%)",
  cyan: "hsl(197 71% 52%)",
};

const mockTrendData = [
  { month: "Ιαν", moderate: 1050, high: 380 },
  { month: "Φεβ", moderate: 1020, high: 400 },
  { month: "Μαρ", moderate: 1040, high: 390 },
  { month: "Απρ", moderate: 1080, high: 410 },
  { month: "Μαί", moderate: 1100, high: 420 },
  { month: "Ιουν", moderate: 1206, high: 438 },
];

const mockPieData = [
  { name: "Απώλεια Εργασίας", value: 26, color: CHART_COLORS.primary },
  { name: "Άλλο", value: 7, color: CHART_COLORS.cyan },
  { name: "Οικογενειακά Θέματα", value: 18, color: CHART_COLORS.warning },
  { name: "Υγεία/Αναπηρία", value: 18, color: CHART_COLORS.purple },
  { name: "Στέγαση", value: 31, color: "#64748B" },
];

const mockBarData = [
  { area: "Κέντρο", count: 28 },
  { area: "Εξάρχεια", count: 18 },
  { area: "Κυψέλη", count: 32 },
  { area: "Παγκράτι", count: 12 },
  { area: "Πατήσια", count: 25 },
  { area: "Κολωνάκι", count: 8 },
  { area: "Γκάζι", count: 22 },
  { area: "Πετράλωνα", count: 15 },
];

const generateCitizens = () => {
  const areas = [
    { name: "Κέντρο", count: 28 },
    { name: "Εξάρχεια", count: 18 },
    { name: "Κυψέλη", count: 32 },
    { name: "Παγκράτι", count: 12 },
    { name: "Πατήσια", count: 25 },
    { name: "Κολωνάκι", count: 8 },
    { name: "Γκάζι", count: 22 },
    { name: "Πετράλωνα", count: 15 },
  ];
  
  const causes = ["Στέγαση", "Στέγαση", "Στέγαση", "Απώλεια Εργασίας", "Υγεία/Αναπηρία", "Οικογενειακά Θέματα", "Άλλο"];
  const supports = ["Στέγαση", "Οικονομική Βοήθεια", "Συμβουλευτική", "Ιατρική Φροντίδα", "Επαγγελματική Κατάρτιση", "Κοινωνικό Παντοπωλείο"];
  
  const citizens = [];
  let idCounter = 1;
  
  for (const area of areas) {
    // Υπολογισμός risk level βάσει αριθμού ατόμων
    let areaRisk = "Χαμηλός";
    if (area.count > 25) {
      areaRisk = "Υψηλός";
    } else if (area.count >= 10) {
      areaRisk = "Μέτριος";
    }
    
    for (let i = 0; i < area.count; i++) {
      citizens.push({
        id: `C-2024-${String(idCounter).padStart(4, '0')}`,
        area: area.name,
        age: Math.floor(Math.random() * 50) + 20,
        risk: areaRisk,
        cause: causes[Math.floor(Math.random() * causes.length)],
        support: supports[Math.floor(Math.random() * supports.length)],
      });
      idCounter++;
    }
  }
  
  return citizens;
};

const mockCitizens = generateCitizens();

const Admin = () => {
  const [filter, setFilter] = useState("Όλοι");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCitizen, setSelectedCitizen] = useState<{
    id: string;
    area: string;
    age: number;
    risk: string;
    cause: string;
    support: string;
  } | null>(null);
  const [assistanceType, setAssistanceType] = useState("");
  const [sendMethod, setSendMethod] = useState("");
  const { toast } = useToast();

  const getRiskBadgeVariant = (risk: string) => {
    if (risk === "Υψηλός") return "destructive";
    if (risk === "Μέτριος") return "warning";
    return "success";
  };

  const filteredCitizens = mockCitizens.filter((citizen) => {
    const matchesFilter = filter === "Όλοι" || citizen.risk === filter;
    const matchesSearch =
      citizen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getAreaCitizens = (area: string) => {
    return mockCitizens.filter((citizen) => citizen.area === area);
  };

  type AreaStat = { area: string; count: number; risk: string; topCause: string; topSupport: string };
  const areaStats: AreaStat[] = (() => {
    const priority: Record<string, number> = { Υψηλός: 3, Μέτριος: 2, Χαμηλός: 1 };
    const map = new Map<
      string,
      { count: number; risk: string; causes: Record<string, number>; supports: Record<string, number> }
    >();
    for (const c of mockCitizens) {
      const entry = map.get(c.area) ?? { count: 0, risk: "Χαμηλός", causes: {}, supports: {} };
      entry.count += 1;
      if (priority[c.risk] > priority[entry.risk]) entry.risk = c.risk;
      entry.causes[c.cause] = (entry.causes[c.cause] ?? 0) + 1;
      entry.supports[c.support] = (entry.supports[c.support] ?? 0) + 1;
      map.set(c.area, entry);
    }
    return Array.from(map.entries()).map(([area, v]) => ({
      area,
      count: v.count,
      risk: v.risk,
      topCause: Object.entries(v.causes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-",
      topSupport: Object.entries(v.supports).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-",
    }));
  })();

  const areaStatsFiltered = areaStats.filter((a) => {
    const matchesFilter = filter === "Όλοι" || a.risk === filter;
    const matchesSearch = a.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const handleSendAssistance = () => {
    if (!selectedCitizen || !assistanceType || !sendMethod) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε όλα τα πεδία",
        variant: "destructive",
      });
      return;
    }

    const methodText = sendMethod === "sms" ? "SMS" : sendMethod === "push" ? "Push Notification" : "Γράμμα";

    toast({
      title: "Επιτυχής Αποστολή",
      description: `Στάλθηκε ${assistanceType} μέσω ${methodText} στον πολίτη ${selectedCitizen.id}`,
    });

    // Reset form
    setSelectedCitizen(null);
    setAssistanceType("");
    setSendMethod("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      {/* Desktop Monitor Frame */}
      <div className="relative w-full max-w-[1600px]">
        {/* Monitor Screen */}
        <div className="relative bg-slate-950 rounded-2xl border-[12px] border-slate-900 overflow-hidden shadow-2xl">
          {/* Thin camera notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-b-md z-50" />

          {/* Screen Content with aspect ratio */}
          <div className="bg-background overflow-y-auto" style={{ height: "calc(100vh - 220px)", maxHeight: "920px" }}>
            <div className="p-4 md:p-8">
              <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Σύστημα Παρακολούθησης Ευάλωτων Πολιτών</h1>
                      <p className="text-sm text-muted-foreground">Δήμος Αθηναίων</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Bell className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <span className="text-lg">ΔΑ</span>
                    </Button>
                  </div>
                </div>

                {/* Λίστα Περιοχών σε Κίνδυνο (πάνω-πάνω) */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Λίστα Περιοχών σε Κίνδυνο</CardTitle>
                        <CardDescription>8 από 8 περιοχές</CardDescription>
                      </div>
                      <Button variant="default" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Εξαγωγή
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Αναζήτηση με περιοχή..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Όλοι">Όλοι</SelectItem>
                          <SelectItem value="Υψηλός">Υψηλός</SelectItem>
                          <SelectItem value="Μέτριος">Μέτριος</SelectItem>
                          <SelectItem value="Χαμηλός">Χαμηλός</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Περιοχή</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Άτομα</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                              Επίπεδο Κινδύνου
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                              Κύρια Αιτία
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                              Υποστήριξη
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {areaStatsFiltered.map((row) => (
                            <tr
                              key={row.area}
                              className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => setSelectedArea(row.area)}
                            >
                              <td className="py-3 px-4 text-sm font-medium">{row.area}</td>
                              <td className="py-3 px-4 text-sm">{row.count}</td>
                              <td className="py-3 px-4">
                                <Badge variant={getRiskBadgeVariant(row.risk)}>{row.risk}</Badge>
                              </td>
                              <td className="py-3 px-4 text-sm">{row.topCause}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{row.topSupport}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Σύνολο Ατόμων σε Κίνδυνο</p>
                          <p className="text-3xl font-bold">2,847</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            από <span className="text-status-high">+12%</span> τον προηγ. μήνα
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Περιοχές Υψηλού Κινδύνου</p>
                          <p className="text-3xl font-bold">8</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            από <span className="text-status-high">+2</span> τον προηγ. μήνα
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-status-high/10 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-status-high" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Ενεργές Περιπτώσεις</p>
                          <p className="text-3xl font-bold">438</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            από <span className="text-status-warning">+8%</span> τον προηγ. μήνα
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-status-warning/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-status-warning" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Ολοκληρωμένες Υποστηρίξεις</p>
                          <p className="text-3xl font-bold">1,206</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            από <span className="text-status-low">+9%</span> τον προηγ. μήνα
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-status-low/10 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-status-low" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trend Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Τάση Ατόμων σε Κίνδυνο</CardTitle>
                      <CardDescription>Εξέλιξη τελευταίων 6 μηνών</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <Button variant="secondary" size="sm">
                          Εβδ.
                        </Button>
                        <Button variant="ghost" size="sm">
                          Μήνας
                        </Button>
                        <Button variant="ghost" size="sm">
                          Έτος
                        </Button>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="moderate"
                            name="Μέτριος Κίνδυνος"
                            stroke={CHART_COLORS.warning}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS.warning }}
                          />
                          <Line
                            type="monotone"
                            dataKey="high"
                            name="Υψηλός Κίνδυνος"
                            stroke={CHART_COLORS.danger}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS.danger }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Αιτίες Κινδύνου</CardTitle>
                      <CardDescription>Κατανομή κύριων αιτιών</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={mockPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {mockPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Bar Chart - Areas List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Λίστα Περιοχών σε Κίνδυνο</CardTitle>
                    <CardDescription>
                      Κάντε κλικ σε μία περιοχή για να δείτε τους πολίτες και να στείλετε βοήθεια
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={mockBarData}
                        onClick={(data) => {
                          if (data && data.activePayload && data.activePayload[0]) {
                            setSelectedArea(data.activePayload[0].payload.area);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="area" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Area Citizens Dialog */}
          <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Πολίτες σε Κίνδυνο - {selectedArea}</DialogTitle>
                <DialogDescription>Κάντε κλικ σε έναν πολίτη για να στείλετε εξατομικευμένη βοήθεια</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedArea &&
                  getAreaCitizens(selectedArea).map((citizen) => (
                    <Card
                      key={citizen.id}
                      className="cursor-pointer transition-all hover:bg-accent"
                      onClick={() => setSelectedCitizen(citizen)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-semibold">{citizen.id}</span>
                              <Badge variant={getRiskBadgeVariant(citizen.risk)}>{citizen.risk}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Ηλικία: {citizen.age} | Αιτία: {citizen.cause}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Individual Citizen Dialog */}
          <Dialog open={!!selectedCitizen} onOpenChange={() => setSelectedCitizen(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Αποστολή Εξατομικευμένης Βοήθειας</DialogTitle>
                <DialogDescription>
                  Πολίτης: {selectedCitizen?.id} | Περιοχή: {selectedCitizen?.area}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Επίπεδο Κινδύνου:</span>
                    <Badge variant={selectedCitizen ? getRiskBadgeVariant(selectedCitizen.risk) : "default"}>
                      {selectedCitizen?.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ηλικία:</span>
                    <span className="font-medium">{selectedCitizen?.age}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Κύρια Αιτία:</span>
                    <span className="font-medium">{selectedCitizen?.cause}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="assistance">Τύπος Βοήθειας</Label>
                  <Select value={assistanceType} onValueChange={setAssistanceType}>
                    <SelectTrigger id="assistance">
                      <SelectValue placeholder="Επιλέξτε τύπο βοήθειας" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Οικονομική Βοήθεια">Οικονομική Βοήθεια</SelectItem>
                      <SelectItem value="Επίδομα Στέγασης">Επίδομα Στέγασης</SelectItem>
                      <SelectItem value="Επίδομα Ανεργίας">Επίδομα Ανεργίας</SelectItem>
                      <SelectItem value="Κοινωνικό Παντοπωλείο">Κοινωνικό Παντοπωλείο</SelectItem>
                      <SelectItem value="Ιατρική Φροντίδα">Ιατρική Φροντίδα</SelectItem>
                      <SelectItem value="Συμβουλευτική">Συμβουλευτική</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="method">Μέθοδος Αποστολής</Label>
                  <Select value={sendMethod} onValueChange={setSendMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Επιλέξτε μέθοδο" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="letter">Γράμμα στη Διεύθυνση (Κρυπτογραφημένη)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleSendAssistance} disabled={!assistanceType || !sendMethod}>
                  <Send className="w-4 h-4 mr-2" />
                  Αποστολή Ειδοποίησης
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Η διεύθυνση του πολίτη είναι κρυπτογραφημένη και δεν είναι ορατή στους διαχειριστές
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Monitor Stand Neck */}
        <div className="flex justify-center">
          <div className="w-32 h-16 bg-gradient-to-b from-slate-800 to-slate-700 relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-slate-900" />
          </div>
        </div>

        {/* Monitor Base/Stand */}
        <div className="flex justify-center">
          <div className="w-96 h-8 bg-gradient-to-b from-slate-700 to-slate-600 rounded-full shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/30 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
