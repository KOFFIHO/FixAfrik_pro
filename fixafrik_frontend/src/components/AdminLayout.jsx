import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users, ShieldCheck, Tags, MessageSquareWarning, Activity, Wrench, Images,
} from "lucide-react";
import "./AdminLayout.css";

const LIENS = [
  { to: "/admin", label: "Tableau de bord", Icone: LayoutDashboard, fin: true },
  { to: "/admin/utilisateurs", label: "Utilisateurs", Icone: Users },
  { to: "/admin/artisans", label: "Validation artisans", Icone: ShieldCheck },
  { to: "/admin/categories", label: "Catégories de métiers", Icone: Tags },
  { to: "/admin/images-accueil", label: "Images d'accueil", Icone: Images },
  { to: "/admin/avis", label: "Modération des avis", Icone: MessageSquareWarning },
  { to: "/admin/activite", label: "Suivi des activités", Icone: Activity },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="navbar-logo-icone">
            <Wrench size={18} strokeWidth={2.4} />
          </span>
          <div>
            <strong>FixAfrik</strong>
            <span>Espace administrateur</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {LIENS.map(({ to, label, Icone, fin }) => (
            <NavLink
              key={to}
              to={to}
              end={fin}
              className={({ isActive }) =>
                "admin-sidebar-lien" + (isActive ? " actif" : "")
              }
            >
              <Icone size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-contenu">
        <Outlet />
      </div>
    </div>
  );
}
