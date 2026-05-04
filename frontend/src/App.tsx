import { useEffect, useState, useMemo } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, LayoutDashboard, Settings, LogOut, XCircle, Filter, FileText, Wrench, Menu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
interface ScanResult {
  id: string;
  service: string;
  parameter: string;
  expected: string;
  actual: string;
  severity: string;
  status: string;
  remediation: string;
}

interface ScanSummary {
  total: number;
  passed: number;
  failed: number;
  not_found: number;
  high: number;
  medium: number;
  low: number;
}

export default function App() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartConfig = {
    Passed: {
      label: "Passed",
      color: "#22c55e",
    },
    Failed: {
      label: "Failed",
      color: "#ef4444",
    },
    NotFound: {
      label: "Not Found",
      color: "#f97316",
    },
  } satisfies ChartConfig;

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'policies' | 'remediation' | 'settings'>('dashboard');

  // Filter State
  const [serviceFilter, setServiceFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:8080/api/scan')
        .then(res => res.json())
        .then(data => {
          setResults(data.results);
          setSummary(data.summary);
          
          // Transform chart data
          const transformedChartData = data.charts.services.map((service: string, index: number) => ({
            name: service,
            Passed: data.charts.pass[index],
            Failed: data.charts.fail[index],
            NotFound: data.charts.not_found[index],
          }));
          setChartData(transformedChartData);

          // Update historical data
          setHistoricalData(prev => {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const newData = [...prev, { time: now, Passed: data.summary.passed, Failed: data.summary.failed, NotFound: data.summary.not_found }];
            return newData.slice(-15); // keep last 15 points
          });

          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const uniqueServices = useMemo(() => {
    return Array.from(new Set(results.map(r => r.service))).sort();
  }, [results]);

  const uniqueSeverities = useMemo(() => {
    return Array.from(new Set(results.map(r => r.severity))).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchService = serviceFilter === 'All' || r.service === serviceFilter;
      const matchSeverity = severityFilter === 'All' || r.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchService && matchSeverity && matchStatus;
    });
  }, [results, serviceFilter, severityFilter, statusFilter]);

  const failedResults = useMemo(() => {
    return results.filter(r => r.status === 'FAIL');
  }, [results]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin text-primary">
          <Shield className="h-12 w-12" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium tracking-wide">Initializing Enterprise Scanner...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-screen">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">CloudSentinel</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Security Posture</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-2 px-2">Navigation</div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('policies')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'policies' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <FileText className="h-4 w-4" /> Audit Policies
          </button>
          
          <button 
            onClick={() => setActiveTab('remediation')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'remediation' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Wrench className="h-4 w-4" /> Remediation
            {failedResults.length > 0 && (
              <Badge variant="destructive" className="ml-auto h-5 px-1.5 min-w-5 flex items-center justify-center text-[10px]">{failedResults.length}</Badge>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-xs">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@cloudsentinel.local</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background/50">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="font-bold">CloudSentinel</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Top Bar for desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-border bg-card/50 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight capitalize">
              {activeTab === 'policies' ? 'Audit Policies' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 bg-green-500/10 text-green-500 border-green-500/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Live Scan Active
            </Badge>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Refresh Data
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* ==================== DASHBOARD TAB ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Checks</CardTitle>
                    <Search className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{summary?.total || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Evaluated across all services</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Passed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">{summary?.passed || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Configurations compliant</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-destructive bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
                    <XCircle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-destructive">{summary?.failed || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Misconfigurations detected</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Not Found</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{summary?.not_found || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Parameters missing</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts & Analytics */}
              <div className="grid gap-6 md:grid-cols-7">
                <Card className="md:col-span-4 shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Compliance by Service</CardTitle>
                    <CardDescription>Overview of pass/fail distribution across MicroStack components.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="Passed" fill="var(--color-Passed)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="Failed" fill="var(--color-Failed)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="NotFound" fill="var(--color-NotFound)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3 shadow-sm border-border/50 flex flex-col">
                  <CardHeader>
                    <CardTitle>Severity Distribution</CardTitle>
                    <CardDescription>Criticality of current active rules.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center gap-8 px-8 pb-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-red-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> High</div>
                          <div className="text-sm font-medium">{summary?.high || 0}</div>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${(summary?.high || 0) / (summary?.total || 1) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-orange-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Medium</div>
                          <div className="text-sm font-medium">{summary?.medium || 0}</div>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(summary?.medium || 0) / (summary?.total || 1) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-green-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Low</div>
                          <div className="text-sm font-medium">{summary?.low || 0}</div>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(summary?.low || 0) / (summary?.total || 1) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Trend Chart */}
                <Card className="col-span-full shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Real-time Compliance Trend</CardTitle>
                    <CardDescription>Live tracking of scan results over the last 15 intervals.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                      <AreaChart data={historicalData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area type="monotone" dataKey="Passed" stroke="var(--color-Passed)" fill="var(--color-Passed)" fillOpacity={0.2} stackId="1" />
                        <Area type="monotone" dataKey="Failed" stroke="var(--color-Failed)" fill="var(--color-Failed)" fillOpacity={0.2} stackId="1" />
                        <Area type="monotone" dataKey="NotFound" stroke="var(--color-NotFound)" fill="var(--color-NotFound)" fillOpacity={0.2} stackId="1" />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ==================== POLICIES TAB ==================== */}
          {activeTab === 'policies' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <Card className="shadow-sm border-t-4 border-t-secondary border-x-border/50 border-b-border/50 flex-1 flex flex-col min-h-0">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4 bg-muted/20 border-b border-border/50 shrink-0">
                  <div>
                    <CardTitle>Detailed Audit Logs</CardTitle>
                    <CardDescription>Complete breakdown of all configuration checks.</CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 h-9 shadow-sm">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground mr-2 border-r border-border pr-2">Filters</span>
                      
                      <select 
                        className="bg-transparent text-sm font-medium outline-none text-foreground border-r border-border pr-2 py-1 mr-2"
                        value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}
                      >
                        <option value="All">All Services</option>
                        {uniqueServices.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      
                      <select 
                        className="bg-transparent text-sm font-medium outline-none text-foreground border-r border-border pr-2 py-1 mr-2"
                        value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}
                      >
                        <option value="All">All Severities</option>
                        {uniqueSeverities.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      
                      <select 
                        className="bg-transparent text-sm font-medium outline-none text-foreground py-1"
                        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="PASS">Pass</option>
                        <option value="FAIL">Fail</option>
                        <option value="NOT FOUND">Not Found</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-auto">
                  <div className="w-full">
                    <Table>
                      <TableHeader className="bg-muted/40 sticky top-0 backdrop-blur z-10">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[100px] font-semibold text-foreground py-4">Rule ID</TableHead>
                          <TableHead className="font-semibold text-foreground py-4">Service</TableHead>
                          <TableHead className="font-semibold text-foreground py-4">Parameter</TableHead>
                          <TableHead className="font-semibold text-foreground py-4">Expected / Actual</TableHead>
                          <TableHead className="font-semibold text-foreground py-4">Severity</TableHead>
                          <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
                          <TableHead className="font-semibold text-foreground py-4 max-w-[300px]">Remediation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground/50" />
                                <p>No results found for the selected filters.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredResults.map((r, i) => (
                            <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-medium bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
                                  {r.service}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">{r.parameter}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1 text-xs font-mono bg-background p-2 rounded border border-border/50">
                                  <span className="text-green-500/90 flex justify-between"><span>Exp:</span> <span>{r.expected}</span></span>
                                  <span className={r.status === 'FAIL' ? 'text-red-500/90 flex justify-between' : 'text-muted-foreground flex justify-between'}><span>Act:</span> <span>{r.actual}</span></span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    r.severity === 'High' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                    r.severity === 'Medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                                    'border-green-500/30 text-green-500 bg-green-500/10'
                                  }
                                >
                                  {r.severity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 font-medium text-sm">
                                  {r.status === 'PASS' && <><CheckCircle className="h-4 w-4 text-green-500" /> <span className="text-green-500">PASS</span></>}
                                  {r.status === 'FAIL' && <><XCircle className="h-4 w-4 text-red-500" /> <span className="text-red-500">FAIL</span></>}
                                  {r.status === 'NOT FOUND' && <><AlertTriangle className="h-4 w-4 text-orange-500" /> <span className="text-orange-500">MISSING</span></>}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate" title={r.remediation}>
                                {r.remediation}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== REMEDIATION TAB ==================== */}
          {activeTab === 'remediation' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Actionable Items</h3>
                  <p className="text-sm text-muted-foreground">Showing only failed checks that require immediate remediation.</p>
                </div>
                <Badge variant="destructive" className="text-sm shadow-sm px-3 py-1">
                  {failedResults.length} Issues Found
                </Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {failedResults.length === 0 ? (
                  <Card className="md:col-span-2 xl:col-span-3 border-dashed border-green-500/30 bg-green-500/5">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-500">All Clear!</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mt-2">No failed security checks were found in your environment. Your infrastructure is currently compliant.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  failedResults.map((r, i) => (
                    <Card key={i} className="flex flex-col shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-destructive bg-card">
                      <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="mb-2 bg-background border-border">{r.service}</Badge>
                            <CardTitle className="text-base flex items-center gap-2 font-mono text-sm">
                              {r.id}
                            </CardTitle>
                          </div>
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">{r.severity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col">
                        <div className="space-y-3 flex-1">
                          <div className="bg-red-500/5 border border-red-500/10 rounded p-3 text-sm">
                            <span className="font-semibold text-red-500 block mb-1">Issue Detected:</span>
                            <div className="font-mono text-xs mt-1 text-muted-foreground">Parameter <span className="text-foreground">{r.parameter}</span> is misconfigured.</div>
                            <div className="font-mono text-xs mt-2 text-muted-foreground flex items-center gap-2">
                              Expected: <span className="text-green-500">{r.expected}</span>
                            </div>
                            <div className="font-mono text-xs mt-1 text-muted-foreground flex items-center gap-2">
                              Actual: <span className="text-destructive font-bold">{r.actual}</span>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <span className="font-semibold text-foreground text-sm flex items-center gap-2 mb-2">
                              <Wrench className="h-4 w-4 text-primary" /> Remediation Steps
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/40">{r.remediation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/10">
                  <CardTitle>MicroStack Credentials</CardTitle>
                  <CardDescription>Configure connection parameters for the target MicroStack environment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Auth URL</label>
                      <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="https://microstack.local:5000/v3" defaultValue="https://microstack.local:5000/v3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Name</label>
                      <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="admin" defaultValue="admin" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="admin" defaultValue="admin" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="••••••••••••" />
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">Save Credentials</Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/10">
                  <CardTitle>Scan Preferences</CardTitle>
                  <CardDescription>Manage automated scan schedules and reporting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div>
                        <h4 className="text-sm font-medium">Automated Daily Scans</h4>
                        <p className="text-sm text-muted-foreground">Run misconfiguration checks automatically every day at midnight.</p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                        <span className="translate-x-6 inline-block h-4 w-4 rounded-full bg-background transition transform"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div>
                        <h4 className="text-sm font-medium">Email Alerts for High Severity</h4>
                        <p className="text-sm text-muted-foreground">Receive immediate email notifications if High severity failures are found.</p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                        <span className="translate-x-6 inline-block h-4 w-4 rounded-full bg-background transition transform"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-2">
                      <div>
                        <h4 className="text-sm font-medium">Export Formats</h4>
                        <p className="text-sm text-muted-foreground">Default format when exporting audit reports.</p>
                      </div>
                      <select className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option>JSON</option>
                        <option>CSV</option>
                        <option>PDF</option>
                      </select>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full md:w-auto">Update Preferences</Button>
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
