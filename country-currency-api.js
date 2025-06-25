const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const countryCurrency = [
  { country: "Afghanistan", currency: "AFN", symbol: "؋" },
  { country: "Albania", currency: "ALL", symbol: "L" },
  { country: "Algeria", currency: "DZD", symbol: "د.ج" },
  { country: "Angola", currency: "AOA", symbol: "Kz" },
  { country: "Argentina", currency: "ARS", symbol: "$" },
  { country: "Armenia", currency: "AMD", symbol: "֏" },
  { country: "Australia", currency: "AUD", symbol: "$" },
  { country: "Austria", currency: "EUR", symbol: "€" },
  { country: "Azerbaijan", currency: "AZN", symbol: "₼" },
  { country: "Bahamas", currency: "BSD", symbol: "$" },
  { country: "Bahrain", currency: "BHD", symbol: ".د.ب" },
  { country: "Bangladesh", currency: "BDT", symbol: "৳" },
  { country: "Belarus", currency: "BYN", symbol: "Br" },
  { country: "Belgium", currency: "EUR", symbol: "€" },
  { country: "Belize", currency: "BZD", symbol: "$" },
  { country: "Benin", currency: "XOF", symbol: "CFA" },
  { country: "Bhutan", currency: "BTN", symbol: "Nu." },
  { country: "Bolivia", currency: "BOB", symbol: "Bs." },
  { country: "Bosnia and Herzegovina", currency: "BAM", symbol: "KM" },
  { country: "Botswana", currency: "BWP", symbol: "P" },
  { country: "Brazil", currency: "BRL", symbol: "R$" },
  { country: "Brunei", currency: "BND", symbol: "$" },
  { country: "Bulgaria", currency: "BGN", symbol: "лв" },
  { country: "Burkina Faso", currency: "XOF", symbol: "CFA" },
  { country: "Burundi", currency: "BIF", symbol: "FBu" },
  { country: "Cambodia", currency: "KHR", symbol: "៛" },
  { country: "Cameroon", currency: "XAF", symbol: "FCFA" },
  { country: "Canada", currency: "CAD", symbol: "$" },
  { country: "Cape Verde", currency: "CVE", symbol: "$" },
  { country: "Central African Republic", currency: "XAF", symbol: "FCFA" },
  { country: "Chad", currency: "XAF", symbol: "FCFA" },
  { country: "Chile", currency: "CLP", symbol: "$" },
  { country: "China", currency: "CNY", symbol: "¥" },
  { country: "Colombia", currency: "COP", symbol: "$" },
  { country: "Comoros", currency: "KMF", symbol: "CF" },
  { country: "Costa Rica", currency: "CRC", symbol: "₡" },
  { country: "Croatia", currency: "EUR", symbol: "€" },
  { country: "Cuba", currency: "CUP", symbol: "$" },
  { country: "Cyprus", currency: "EUR", symbol: "€" },
  { country: "Czech Republic", currency: "CZK", symbol: "Kč" },
  { country: "Denmark", currency: "DKK", symbol: "kr" },
  { country: "Djibouti", currency: "DJF", symbol: "Fdj" },
  { country: "Dominica", currency: "XCD", symbol: "$" },
  { country: "Dominican Republic", currency: "DOP", symbol: "RD$" },
  { country: "Ecuador", currency: "USD", symbol: "$" },
  { country: "Egypt", currency: "EGP", symbol: "£" },
  { country: "El Salvador", currency: "USD", symbol: "$" },
  { country: "Equatorial Guinea", currency: "XAF", symbol: "FCFA" },
  { country: "Eritrea", currency: "ERN", symbol: "Nfk" },
  { country: "Estonia", currency: "EUR", symbol: "€" },
  { country: "Eswatini", currency: "SZL", symbol: "L" },
  { country: "Ethiopia", currency: "ETB", symbol: "Br" },
  { country: "European Union", currency: "EUR", symbol: "€" },
  { country: "Ghana", currency: "GHS", symbol: "₵" },
  { country: "Hong Kong", currency: "HKD", symbol: "$" },
  { country: "India", currency: "INR", symbol: "₹" },
  { country: "Indonesia", currency: "IDR", symbol: "Rp" },
  { country: "Iran", currency: "IRR", symbol: "﷼" },
  { country: "Japan", currency: "JPY", symbol: "¥" },
  { country: "Kenya", currency: "KES", symbol: "KSh" },
  { country: "Malaysia", currency: "MYR", symbol: "RM" },
  { country: "Mexico", currency: "MXN", symbol: "$" },
  { country: "Morocco", currency: "MAD", symbol: "د.م." },
  { country: "Nepal", currency: "NPR", symbol: "₨" },
  { country: "Netherlands", currency: "EUR", symbol: "€" },
  { country: "New Zealand", currency: "NZD", symbol: "$" },
  { country: "Nigeria", currency: "NGN", symbol: "₦" },
  { country: "Norway", currency: "NOK", symbol: "kr" },
  { country: "Pakistan", currency: "PKR", symbol: "₨" },
  { country: "Philippines", currency: "PHP", symbol: "₱" },
  { country: "Poland", currency: "PLN", symbol: "zł" },
  { country: "Qatar", currency: "QAR", symbol: "﷼" },
  { country: "Russia", currency: "RUB", symbol: "₽" },
  { country: "Saudi Arabia", currency: "SAR", symbol: "﷼" },
  { country: "Singapore", currency: "SGD", symbol: "$" },
  { country: "South Africa", currency: "ZAR", symbol: "R" },
  { country: "South Korea", currency: "KRW", symbol: "₩" },
  { country: "Spain", currency: "EUR", symbol: "€" },
  { country: "Sri Lanka", currency: "LKR", symbol: "Rs" },
  { country: "Sweden", currency: "SEK", symbol: "kr" },
  { country: "Switzerland", currency: "CHF", symbol: "Fr" },
  { country: "Thailand", currency: "THB", symbol: "฿" },
  { country: "Turkey", currency: "TRY", symbol: "₺" },
  { country: "Uganda", currency: "UGX", symbol: "USh" },
  { country: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { country: "United Kingdom", currency: "GBP", symbol: "£" },
  { country: "United States", currency: "USD", symbol: "$" },
  { country: "Vietnam", currency: "VND", symbol: "₫" },
  { country: "Zambia", currency: "ZMW", symbol: "ZK" }
];

app.get('/api/currencies', (req, res) => {
  res.json(countryCurrency);
});

app.get('/api/currencies/:country', (req, res) => {
  const name = req.params.country.toLowerCase();
  const result = countryCurrency.find(
    item => item.country.toLowerCase() === name
  );

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Country not found" });
  }
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});