export function formatCurrency(value?: number, formatted?: string): string {
  if (formatted && formatted.trim() !== '') {
    return formatted;
  }
  if (value && value > 0) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return 'A Consultar';
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('pt-BR').format(val);
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function getHighResImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Data URLs e CDNs de upload direto não necessitam de substituição de query
  if (url.startsWith('data:') || url.includes('ibb.co') || url.includes('postimg') || url.includes('cloudinary')) {
    return url;
  }

  // Upgrade Odoo/eucorretorimoveis images to maximum 1920/Full HD & Ultra HD resolution
  let res = url.replace(/field=image_1024/g, 'field=image_1920');
  res = res.replace(/field=image_512/g, 'field=image_1920');
  res = res.replace(/field=image_256/g, 'field=image_1920');
  res = res.replace(/field=image_128/g, 'field=image_1920');

  // Upgrade Unsplash images to Ultra HD 4K (w=2560 or w=3840 & q=95)
  if (res.includes('images.unsplash.com')) {
    res = res.replace(/w=\d+/g, 'w=2560').replace(/q=\d+/g, 'q=95');
    if (!res.includes('auto=format')) {
      res += (res.includes('?') ? '&' : '?') + 'auto=format&fit=crop&q=95';
    }
  }
  return res;
}

export function getHighResImages(images?: string[]): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=95'];
  }
  const filtered = images
    .map((img) => (typeof img === 'string' ? getHighResImageUrl(img) : ''))
    .filter((img) => typeof img === 'string' && img.trim().length > 0);

  return filtered.length > 0
    ? filtered
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=95'];
}

export function getStatusBadgeColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'Na planta':
      return {
        bg: 'bg-emerald-950/80',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    case 'Em obras':
      return {
        bg: 'bg-amber-950/80',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      };
    case 'Pronto':
      return {
        bg: 'bg-blue-950/80',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
      };
    case 'Loteamento':
      return {
        bg: 'bg-purple-950/80',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
      };
    default:
      return {
        bg: 'bg-neutral-800',
        text: 'text-neutral-300',
        border: 'border-neutral-700',
        dot: 'bg-neutral-400',
      };
  }
}
