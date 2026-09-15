import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.loading$ | async">
      <div class="loading-card">
        <div class="quantum-loader">
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="core"></div>
        </div>
        <p class="loading-text">Initializing Systems...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(10, 15, 30, 0.85); backdrop-filter: blur(12px);
      display: flex; justify-content: center; align-items: center; z-index: 99999;
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .loading-card {
      background: linear-gradient(145deg, #182232, #0f172a);
      border: 1px solid rgba(129, 140, 248, 0.2);
      padding: 36px 48px; border-radius: 24px;
      box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.15);
      display: flex; flex-direction: column; align-items: center; gap: 20px;
    }

    /* Quantum Orbit Animation */
    .quantum-loader {
      position: relative; width: 64px; height: 64px;
      display: flex; justify-content: center; align-items: center;
    }
    .ring {
      position: absolute; width: 100%; height: 100%;
      border: 3px solid transparent; border-radius: 50%;
    }
    .ring:nth-child(1) {
      border-top-color: #6366f1; border-bottom-color: #6366f1;
      animation: spinClockwise 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }
    .ring:nth-child(2) {
      width: 75%; height: 75%;
      border-left-color: #38bdf8; border-right-color: #38bdf8;
      animation: spinCounter 1s linear infinite;
    }
    .core {
      width: 16px; height: 16px; background: #818cf8; border-radius: 50%;
      box-shadow: 0 0 15px #818cf8, 0 0 30px #38bdf8;
      animation: pulseCore 1.2s ease-in-out infinite alternate;
    }

    @keyframes spinClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes spinCounter { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
    @keyframes pulseCore { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.2); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .loading-text {
      color: #f8fafc; font-weight: 600; font-size: 14px; letter-spacing: 1px; margin: 0;
      text-transform: uppercase; background: linear-gradient(90deg, #fff, #94a3b8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
  `]
})
export class GlobalLoadingComponent {
  constructor(public loadingService: LoadingService) {}
}