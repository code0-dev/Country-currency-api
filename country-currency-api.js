const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());

// Rate Limiting: 30 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests. Please try again later.'
}));

// In-memory cache
let cachedCurrencies = null;

const countryCurrency = [
  { country: "Afghanistan", currency: "AFN", symbol: "؋" },
  { country: "Albania", currency: "ALL", symbol: "L" },
  { country: "Algeria", currency: "DZD", symbol: "د.ج" },
  { country: "Andorra", currency: "EUR", symbol: "€" },
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
  { country: "Bhutan", currency: "BTN", symbol: "Nu." },
  { country: "Bolivia", currency: "BOB", symbol: "Bs." },
  { country: "Bosnia and Herzegovina", currency: "BAM", symbol: "KM" },
  { country: "Botswana", currency: "BWP", symbol: "P" },
  { country: "Brazil", currency: "BRL", symbol: "R$" },
  { country: "Brunei", currency: "BND", symbol: "$" },
  { country: "Bulgaria", currency: "BGN", symbol: "лв" },
  { country: "Burundi", currency: "BIF", symbol: "FBu" },
  { country: "Cambodia", currency: "KHR", symbol: "៛" },
  { country: "Cameroon", currency: "XAF", symbol: "FCFA" },
  { country: "Canada", currency: "CAD", symbol: "$" },
  { country: "Chile", currency: "CLP", symbol: "$" },
  { country: "China", currency: "CNY", symbol: "¥" },
  { country: "Colombia", currency: "COP", symbol: "$" },
  { country: "Congo", currency: "CDF", symbol: "FC" },
  { country: "Costa Rica", currency: "CRC", symbol: "₡" },
  { country: "Croatia", currency: "EUR", symbol: "€" },
  { country: "Cuba", currency: "CUP", symbol: "$" },
  { country: "Cyprus", currency: "EUR", symbol: "€" },
  { country: "Czech Republic", currency: "CZK", symbol: "Kč" },
  { country: "Denmark", currency: "DKK", symbol: "kr" },
  { country: "Djibouti", currency: "DJF", symbol: "Fdj" },
  { country: "Dominican Republic", currency: "DOP", symbol: "$" },
  { country: "Ecuador", currency: "USD", symbol: "$" },
  { country: "Egypt", currency: "EGP", symbol: "£" },
  { country: "El Salvador", currency: "USD", symbol: "$" },
  { country: "Estonia", currency: "EUR", symbol: "€" },
  { country: "Ethiopia", currency: "ETB", symbol: "Br" },
  { country: "Finland", currency: "EUR", symbol: "€" },
  { country: "France", currency: "EUR", symbol: "€" },
  { country: "Gabon", currency: "XAF", symbol: "FCFA" },
  { country: "Georgia", currency: "GEL", symbol: "₾" },
  { country: "Germany", currency: "EUR", symbol: "€" },
  { country: "Ghana", currency: "GHS", symbol: "₵" },
  { country: "Greece", currency: "EUR", symbol: "€" },
  { country: "Guatemala", currency: "GTQ", symbol: "Q" },
  { country: "Honduras", currency: "HNL", symbol: "L" },
  { country: "Hungary", currency: "HUF", symbol: "Ft" },
  { country: "Iceland", currency: "ISK", symbol: "kr" },
  { country: "India", currency: "INR", symbol: "₹" },
  { country: "Indonesia", currency: "IDR", symbol: "Rp" },
  { country: "Iran", currency: "IRR", symbol: "﷼" },
  { country: "Iraq", currency: "IQD", symbol: "ع.د" },
  { country: "Ireland", currency: "EUR", symbol: "€" },
  { country: "Israel", currency: "ILS", symbol: "₪" },
  { country: "Italy", currency: "EUR", symbol: "€" },
  { country: "Jamaica", currency: "JMD", symbol: "J$" },
  { country: "Japan", currency: "JPY", symbol: "¥" },
  { country: "Jordan", currency: "JOD", symbol: "د.ا" },
  { country: "Kazakhstan", currency: "KZT", symbol: "₸" },
  { country: "Kenya", currency: "KES", symbol: "KSh" },
  { country: "Kuwait", currency: "KWD", symbol: "د.ك" },
  { country: "Laos", currency: "LAK", symbol: "₭" },
  { country: "Latvia", currency: "EUR", symbol: "€" },
  { country: "Lebanon", currency: "LBP", symbol: "ل.ل" },
  { country: "Lesotho", currency: "LSL", symbol: "L" },
  { country: "Liberia", currency: "LRD", symbol: "$" },
  { country: "Libya", currency: "LYD", symbol: "ل.د" },
  { country: "Lithuania", currency: "EUR", symbol: "€" },
  { country: "Luxembourg", currency: "EUR", symbol: "€" },
  { country: "Madagascar", currency: "MGA", symbol: "Ar" },
  { country: "Malawi", currency: "MWK", symbol: "MK" },
  { country: "Malaysia", currency: "MYR", symbol: "RM" },
  { country: "Maldives", currency: "MVR", symbol: "Rf" },
  { country: "Mali", currency: "XOF", symbol: "CFA" },
  { country: "Mauritania", currency: "MRU", symbol: "UM" },
  { country: "Mexico", currency: "MXN", symbol: "$" },
  { country: "Moldova", currency: "MDL", symbol: "L" },
  { country: "Monaco", currency: "EUR", symbol: "€" },
  { country: "Mongolia", currency: "MNT", symbol: "₮" },
  { country: "Morocco", currency: "MAD", symbol: "د.م." },
  { country: "Mozambique", currency: "MZN", symbol: "MT" },
  { country: "Namibia", currency: "NAD", symbol: "$" },
  { country: "Nepal", currency: "NPR", symbol: "₨" },
  { country: "Netherlands", currency: "EUR", symbol: "€" },
  { country: "New Zealand", currency: "NZD", symbol: "$" },
  { country: "Nicaragua", currency: "NIO", symbol: "C$" },
  { country: "Niger", currency: "XOF", symbol: "CFA" },
  { country: "Nigeria", currency: "NGN", symbol: "₦" },
  { country: "North Korea", currency: "KPW", symbol: "₩" },
  { country: "Norway", currency: "NOK", symbol: "kr" },
  { country: "Oman", currency: "OMR", symbol: "ر.ع." },
  { country: "Pakistan", currency: "PKR", symbol: "₨" },
  { country: "Panama", currency: "PAB", symbol: "B/." },
  { country: "Paraguay", currency: "PYG", symbol: "₲" },
  { country: "Peru", currency: "PEN", symbol: "S/." },
  { country: "Philippines", currency: "PHP", symbol: "₱" },
  { country: "Poland", currency: "PLN", symbol: "zł" },
  { country: "Portugal", currency: "EUR", symbol: "€" },
  { country: "Qatar", currency: "QAR", symbol: "ر.ق" },
  { country: "Rwanda", currency: "RWF", symbol: "FRw" },
  { country: "Russia", currency: "RUB", symbol: "₽" },
  { country: "Saudi Arabia", currency: "SAR", symbol: "ر.س" },
  { country: "Senegal", currency: "XOF", symbol: "CFA" },
  { country: "Singapore", currency: "SGD", symbol: "$" },
  { country: "Slovakia", currency: "EUR", symbol: "€" },
  { country: "Slovenia", currency: "EUR", symbol: "€" },
  { country: "Somalia", currency: "SOS", symbol: "Sh" },
  { country: "South Africa", currency: "ZAR", symbol: "R" },
  { country: "South Korea", currency: "KRW", symbol: "₩" },
  { country: "Spain", currency: "EUR", symbol: "€" },
  { country: "Sri Lanka", currency: "LKR", symbol: "Rs" },
  { country: "Sudan", currency: "SDG", symbol: "ج.س." },
  { country: "Sweden", currency: "SEK", symbol: "kr" },
  { country: "Switzerland", currency: "CHF", symbol: "Fr" },
  { country: "Syria", currency: "SYP", symbol: "£" },
  { country: "Tanzania", currency: "TZS", symbol: "Sh" },
  { country: "Thailand", currency: "THB", symbol: "฿" },
  { country: "Tunisia", currency: "TND", symbol: "د.ت" },
  { country: "Turkey", currency: "TRY", symbol: "₺" },
  { country: "Uganda", currency: "UGX", symbol: "Sh" },
  { country: "Ukraine", currency: "UAH", symbol: "₴" },
  { country: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { country: "United Kingdom", currency: "GBP", symbol: "£" },
  { country: "United States", currency: "USD", symbol: "$" },
  { country: "Uruguay", currency: "UYU", symbol: "$U" },
  { country: "Venezuela", currency: "VES", symbol: "Bs." },
  { country: "Vietnam", currency: "VND", symbol: "₫" },
  { country: "Yemen", currency: "YER", symbol: "﷼" },
  { country: "Zambia", currency: "ZMW", symbol: "ZK" },
  { country: "Zimbabwe", currency: "ZWL", symbol: "$" }
];

app.get('/api/currencies', (req, res) => {
  if (cachedCurrencies) return res.json(cachedCurrencies);
  cachedCurrencies = countryCurrency;
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