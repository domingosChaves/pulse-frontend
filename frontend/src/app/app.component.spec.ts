import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

describe('Componente App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('deve criar o aplicativo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve ter o título "frontend"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('deve renderizar o título do cabeçalho', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headerTitle = compiled.querySelector('header h1');
    expect(headerTitle?.textContent).toContain('Pulse');
  });
});
