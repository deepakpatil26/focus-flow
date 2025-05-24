import BlocklistManager from '../components/BlocklistManager';

export default function BlocklistPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Website Blocking</h1>
      <BlocklistManager />
    </div>
  );
}