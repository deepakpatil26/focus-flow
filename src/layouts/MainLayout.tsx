import Navbar from '../components/Navbar';

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
