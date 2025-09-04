# SidebarComponent

Menu lateral responsivo para navegação entre as principais funcionalidades do sistema.

Principais características:
- Navegação para Fabricantes, Produtos e Relatório (usa `routerLink`).
- Responsivo: overlay em telas pequenas e fixo no desktop.
- Acessível: navegação sem mouse e foco visível; emite evento após seleção no mobile.

API
- Outputs:
  - `itemSelected: EventEmitter<void>`: emitido ao clicar em um item; o `AppComponent` usa para fechar o menu no mobile.

Uso
1) Declarado no `SharedModule` e exportado; basta importar `SharedModule` no módulo raiz (já feito).
2) No layout principal (exemplo do `AppComponent`):

```html
<aside class="sidebar" [class.open]="sidebarOpen" aria-label="Menu lateral">
  <app-sidebar (itemSelected)="closeSidebarOnMobile()"></app-sidebar>
</aside>
```

Boas práticas de UX/UI adotadas
- Consistência com a cor primária (#1976d2) do cabeçalho.
- Alvos de toque adequados, estados hover/active e foco visível.
- Estrutura clara com rótulos e ícones, navegação previsível.

Estilos
- Estilos específicos no `sidebar.component.scss`.
- Layout e responsividade tratados no `app.component.scss`.

Testes
- `sidebar.component.spec.ts`: garante criação e emissão do evento ao clicar.

