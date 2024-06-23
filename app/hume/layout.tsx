export default function HumeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body className="flex flex-col w-full">{children}</body>;
}
