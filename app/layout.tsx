import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search AI Memory App',
  description: 'AI web search assistant with login and personal memory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
