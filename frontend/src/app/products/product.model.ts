export interface Product {
  id?: number;
  nome: string;
  descricao?: string;
  fabricanteId: number;
  fabricanteNome?: string;
  // Caso o BFF retorne objeto aninhado, mantemos campo opcional para compatibilidade
  manufacturer?: { id: number; nome: string } | null;
  fabricante?: { id: number; nome: string } | null;
}

