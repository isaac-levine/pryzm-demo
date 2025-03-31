import "./globals.css";

export const metadata = {
  title: "Government Contractor Search",
  description: "Search for government contractors using SAM data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
