import { useAuth } from "@/_core/hooks/useAuth";
import { SopranovaAppLayout } from "@/components/SopranovaAppLayout";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import Agents from "@/pages/Agents";
import Analytics from "@/pages/Analytics";
import Automations from "@/pages/Automations";
import Dashboard from "@/pages/Dashboard";
import Data from "@/pages/Data";
import Intelligence from "@/pages/Intelligence";
import Settings from "@/pages/Settings";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccessPage, MarketingPage } from "./pages/Public";
import NotFound from "./pages/NotFound";

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#F4F3F0] text-sm text-[#8C887F]">Verifying session…</div>;
  if (!isAuthenticated) return <AccessPage />;
  return <WorkspaceProvider><SopranovaAppLayout>{children}</SopranovaAppLayout></WorkspaceProvider>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Switch>
    <Route path="/">{() => <MarketingPage />}</Route>
    <Route path="/platform"><MarketingPage section="Platform" /></Route>
    <Route path="/intelligence"><MarketingPage section="Intelligence" /></Route>
    <Route path="/agents"><MarketingPage section="AI Agents" /></Route>
    <Route path="/solutions"><MarketingPage section="Solutions" /></Route>
    <Route path="/enterprise"><MarketingPage section="Enterprise" /></Route>
    <Route path="/about"><MarketingPage section="About" /></Route>
    <Route path="/contact"><MarketingPage section="Contact" /></Route>
    <Route path="/login" component={AccessPage} />
    <Route path="/signup" component={AccessPage} />
    <Route path="/forgot-password" component={AccessPage} />
    <Route path="/app"><Protected><Dashboard /></Protected></Route>
    <Route path="/app/dashboard"><Protected><Dashboard /></Protected></Route>
    <Route path="/app/intelligence"><Protected><Intelligence /></Protected></Route>
    <Route path="/app/agents"><Protected><Agents /></Protected></Route>
    <Route path="/app/data"><Protected><Data /></Protected></Route>
    <Route path="/app/analytics"><Protected><Analytics /></Protected></Route>
    <Route path="/app/automations"><Protected><Automations /></Protected></Route>
    <Route path="/app/settings"><Protected><Settings /></Protected></Route>
    <Route component={NotFound} />
  </Switch></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
