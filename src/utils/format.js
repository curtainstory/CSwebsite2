export const WHATSAPP_NUMBER = '919999999999';

export const buildWhatsAppLink = (text) => 
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text || '')}`;

export const formatINR = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  } catch {
    return '₹' + Number(value).toLocaleString();
  }
};

export const UNITS = [
  { id: 'inch', label: 'Inches', toMeter: 0.0254, toFeet: 0.0833 },
  { id: 'feet', label: 'Feet', toMeter: 0.3048, toFeet: 1 },
  { id: 'meter', label: 'Meters', toMeter: 1, toFeet: 3.28084 },
  { id: 'cm', label: 'CM', toMeter: 0.01, toFeet: 0.0328 },
];
