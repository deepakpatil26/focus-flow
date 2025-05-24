import BlocklistManager from "../components/BlocklistManager";

export default function BlocklistPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Distraction Blocklist</h2>
      <BlocklistManager />
    </div>
  );
}
