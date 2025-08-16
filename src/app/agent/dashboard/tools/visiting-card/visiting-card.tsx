'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Agent = {
  slug: string;
  profilePhotoUrl: string | null;
  logoUrl?: string | null;
  city: string | null;
  area: string | null;
  phone: string | null;
  websiteUrl: string | null;
  user: { name: string | null; email: string | null };
};

export default function VisitingCardGenerator({ agent }: { agent: Agent }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [template, setTemplate] = useState<'minimal' | 'bold' | 'figma' | 'figma2' | 'figma3'>('minimal');
  const [side, setSide] = useState<'front' | 'back'>('front');

  const fullName = agent.user.name || 'Agent Name';
  const role = 'Real Estate Agent';
  const phone = agent.phone || '';
  const email = agent.user.email || '';
  const website = agent.websiteUrl || `https://youragent.in/${agent.slug}`;
  const address = [agent.area, agent.city].filter(Boolean).join(', ');

  const width = 1200; // px for high-res export
  const height = 675; // 16:9 similar to reference, fits well on phones too

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    (async () => {
    // helpers
    const brand = '#1d4ed8';
    const accent = '#d12229';
    const drawBadge = (bg: string, label: string, x: number, y: number) => {
      const r = 16;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Inter, ui-sans-serif, system-ui';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + r, y + r + 1);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    };
    const drawIcon = (type: 'phone' | 'mail' | 'link' | 'map', x: number, y: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (type === 'phone') {
        ctx.beginPath();
        ctx.moveTo(8, 2);
        ctx.lineTo(18, 2);
        ctx.quadraticCurveTo(22, 2, 22, 6);
        ctx.lineTo(22, 22);
        ctx.quadraticCurveTo(22, 26, 18, 26);
        ctx.lineTo(8, 26);
        ctx.quadraticCurveTo(4, 26, 4, 22);
        ctx.lineTo(4, 6);
        ctx.quadraticCurveTo(4, 2, 8, 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 22);
        ctx.lineTo(16, 22);
        ctx.stroke();
      } else if (type === 'mail') {
        ctx.beginPath();
        ctx.rect(4, 6, 20, 16);
        ctx.moveTo(4, 8);
        ctx.lineTo(14, 16);
        ctx.lineTo(24, 8);
        ctx.stroke();
      } else if (type === 'link') {
        ctx.beginPath();
        ctx.arc(10, 16, 6, Math.PI * 0.1, Math.PI * 1.1);
        ctx.arc(18, 10, 6, Math.PI * 1.1, Math.PI * 0.1);
        ctx.stroke();
      } else if (type === 'map') {
        ctx.beginPath();
        ctx.moveTo(14, 26);
        ctx.quadraticCurveTo(4, 16, 4, 11);
        ctx.arc(14, 11, 10, Math.PI, 0);
        ctx.quadraticCurveTo(24, 16, 14, 26);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(14, 11, 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Optional: use Figma-exported raster backgrounds if present
    const tryDrawFigmaBackground = async (): Promise<boolean> => {
      if (template !== 'figma' && template !== 'figma2' && template !== 'figma3') return false;
      let base = '/figma';
      if (template === 'figma2') base = '/figma2';
      if (template === 'figma3') base = '/figma3';
      
      // Try conventional names used by exporter
      const candidates = side === 'front'
        ? [`${base}/front.png`, `${base}/figma-front.png`]
        : [`${base}/back.png`, `${base}/figma-back.png`];
      
      // For figma3, try the specific exported filenames
      if (template === 'figma3') {
        const figma3Files = side === 'front' 
          ? [`${base}/a0f4b2bd199423a06189a33507d7c05e8bb5ca9d.png`]
          : [`${base}/4a49e56eaf5518a6d2f4b9854ed35ea269e1cc8e.png`];
        candidates.unshift(...figma3Files);
      }
      
      for (const path of candidates) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await new Promise<boolean>((resolve) => {
          const bg = new window.Image();
          bg.crossOrigin = 'anonymous';
          bg.onload = () => {
            const scale = Math.max(width / bg.width, height / bg.height);
            const dw = bg.width * scale;
            const dh = bg.height * scale;
            const dx = (width - dw) / 2;
            const dy = (height - dh) / 2;
            ctx.drawImage(bg, dx, dy, dw, dh);
            resolve(true);
          };
          bg.onerror = () => resolve(false);
          bg.src = path;
        });
        if (ok) return true;
      }
      return false;
    };

    if (side === 'back') {
      // BACK SIDE DESIGNS
      if (template === 'minimal') {
        // minimal back: clean with centered website and thin divider
        const site = website;
        const centerY = height / 2;
        drawIcon('link', width / 2 - 200, centerY - 24, brand);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 64px Inter, ui-sans-serif, system-ui';
        const w = ctx.measureText(site).width;
        ctx.fillText(site, (width - w) / 2 + 20, centerY + 4);
        ctx.strokeStyle = brand;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height / 2 + 30);
        ctx.lineTo(width * 0.8, height / 2 + 30);
        ctx.stroke();
      } else if (template === 'bold') {
        // bold back: red band top, centered web badge and site
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, width, Math.floor(height * 0.6));
        // circular web badge
        const bx = width / 2;
        const by = height * 0.35;
        ctx.beginPath();
        ctx.arc(bx, by, 60, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        drawIcon('link', bx - 12, by - 12, accent);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        // website centered
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 64px Inter, ui-sans-serif, system-ui';
        const w = ctx.measureText(website).width;
        ctx.fillText(website, (width - w) / 2, height * 0.8);
      } else if (template === 'figma2') {
        const usedRaster = await tryDrawFigmaBackground();
        if (usedRaster) { setIsRendering(false); return; }
        
        // Figma 2 back - exact colors and positioning from Figma
        // Base dimensions from Figma: 336x192
        const baseW = 336, baseH = 192;
        const scale = Math.min(width / baseW, height / baseH);
        const offsetX = (width - baseW * scale) / 2;
        const offsetY = (height - baseH * scale) / 2;
        
        // Navy blue background (exact color from Figma: #1c2f56)
        ctx.fillStyle = '#1c2f56';
        ctx.fillRect(0, 0, width, height);
        
        // Load and draw corner shapes
        try {
          // Top left gold corner shape (Shape 2)
          const shape2Img = new window.Image();
          await new Promise<void>((resolve, reject) => {
            shape2Img.onload = () => {
              ctx.drawImage(shape2Img, offsetX, offsetY, 50 * scale, 50 * scale);
              resolve();
            };
            shape2Img.onerror = () => reject();
            shape2Img.src = '/figma2/3a46708dfe13a965b289f3c32a3d2a2f71e20af1.svg';
          });
          
          // Bottom right gold corner shape (Shape 1)
          const shape1Img = new window.Image();
          await new Promise<void>((resolve, reject) => {
            shape1Img.onload = () => {
              ctx.drawImage(shape1Img, offsetX + 286 * scale, offsetY + 142 * scale, 50 * scale, 50 * scale);
              resolve();
            };
            shape1Img.onerror = () => reject();
            shape1Img.src = '/figma2/163ebf3f6c1c8ff7c6a3774f99e2d2affcfcfaea.svg';
          });
        } catch {
          // Fallback: draw gold corner shapes manually
          ctx.fillStyle = '#dec364';
          
          // Top left triangle
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY);
          ctx.lineTo(offsetX + 50 * scale, offsetY);
          ctx.lineTo(offsetX, offsetY + 50 * scale);
          ctx.closePath();
          ctx.fill();
          
          // Bottom right triangle
          ctx.beginPath();
          ctx.moveTo(offsetX + 286 * scale, offsetY + 192 * scale);
          ctx.lineTo(offsetX + 336 * scale, offsetY + 192 * scale);
          ctx.lineTo(offsetX + 336 * scale, offsetY + 142 * scale);
          ctx.closePath();
          ctx.fill();
        }
        
        // Load and draw company logo and name
        try {
          // Company logo (30x30 at position 153, 63)
          const logoImg = new window.Image();
          await new Promise<void>((resolve, reject) => {
            logoImg.onload = () => {
              ctx.drawImage(logoImg, 
                offsetX + 153 * scale, 
                offsetY + 63 * scale, 
                30 * scale, 
                30 * scale
              );
              resolve();
            };
            logoImg.onerror = () => reject();
            logoImg.src = '/figma2/9ef67f6586da39f25f321819f775532aeba5db3c.svg';
          });
          
          // Company name text (155.605x25.664 at position 90, 103)
          const nameImg = new window.Image();
          await new Promise<void>((resolve, reject) => {
            nameImg.onload = () => {
              ctx.drawImage(nameImg, 
                offsetX + 90 * scale, 
                offsetY + 103 * scale, 
                155.605 * scale, 
                25.664 * scale
              );
              resolve();
            };
            nameImg.onerror = () => reject();
            nameImg.src = '/figma2/326cc85ef300273d0c95fd6667066e8b6c8dfeb3.svg';
          });
        } catch {
          // Fallback: draw company branding manually
          const centerX = offsetX + (336 * scale) / 2;
          const centerY = offsetY + (192 * scale) / 2;
          const logoRadius = 15 * scale;
          
          // Company logo circle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(centerX, centerY - 10 * scale, logoRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Company name in gold
          ctx.fillStyle = '#dec364';
          ctx.font = `600 ${12 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
          const companyText = "COMPANY NAME";
          const companyWidth = ctx.measureText(companyText).width;
          ctx.fillText(companyText, centerX - companyWidth / 2, centerY + 20 * scale);
          
          // Tagline
          ctx.font = `400 ${8 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
          const tagline = "TAG LINE GOES HERE";
          const taglineWidth = ctx.measureText(tagline).width;
          ctx.fillText(tagline, centerX - taglineWidth / 2, centerY + 35 * scale);
        }
        
        setIsRendering(false);
      } else {
        const usedRaster = await tryDrawFigmaBackground();
        if (usedRaster) { setIsRendering(false); return; }
        // figma back per provided specs (base: 336x192)
        const bw = 336, bh = 192;
        const s = Math.min(width / bw, height / bh);
        const ox = (width - bw * s) / 2;
        const oy = (height - bh * s) / 2;

        const map = (x: number, y: number, w?: number, h?: number) => ({
          x: ox + x * s,
          y: oy + y * s,
          w: (w ?? 0) * s,
          h: (h ?? 0) * s,
        });

        // Bars at top-right of back
        ctx.fillStyle = '#2B3448';
        let r = map(289, 0, 47, 28); ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = '#FE8B10';
        r = map(327, 24, 9, 15); ctx.fillRect(r.x, r.y, r.w, r.h);

        // Bars bottom-left
        ctx.fillStyle = '#2B3448';
        r = map(0, 164, 47, 28); ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = '#FE8B10';
        r = map(0, 153, 9, 15); ctx.fillRect(r.x, r.y, r.w, r.h);

        // Large left shape
        ctx.fillStyle = '#0A233F';
        r = map(0, 38, 174, 112); ctx.fillRect(r.x, r.y, r.w, r.h);

        // Company name & logo placeholder (white blocks)
        // Logo square
        ctx.fillStyle = '#FFFFFF';
        r = map(72, 67, 30, 30); ctx.fillRect(r.x, r.y, r.w, r.h);
        // Company text blocks
        r = map(37, 103, 100.26, 8.97); ctx.fillRect(r.x, r.y, r.w, r.h);
        r = map(37, 116.97, 60.99, 4.5); ctx.fillRect(r.x, r.y, r.w, r.h);

        // Website bars at right (dark with orange cap)
        ctx.fillStyle = '#0A233F';
        r = map(235, 123, 64, 10); ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = '#FE8B10';
        r = map(235, 123, 25, 10); ctx.fillRect(r.x, r.y, r.w, r.h);

        // QR placeholder at (242,58) size 50 with simple pattern
        r = map(242, 58, 50, 50);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#0A233F';
        ctx.strokeRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = '#000000';
        const cell = (r.w - 5.67 * s) / 25; // approximate 25x25 grid inside padding
        const pad = 2.84 * s;
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if ((i * 7 + j * 11) % 9 === 0) {
              ctx.fillRect(r.x + pad + j * cell, r.y + pad + i * cell, cell * 0.8, cell * 0.8);
            }
          }
        }
      }
      setIsRendering(false);
      return;
    }

    if (template === 'minimal') {
      // Minimal Blue Waves (light, no gradients)
      const drawWave = (color: string, y: number, h: number) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.25, y - h, width * 0.5, y + h, width, y - h * 0.4);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      };

      drawWave('#0b5ed7', height * 0.72, 140);
      drawWave('#0a58ca', height * 0.82, 120);
      drawWave('#0d6efd', height * 0.9, 100);

      // Left text block
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 72px Inter, ui-sans-serif, system-ui';
      ctx.fillText(fullName, 80, 150);

      ctx.fillStyle = '#334155';
      ctx.font = '36px Inter, ui-sans-serif, system-ui';
      ctx.fillText(role, 80, 200);

      // Divider line
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(80, 220);
      ctx.lineTo(220, 220);
      ctx.stroke();

      // Contact info with icons
      ctx.fillStyle = '#0f172a';
      ctx.font = '32px Inter, ui-sans-serif, system-ui';
      let y = 300;
      const lineGap = 56;
      if (phone) { drawIcon('phone', 90, y - 26, brand); ctx.fillText(phone, 130, y); y += lineGap; }
      if (email) { drawIcon('mail', 90, y - 26, brand); ctx.fillText(email, 130, y); y += lineGap; }
      if (website) { drawIcon('link', 90, y - 26, brand); ctx.fillText(website, 130, y); y += lineGap; }
      if (address) { drawIcon('map', 90, y - 26, brand); ctx.fillText(address, 130, y); y += lineGap; }

      // Right profile photo circle
      const cx = width * 0.72;
      const cy = height * 0.36;
      const rOuter = 170;
      const rInner = 150;

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();

      // Inner ring background
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw profile image clipped to inner circle
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rInner - 6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const iw = img.width; const ih = img.height;
        const scale = Math.max((rInner * 2) / iw, (rInner * 2) / ih);
        const dw = iw * scale; const dh = ih * scale;
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
        ctx.restore();
        setIsRendering(false);
      };
      img.onerror = () => setIsRendering(false);
      img.src = agent.profilePhotoUrl || '/images/Your-Agent-Logo.png';
    } else if (template === 'bold') {
      // Bold Card (inspired by provided ref) — adapted to light mode, no gradients [[memory:5238803]] [[memory:5340956]]
      // Red header band
      ctx.fillStyle = '#d12229';
      ctx.fillRect(0, 0, width, Math.floor(height * 0.35));

      // Avatar overlapping header
      const cx = width * 0.5;
      const cy = Math.floor(height * 0.35);
      const r = 140;
      // dark outline
      ctx.beginPath();
      ctx.arc(cx, cy, r + 12, 0, Math.PI * 2);
      ctx.fillStyle = '#e5e7eb';
      ctx.fill();
      // inner circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Name & role center
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 64px Inter, ui-sans-serif, system-ui';
      const nameWidth = ctx.measureText(fullName).width;
      ctx.fillText(fullName, (width - nameWidth) / 2, cy + r + 80);

      ctx.fillStyle = '#334155';
      ctx.font = '32px Inter, ui-sans-serif, system-ui';
      const roleWidth = ctx.measureText(role).width;
      ctx.fillText(role, (width - roleWidth) / 2, cy + r + 120);

      // Contact block at bottom with icons
      ctx.fillStyle = '#0f172a';
      ctx.font = '28px Inter, ui-sans-serif, system-ui';
      const details: Array<{ icon: 'phone'|'mail'|'link'|'map'; text: string }> = [];
      if (phone) details.push({ icon: 'phone', text: phone });
      if (email) details.push({ icon: 'mail', text: email });
      if (website) details.push({ icon: 'link', text: website });
      if (address) details.push({ icon: 'map', text: address });
      const startY = height - 160;
      const gap = 40;
      details.forEach((item, i) => {
        const tw = ctx.measureText(item.text).width;
        const totalW = tw + 40;
        const tx = (width - totalW) / 2 + 40;
        drawIcon(item.icon, tx - 34, startY + i * gap - 26, accent);
        ctx.fillText(item.text, tx, startY + i * gap);
      });

      // Profile image draw
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const iw = img.width; const ih = img.height;
        const scale = Math.max((r * 2) / iw, (r * 2) / ih);
        const dw = iw * scale; const dh = ih * scale;
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
        ctx.restore();
        setIsRendering(false);
      };
      img.onerror = () => setIsRendering(false);
      img.src = agent.profilePhotoUrl || '/images/Your-Agent-Logo.png';
    } else if ((template as string) === 'figma3') {
      const usedRaster = await tryDrawFigmaBackground();
      if (usedRaster) {
        // Overlay agent details on the Figma 3 background image
        // Background image dimensions: 1200x776 (from Figma)
        const bgWidth = 1200, bgHeight = 776;
        const scale = Math.min(width / bgWidth, height / bgHeight);
        const offsetX = (width - bgWidth * scale) / 2;
        const offsetY = (height - bgHeight * scale) / 2;
        
        // Overlay agent information on the design
        // Name (large, prominent position)
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(48 * scale)}px Inter, ui-sans-serif, system-ui`;
        ctx.fillText(fullName.toUpperCase(), offsetX + 60 * scale, offsetY + 300 * scale);
        
        // Role/Title
        ctx.font = `${Math.floor(24 * scale)}px Inter, ui-sans-serif, system-ui`;
        ctx.fillText(role.toUpperCase(), offsetX + 60 * scale, offsetY + 340 * scale);
        
        // Contact details
        ctx.font = `${Math.floor(18 * scale)}px Inter, ui-sans-serif, system-ui`;
        let contactY = offsetY + 420 * scale;
        const lineHeight = 30 * scale;
        
        if (phone) {
          ctx.fillText(`📞 ${phone}`, offsetX + 60 * scale, contactY);
          contactY += lineHeight;
        }
        if (email) {
          ctx.fillText(`✉️ ${email}`, offsetX + 60 * scale, contactY);
          contactY += lineHeight;
        }
        if (website) {
          ctx.fillText(`🌐 ${website}`, offsetX + 60 * scale, contactY);
          contactY += lineHeight;
        }
        if (address) {
          ctx.fillText(`📍 ${address}`, offsetX + 60 * scale, contactY);
        }
        
        setIsRendering(false);
        return;
      }
      // Fallback if image fails to load - basic design
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Inter, ui-sans-serif, system-ui';
      const nameWidth = ctx.measureText(fullName).width;
      ctx.fillText(fullName, (width - nameWidth) / 2, height * 0.5);
      setIsRendering(false);
    } else if (template === 'figma3') {
        const usedRaster = await tryDrawFigmaBackground();
        if (usedRaster) {
          // Overlay agent details on the Figma 3 back background image
          // Background image dimensions: 1200x776 (from Figma)
          const bgWidth = 1200, bgHeight = 776;
          const scale = Math.min(width / bgWidth, height / bgHeight);
          const offsetX = (width - bgWidth * scale) / 2;
          const offsetY = (height - bgHeight * scale) / 2;
          
          // Center website and company info on back side
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(36 * scale)}px Inter, ui-sans-serif, system-ui`;
          const websiteWidth = ctx.measureText(website).width;
          ctx.fillText(website, offsetX + (bgWidth * scale - websiteWidth) / 2, offsetY + 350 * scale);
          
          // Company tagline
          ctx.font = `${Math.floor(24 * scale)}px Inter, ui-sans-serif, system-ui`;
          const tagline = "REAL ESTATE SOLUTIONS";
          const taglineWidth = ctx.measureText(tagline).width;
          ctx.fillText(tagline, offsetX + (bgWidth * scale - taglineWidth) / 2, offsetY + 400 * scale);
          
          // QR code placeholder or additional contact info
          ctx.font = `${Math.floor(18 * scale)}px Inter, ui-sans-serif, system-ui`;
          const qrText = "Scan for digital card";
          const qrWidth = ctx.measureText(qrText).width;
          ctx.fillText(qrText, offsetX + (bgWidth * scale - qrWidth) / 2, offsetY + 500 * scale);
          
          setIsRendering(false);
          return;
        }
        // Fallback if image fails to load
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Inter, ui-sans-serif, system-ui';
        const fallbackText = website || 'youragent.in';
        const websiteWidth = ctx.measureText(fallbackText).width;
        ctx.fillText(fallbackText, (width - websiteWidth) / 2, height * 0.5);
        setIsRendering(false);
      } else if (template === 'figma2') {
        const usedRaster = await tryDrawFigmaBackground();
      if (usedRaster) { setIsRendering(false); return; }
      
      // Figma 2 template front - exact colors and positioning from Figma
      // Base dimensions from Figma: 336x192
      const baseW = 336, baseH = 192;
      const scale = Math.min(width / baseW, height / baseH);
      const offsetX = (width - baseW * scale) / 2;
      const offsetY = (height - baseH * scale) / 2;
      
      // White background (from Figma spec)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Load and draw the shape background (dark curved shape on left)
      try {
        const shapeImg = new window.Image();
        await new Promise<void>((resolve, reject) => {
          shapeImg.onload = () => {
            // Draw shape at exact position and size from Figma
            ctx.drawImage(shapeImg, offsetX, offsetY, 233 * scale, 192 * scale);
            resolve();
          };
          shapeImg.onerror = () => reject();
          shapeImg.src = '/figma2/67b7b0b3b26c1a2cde577e5a000a810f64d41440.svg';
        });
      } catch {
        // Fallback: draw dark curved shape manually
        ctx.fillStyle = '#1c2f56';
        ctx.beginPath();
        ctx.ellipse(offsetX + 100 * scale, offsetY + 96 * scale, 150 * scale, 120 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Name in gold (Figma position: left 25px, top 25px) with exact color #dec364
      ctx.fillStyle = '#dec364';
      ctx.font = `600 ${14 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
      ctx.fillText(fullName.toUpperCase(), offsetX + 25 * scale, offsetY + (25 + 14) * scale);
      
      // Role in white (Figma position: left 42px, top 44px)
      ctx.fillStyle = '#ffffff';
      ctx.font = `500 ${8 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
      ctx.fillText(role.toUpperCase(), offsetX + 42 * scale, offsetY + (44 + 8) * scale);
      
      // Contact details with gold icons (starting at left 25px, top 117px)
      const contactStartX = offsetX + 25 * scale;
      const contactStartY = offsetY + 117 * scale;
      const iconSize = 10 * scale;
      const textOffset = 15 * scale;
      const lineHeight = 16 * scale;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `400 ${8 * scale}px Roboto, Inter, ui-sans-serif, system-ui`;
      
      let currentY = contactStartY;
      if (phone) {
        // Gold phone icon background
        ctx.fillStyle = '#dec364';
        ctx.fillRect(contactStartX, currentY, iconSize, iconSize);
        
        // Phone text in white
        ctx.fillStyle = '#ffffff';
        ctx.fillText(phone, contactStartX + textOffset, currentY + 8 * scale);
        currentY += lineHeight;
      }
      
      if (email) {
        // Gold email icon background
        ctx.fillStyle = '#dec364';
        ctx.fillRect(contactStartX, currentY, iconSize, iconSize);
        
        // Email text in white
        ctx.fillStyle = '#ffffff';
        ctx.fillText(email, contactStartX + textOffset, currentY + 8 * scale);
        currentY += lineHeight;
      }
      
      if (address) {
        // Gold location icon background
        ctx.fillStyle = '#dec364';
        ctx.fillRect(contactStartX, currentY, iconSize, iconSize);
        
        // Address text in white (split into lines as in Figma)
        ctx.fillStyle = '#ffffff';
        ctx.fillText(address, contactStartX + textOffset, currentY + 8 * scale);
      }
      
      // Company logo and name on the right side (Figma position: left 205.53px, top 68px)
      try {
        const companyImg = new window.Image();
        await new Promise<void>((resolve, reject) => {
          companyImg.onload = () => {
            ctx.drawImage(companyImg, 
              offsetX + 205.53 * scale, 
              offsetY + 68 * scale, 
              105.291 * scale, 
              56.392 * scale
            );
            resolve();
          };
          companyImg.onerror = () => reject();
          companyImg.src = '/figma2/04f9b1a5291179418b3229cab9ebc67ddd659b78.svg';
        });
      } catch {
        // Fallback: draw company branding manually
        const logoX = offsetX + 258 * scale;
        const logoY = offsetY + 96 * scale;
        const logoRadius = 15 * scale;
        
        // White circle for logo
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(logoX, logoY, logoRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Company name in gold below
        ctx.fillStyle = '#dec364';
        ctx.font = `600 ${10 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
        const companyText = "COMPANY NAME";
        const companyWidth = ctx.measureText(companyText).width;
        ctx.fillText(companyText, logoX - companyWidth / 2, logoY + logoRadius + 15 * scale);
        
        // Tagline
        ctx.font = `400 ${6 * scale}px Montserrat, Inter, ui-sans-serif, system-ui`;
        const tagline = "TAG LINE GOES HERE";
        const taglineWidth = ctx.measureText(tagline).width;
        ctx.fillText(tagline, logoX - taglineWidth / 2, logoY + logoRadius + 25 * scale);
      }
      
      setIsRendering(false);
    } else {
      const usedRaster = await tryDrawFigmaBackground();
      if (usedRaster) {
        // Overlay dynamic texts in white or dark based on expected contrast
        const bw = 336, bh = 192;
        const s = Math.min(width / bw, height / bh);
        const ox = (width - bw * s) / 2;
        const oy = (height - bh * s) / 2;
        // Name/role (approx positions from spec)
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${14 * s}px Inter, ui-sans-serif, system-ui`;
        ctx.fillText(fullName, ox + 20 * s, oy + 91 * s);
        ctx.font = `${8 * s}px Inter, ui-sans-serif, system-ui`;
        ctx.fillText(role, ox + 20 * s, oy + 106 * s);
        // Contact in white on dark block
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${8 * s}px Inter, ui-sans-serif, system-ui`;
        const txX = bw * 0.622, iconX = bw * 0.5774;
        const yPhone = bh * 0.3698, yEmail = bh * 0.4479, yAddr = bh * 0.526;
        if (phone) { drawIcon('phone', ox + iconX * s, oy + yPhone * s - 12 * s, '#FFFFFF'); ctx.fillText(phone, ox + txX * s, oy + yPhone * s); }
        if (email) { drawIcon('mail', ox + iconX * s, oy + yEmail * s - 12 * s, '#FFFFFF'); ctx.fillText(email, ox + txX * s, oy + yEmail * s); }
        if (website) { drawIcon('link', ox + iconX * s, oy + yAddr * s - 12 * s, '#FFFFFF'); ctx.fillText(website, ox + txX * s, oy + yAddr * s); }
        setIsRendering(false);
        return;
      }
      // Figma template (front) per provided specs (base: 336x192)
      const bw = 336, bh = 192;
      const s = Math.min(width / bw, height / bh);
      const ox = (width - bw * s) / 2;
      const oy = (height - bh * s) / 2;
      const map = (x: number, y: number, w?: number, h?: number) => ({ x: ox + x * s, y: oy + y * s, w: (w ?? 0) * s, h: (h ?? 0) * s });

      // Dark shape on right (Shape 03)
      ctx.fillStyle = '#0A233F';
      let r = map(157, 40, 179.5, 112); ctx.fillRect(r.x, r.y, r.w, r.h);

      // Baseline lines at left
      ctx.strokeStyle = 'rgba(10, 35, 63, 0.75)';
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      let a = map(20, 114); let b = map(121, 114);
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.strokeStyle = '#FE8B10';
      a = map(20, 114); b = map(45, 114);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

      // Corner accent shapes
      ctx.fillStyle = '#2B3448'; r = map(289, 0, 47, 28); ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#FE8B10'; r = map(327, 24, 9, 15); ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#2B3448'; r = map(0, 164, 47, 28); ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#FE8B10'; r = map(0, 153, 9, 15); ctx.fillRect(r.x, r.y, r.w, r.h);

      // Name & Position
      ctx.fillStyle = '#000000';
      ctx.font = `${14 * s}px Inter, ui-sans-serif, system-ui`;
      let m = map(20, 79); ctx.font = `bold ${14 * s}px Inter, ui-sans-serif, system-ui`; ctx.fillText(fullName, m.x, m.y + 12 * s);
      m = map(20, 98); ctx.font = `${8 * s}px Inter, ui-sans-serif, system-ui`; ctx.fillText(role, m.x, m.y + 8 * s);

      // Contact (phone, email, address) inside dark shape (white text)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${8 * s}px Inter, ui-sans-serif, system-ui`;
      // phone at ~ (62.2%, 36.98%) for text, icon at 57.74%
      const txX = bw * 0.622, iconX = bw * 0.5774;
      const yPhone = bh * 0.3698, yEmail = bh * 0.4479, yAddr = bh * 0.526;
      drawIcon('phone', ox + iconX * s, oy + yPhone * s - 12 * s, '#FFFFFF');
      if (phone) ctx.fillText(phone, ox + txX * s, oy + yPhone * s);
      drawIcon('mail', ox + iconX * s, oy + yEmail * s - 12 * s, '#FFFFFF');
      if (email) ctx.fillText(email, ox + txX * s, oy + yEmail * s);
      drawIcon('link', ox + iconX * s, oy + yAddr * s - 12 * s, '#FFFFFF');
      const siteText = website;
      ctx.fillText(siteText, ox + txX * s, oy + yAddr * s);
    }
    })();
  }, [agent, template, side]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.slug}-visiting-card-${template}-${side}.png`;
    a.click();
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-950">Preview</h2>
          <p className="text-sm text-zinc-600">Details are taken from your profile. To update, edit your profile.</p>
          <div className="flex gap-2">
            <Button variant={template === 'minimal' ? 'default' : 'outline'} onClick={() => setTemplate('minimal')} className={template === 'minimal' ? 'bg-brand hover:bg-brand-hover text-white' : ''}>Minimal</Button>
            <Button variant={template === 'bold' ? 'default' : 'outline'} onClick={() => setTemplate('bold')} className={template === 'bold' ? 'bg-brand hover:bg-brand-hover text-white' : ''}>Bold</Button>
            <Button variant={template === 'figma' ? 'default' : 'outline'} onClick={() => setTemplate('figma')} className={template === 'figma' ? 'bg-brand hover:bg-brand-hover text-white' : ''}>Figma</Button>
            <Button variant={template === 'figma2' ? 'default' : 'outline'} onClick={() => setTemplate('figma2')} className={template === 'figma2' ? 'bg-brand hover:bg-brand-hover text-white' : ''}>Figma 2</Button>
            <Button variant={template === 'figma3' ? 'default' : 'outline'} onClick={() => setTemplate('figma3')} className={template === 'figma3' ? 'bg-brand hover:bg-brand-hover text-white' : ''}>Figma 3</Button>
          </div>
          <div className="flex gap-2">
            <Button variant={side === 'front' ? 'default' : 'outline'} onClick={() => setSide('front')} className={side === 'front' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : ''}>Front</Button>
            <Button variant={side === 'back' ? 'default' : 'outline'} onClick={() => setSide('back')} className={side === 'back' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : ''}>Back</Button>
          </div>
          <div className="rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50">
            <canvas ref={canvasRef} className="w-full h-auto" style={{ maxWidth: '100%' }} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={downloadPng} disabled={isRendering} className="bg-brand hover:bg-brand-hover text-white">
              {isRendering ? 'Rendering…' : `Download ${side.toUpperCase()} PNG`}
            </Button>
            <Button onClick={() => { const prev = side; setSide('front'); setTimeout(() => { downloadPng(); setSide('back'); setTimeout(() => { downloadPng(); setSide(prev); }, 250); }, 250); }} disabled={isRendering} variant="outline">
              Download Both
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-zinc-900">Included Details</h3>
          <ul className="text-sm text-zinc-700 list-disc pl-5 space-y-1">
            <li>Name: {fullName}</li>
            <li>Role: Real Estate Agent</li>
            {agent.phone && <li>Phone: {agent.phone}</li>}
            {agent.user.email && <li>Email: {agent.user.email}</li>}
            <li>Website: {website}</li>
            {(agent.city || agent.area) && <li>Location: {address}</li>}
          </ul>
          <p className="text-xs text-zinc-500">To change any of these, update them from Profile. This page does not allow edits.</p>
        </div>
      </div>
    </div>
  );
}


