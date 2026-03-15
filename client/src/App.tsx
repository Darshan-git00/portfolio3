import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Home from "@/pages/Home";
import CinematicOverlay from "@/components/ui/CinematicOverlay";
import NotFound from "@/pages/not-found";
import HoloGlobe from "@/components/HoloGlobe";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TooltipProvider>
          {/* HoloGlobe must be inside ThemeProvider so the .dark class is present */}
          <HoloGlobe />
          <CinematicOverlay />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}