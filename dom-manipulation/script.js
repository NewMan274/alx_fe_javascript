const display = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("newQuote");
const quoteText = document.getElementById("newQuoteText");
const quoteCategory = document.getElementById("newQuoteCategory");

let quoteArray = [
  {text: "I am strong!", category: "motivational"},
  {text: "We live to die", category: "unknown"},
  {text: "This is a text", category: "new"},
  {text: "olamide baddo", category: "ybnl"},
  {text: "ololade mi asake", category: "giran"},
  {text: "work your vision to reality", category: "old"},
  {text: "the end is near", category: "scary"},
];

function showRandomQuote() {
  const choosenQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];

  display.innerHTML = `
    <p><strong>${choosenQuote.text}</strong></p>
    <p>Category: ${choosenQuote.category}</p>
  `;
}

addQuoteBtn.addEventListener("click", showRandomQuote);

function createAddQuoteForm() {
  let magic = document.createElement("div")

  magic.innerHTML = `
    <input placeholder="Enter a new quote" />
    <input placeholder="Enter a quote category" />
  `
  appendChild()
}

function addQuote() {
  const newQuote = quoteText.value.trim();
  const newCategory = quoteCategory.value.trim();

  let quoteCreated = {text:"", category:""}

  quoteCreated.text = newQuote;
  quoteCreated.category = newCategory;

  quoteArray.push(quoteCreated);

  quoteText.value = "";
  quoteCategory.value = "";
}

createAddQuoteForm();
