const display = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("newQuote");
const quoteText = document.getElementById("newQuoteText");
const quoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importFile");

const defaultArray = [
  {text: "I am strong!", category: "motivational"},
  {text: "We live to die", category: "unknown"},
  {text: "This is a quote", category: "new"},
  {text: "olamide baddo", category: "ybnl"},
  {text: "ololade mi asake", category: "giran"},
  {text: "work your vision to reality", category: "old"},
  {text: "the end is near", category: "scary"},
];

let quoteArray = JSON.parse(localStorage.getItem("quotes")) || defaultArray;

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quoteArray));
}

saveQuotes();

function showRandomQuote() {
  const choosenQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];

  display.innerHTML = `
    <p><strong>${choosenQuote.text}</strong></p>
    <p>Category: ${choosenQuote.category}</p>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(choosenQuote));
}

addQuoteBtn.addEventListener("click", showRandomQuote);

function addQuote() {
  const newQuote = quoteText.value.trim();
  const newCategory = quoteCategory.value.trim();

  let quoteCreated = {text:"", category:""}

  quoteCreated.text = newQuote;
  quoteCreated.category = newCategory;

  quoteArray.push(quoteCreated);

  quoteText.value = "";
  quoteCategory.value = "";

  saveQuotes();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quoteArray, null, w)], {type: "application/json"});
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);