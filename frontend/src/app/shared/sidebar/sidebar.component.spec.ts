import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir itemSelected ao clicar em um link', () => {
    let emitted = 0;
    component.itemSelected.subscribe(() => emitted++);

    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const firstLink = compiled.querySelector('a');
    expect(firstLink).toBeTruthy();
    firstLink?.dispatchEvent(new Event('click'));

    expect(emitted).toBe(1);
  });
});
