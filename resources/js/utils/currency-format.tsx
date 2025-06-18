export const formatRupiah = (value: number | string) => {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};


