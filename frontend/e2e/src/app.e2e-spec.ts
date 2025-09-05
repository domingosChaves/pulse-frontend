import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('Aplicação (E2E)', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('deve exibir o título do cabeçalho', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toEqual('Pulse');
  });

  afterEach(async () => {
    // Verifica que não há erros no console do navegador
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
