const LIBELLES = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
  valide: "Validé",
  rejete: "Rejeté",
};

export default function Pastille({ statut }) {
  return (
    <span className={`pastille pastille-${statut}`}>
      {LIBELLES[statut] || statut}
    </span>
  );
}
