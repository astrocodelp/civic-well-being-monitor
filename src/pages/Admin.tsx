import { useState } from "react";
import { Users, AlertTriangle, TrendingUp, CheckCircle, Bell, Download, Filter, Send } from "lucide-react";
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
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [assistanceType, setAssistanceType] = useState("");
  const [sendMethod, setSendMethod] = useState("");
  const { toast } = useToast();

  const filteredCitizens = mockCitizens.filter((citizen) => {
    const matchesFilter = filter === "Όλοι" || citizen.risk === filter;
    const matchesSearch =
      citizen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSendAssistance = () => {
    if (selectedCitizen && assistanceType && sendMethod) {
      toast({
        title: "Ειδοποίηση Εστάλη",
        description: `Ειδοποίηση εστάλη στον πολίτη ${selectedCitizen.id}`,
      });
      setSelectedCitizen(null);
      setAssistanceType("");
      setSendMethod("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 md:p-8">
      <div className="max-w-7xl mx-auto bg-slate-950 rounded-lg md:rounded-2xl border-2 md:border-8 border-slate-900 p-3 md:p-8 overflow-y-auto">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6 rounded-lg space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-4xl font-bold text-slate-800">Πίνακας Διαχείρισης</h1>
              <p className="text-xs md:text-base text-slate-600 mt-1">Επισκόπηση πολιτών σε κίνδυνο</p>
            </div>
            <Button className="gap-2 w-full md:w-auto text-xs md:text-sm">
              <Download className="h-3 w-3 md:h-4 md:w-4" />
              Εξαγωγή
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm flex justify-between">
                  Σύνολο
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{mockCitizens.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm flex justify-between">
                  Υψηλός
                  <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-red-600">
                  {mockCitizens.filter(c => c.risk === "Υψηλός").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm flex justify-between">
                  Ενεργά
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">15</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm flex justify-between">
                  Επιτυχείς
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-green-600">89</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-lg">Τάσεις Κινδύνου</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="high" stroke={CHART_COLORS.danger} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-lg">Αιτίες Κινδύνου</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={mockPieData} cx="50%" cy="50%" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={60} dataKey="value">
                      {mockPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-lg">Περιοχές</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} fontSize={9} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" onClick={(data) => setSelectedArea(data.area)} cursor="pointer">
                    {mockBarData.map((entry, index) => (
                      <Cell key={index} fill={entry.count > 25 ? CHART_COLORS.danger : entry.count >= 10 ? CHART_COLORS.warning : CHART_COLORS.success} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Citizens List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-lg">Λίστα Πολιτών</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <Input placeholder="Αναζήτηση..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="text-xs md:text-sm" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-40 text-xs md:text-sm">
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCitizens.map((citizen) => (
                  <div key={citizen.id} onClick={() => setSelectedCitizen(citizen)} className="flex justify-between p-2 md:p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div>
                      <p className="font-semibold text-xs md:text-sm">{citizen.id}</p>
                      <p className="text-[10px] md:text-xs text-slate-600">{citizen.area} • {citizen.age} ετών</p>
                    </div>
                    <Badge variant={citizen.risk === "Υψηλός" ? "destructive" : "default"} className="text-[10px] md:text-xs h-fit">{citizen.risk}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={selectedArea !== null} onOpenChange={() => setSelectedArea(null)}>
        <DialogContent className="mx-2">
          <DialogHeader>
            <DialogTitle className="text-sm md:text-base">Περιοχή: {selectedArea}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedArea && mockCitizens.filter(c => c.area === selectedArea).map((citizen) => (
              <div key={citizen.id} onClick={() => setSelectedCitizen(citizen)} className="p-2 border rounded cursor-pointer hover:bg-slate-50">
                <p className="text-xs md:text-sm font-semibold">{citizen.id}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedCitizen !== null} onOpenChange={() => setSelectedCitizen(null)}>
        <DialogContent className="mx-2">
          <DialogHeader>
            <DialogTitle className="text-sm md:text-base">Αποστολή Βοήθειας</DialogTitle>
          </DialogHeader>
          {selectedCitizen && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-2 rounded space-y-1">
                <p className="text-xs"><span className="font-semibold">ID:</span> {selectedCitizen.id}</p>
                <p className="text-xs"><span className="font-semibold">Αιτία:</span> {selectedCitizen.cause}</p>
              </div>
              <Select value={assistanceType} onValueChange={setAssistanceType}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Τύπος" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="στέγαση">Στέγαση</SelectItem>
                  <SelectItem value="οικονομική">Οικονομική</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sendMethod} onValueChange={setSendMethod}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Μέθοδος" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSendAssistance} className="w-full text-xs" disabled={!assistanceType || !sendMethod}>
                <Send className="h-3 w-3 mr-2" />Αποστολή
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
