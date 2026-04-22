export default function DashboardPage() {
  return (
    <>
      <aside className="w-64 border-r border-border shrink-0 p-4">
        <h2 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
          Sidebar
        </h2>
      </aside>
      <main className="flex-1 p-6">
        <h2 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
          Main
        </h2>
      </main>
    </>
  );
}
