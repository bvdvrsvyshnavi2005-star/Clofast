import * as THREE from 'three';

/**
 * Creates a high-resolution, anti-aliased procedural canvas texture for company and category badges.
 */
export function createBadgeTexture(
  title: string,
  categoryName: string,
  brandColor: string,
  bgColor: string = '#0a1026'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Background capsule with glow
    ctx.fillStyle = bgColor;
    ctx.roundRect(16, 16, 480, 224, 32);
    ctx.fill();

    // Border stroke with brand accent
    ctx.strokeStyle = brandColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Subtle inner gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, brandColor + '22');
    grad.addColorStop(1, '#00000000');
    ctx.fillStyle = grad;
    ctx.fill();

    // Category Eyebrow
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = brandColor;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(categoryName.toUpperCase(), 256, 75);

    // Company Title
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '1px';
    ctx.fillText(title, 256, 140);

    // Live Status Pill
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(200, 185, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SYNC: ACTIVE', 260, 192);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a circular node badge texture for the 3D satellite orbs.
 */
export function createNodeBadgeTexture(
  companyName: string,
  brandColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Outer circular disc
    ctx.fillStyle = '#060c21';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring with glow
    ctx.strokeStyle = brandColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner subtle glow
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
    grad.addColorStop(0, brandColor + '55');
    grad.addColorStop(0.8, '#060c21');
    ctx.fillStyle = grad;
    ctx.fill();

    // Company Initial / Icon Placeholder
    const initial = companyName.charAt(0).toUpperCase();
    ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = brandColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, 128, 96);

    // Company Name Text
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    // If long name, wrap or abbreviate
    const displayTitle = companyName.length > 11 ? companyName.split(' ')[0] : companyName;
    ctx.fillText(displayTitle, 128, 168);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a soft radial contact shadow texture.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.95)');
    grad.addColorStop(0.3, 'rgba(2, 6, 23, 0.7)');
    grad.addColorStop(0.65, 'rgba(2, 6, 23, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates high-tech circuit grid floor texture.
 */
export function createCircuitGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 1024, 1024);

    // Grid lines
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.35)';
    ctx.lineWidth = 1;

    const step = 64;
    for (let x = 0; x <= 1024; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Concentric cyber rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    [128, 256, 384, 500].forEach((r) => {
      ctx.beginPath();
      ctx.arc(512, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Circuit track accents
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(512 + Math.cos(angle) * 120, 512 + Math.sin(angle) * 120);
      ctx.lineTo(512 + Math.cos(angle) * 480, 512 + Math.sin(angle) * 480);
      ctx.stroke();

      // Terminal node dot
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(512 + Math.cos(angle) * 480, 512 + Math.sin(angle) * 480, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}
