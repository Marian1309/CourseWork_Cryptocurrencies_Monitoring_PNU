const formatToDollar = (amount: number) => {
  if (amount >= 1e12) {
    return `$${(amount / 1e12).toFixed(2)} trln`;
  } else if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(2)} bln`;
  } else if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(2)} mln`;
  } else if (amount >= 1e3) {
    return `$${(amount / 1e3).toFixed(2)}k`;
  } else {
    return `$${amount}`;
  }
};

export default formatToDollar;
