export default function MemoryCardsTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body className="flex flex-col w-full">{children}</body>;
}
