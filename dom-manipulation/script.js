const display = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("newQuote");
const quoteText = document.getElementById("newQuoteText");
const quoteCategory = document.getElementById("newQuoteCategory");

let quoteArray = [
  {quote: "I am strong!", category: "motivational"},
  {quote: "We live to die", category: "unknown"},
  {quote: "This is a quote", category: "new"},
  {quote: "olamide baddo", category: "ybnl"},
  {quote: "ololade mi asake", category: "giran"},
  {quote: "work your vision to reality", category: "old"},
  {quote: "the end is near", category: "scary"},
];

function showRandomQuote() {
  const choosenQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];

  display.innerHTML = `
    <p><strong>${choosenQuote.quote}</strong></p>
    <p>Category: ${choosenQuote.category}</p>
  `;
}

addQuoteBtn.addEventListener("click", showRandomQuote);

function addQuote() {
  const newQuote = quoteText.value.trim();
  const newCategory = quoteCategory.value.trim();

  let quoteCreated = {quote:"", category:""}

  quoteCreated.quote = newQuote;
  quoteCreated.category = newCategory;

  quoteArray.push(quoteCreated);

  quoteText.value = "";
  quoteCategory.value = "";
}
