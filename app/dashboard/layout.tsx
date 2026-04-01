// app/dashboard/layout.tsx
import AuthGuard from "@/components/auth/AuthGuard";
import { SearchProvider } from "@/contexts/search-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
       <SearchProvider>
      {children}
      </SearchProvider>
    </AuthGuard>
  );
}