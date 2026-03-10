export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // bg-transparent jest kluczowe, aby widget nie miał białego tła, 
    // dzięki czemu widać przez niego stronę klienta!
    <div className="min-h-screen w-full bg-transparent">
      {children}
    </div>
  );
}