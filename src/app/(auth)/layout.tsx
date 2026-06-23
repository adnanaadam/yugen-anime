export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen -mt-14 overflow-hidden items-center justify-center">
      {children}
    </div>
  );
}