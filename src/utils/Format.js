export const formatEuro = (montant) => {
  return montant.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
 }) +" €";
};