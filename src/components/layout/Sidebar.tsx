interface MenuItem {
  id: string;
  label: string;
  icon: string;
  subItems?: { id: string; label: string }[];
}

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    id: "prepare",
    label: "Prepare",
    icon: "📋",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    icon: "🔄",
  },
];

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const handleMenuClick = (sectionId: string) => {
    onNavigate(sectionId);
  };

  return (
    <aside className="bg-gray-900 text-white w-64 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
