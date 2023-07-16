

export function formatRupiah(number: number | bigint){
    const formatter = new Intl.NumberFormat('id-ID', {
    //   style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
  
    return formatter.format(number);
}

export function currencyToInteger(currency: string): number {
  // Remove any non-numeric characters from the currency string
  const numericString = currency.replace(/[^0-9.-]/g, '');

  // Parse the numeric string to a floating-point number
  const floatValue = parseFloat(numericString);

  // Convert the floating-point number to an integer
  const integerValue = Math.round(floatValue);

  return integerValue;
}