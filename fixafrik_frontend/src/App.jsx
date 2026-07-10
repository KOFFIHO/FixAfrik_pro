import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteProtegee from "./components/RouteProtegee";

import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import RechercheArtisans from "./pages/RechercheArtisans";
import DetailArtisan from "./pages/DetailArtisan";
import NouvelleDemande from "./pages/NouvelleDemande";
import MesDemandes from "./pages/MesDemandes";
import Profil from "./pages/Profil";
import ProfilArtisan from "./pages/ProfilArtisan";
import DemandesDisponibles from "./pages/DemandesDisponibles";
import MesMissions from "./pages/MesMissions";
import PageIntrouvable from "./pages/PageIntrouvable";

import AdminLayout from "./components/AdminLayout";
import TableauBordAdmin from "./pages/admin/TableauBordAdmin";
import GestionUtilisateurs from "./pages/admin/GestionUtilisateurs";
import ValidationArtisans from "./pages/admin/ValidationArtisans";
import GestionCategories from "./pages/admin/GestionCategories";
import GestionImagesAccueil from "./pages/admin/GestionImagesAccueil";
import ModerationAvis from "./pages/admin/ModerationAvis";
import SuiviActivites from "./pages/admin/SuiviActivites";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />

          {/* Réservé aux clients connectés */}
          <Route
            path="/recherche"
            element={
              <RouteProtegee rolesAutorises={["client"]}>
                <RechercheArtisans />
              </RouteProtegee>
            }
          />
          <Route
            path="/artisans/:id"
            element={
              <RouteProtegee rolesAutorises={["client"]}>
                <DetailArtisan />
              </RouteProtegee>
            }
          />
          <Route
            path="/nouvelle-demande"
            element={
              <RouteProtegee rolesAutorises={["client"]}>
                <NouvelleDemande />
              </RouteProtegee>
            }
          />
          <Route
            path="/mes-demandes"
            element={
              <RouteProtegee rolesAutorises={["client"]}>
                <MesDemandes />
              </RouteProtegee>
            }
          />
          <Route
            path="/profil"
            element={
              <RouteProtegee rolesAutorises={["client"]}>
                <Profil />
              </RouteProtegee>
            }
          />

          {/* Réservé aux artisans connectés */}
          <Route
            path="/mon-profil-artisan"
            element={
              <RouteProtegee rolesAutorises={["artisan"]}>
                <ProfilArtisan />
              </RouteProtegee>
            }
          />
          <Route
            path="/demandes-disponibles"
            element={
              <RouteProtegee rolesAutorises={["artisan"]}>
                <DemandesDisponibles />
              </RouteProtegee>
            }
          />
          <Route
            path="/mes-missions"
            element={
              <RouteProtegee rolesAutorises={["artisan"]}>
                <MesMissions />
              </RouteProtegee>
            }
          />

          {/* Réservé à l'administrateur */}
          <Route
            path="/admin"
            element={
              <RouteProtegee rolesAutorises={["admin"]}>
                <AdminLayout />
              </RouteProtegee>
            }
          >
            <Route index element={<TableauBordAdmin />} />
            <Route path="utilisateurs" element={<GestionUtilisateurs />} />
            <Route path="artisans" element={<ValidationArtisans />} />
            <Route path="categories" element={<GestionCategories />} />
            <Route path="images-accueil" element={<GestionImagesAccueil />} />
            <Route path="avis" element={<ModerationAvis />} />
            <Route path="activite" element={<SuiviActivites />} />
          </Route>

          <Route path="*" element={<PageIntrouvable />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}
