
const display = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("newQuote");
const quoteText = document.getElementById("newQuoteText");
const quoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");

const defaultArray = [
  {text: "I am strong!", category: "motivational"},
  {text: "We live to die", category: "unknown"},
  {text: "This is a quote", category: "new"},
  {text: "olamide baddo", category: "ybnl"},
  {text: "do the hard thing!", category: "alx"},
  {text: "ololade mi asake", category: "giran"},
  {text: "work your vision to reality", category: "old"},
  {text: "the end is near!!", category: "scary"},
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

  if(!newQuote || !newCategory) return;

  const quoteCreated = {
    text: newQuote, 
    category: newCategory
  }

  quoteArray.push(quoteCreated);
  saveQuotes();
  sendQuoteToServer(quoteCreated); // Sync to server

  quoteText.value = "";
  quoteCategory.value = "";

  if(![...categoryFilter.options].some(opt => opt.value === newCategory)) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }

  if (categoryFilter.value === newCategory) {
    filterQuotes();
  }
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quoteArray, null, 1)], {type: "application/json"});
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

function populateCategories() {
  const uniqueCategories = [...new Set(quoteArray.map(quote => quote.category))].sort();

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

populateCategories();

const lastCategory = localStorage.getItem("lastSelectedCategory");
if (lastCategory) {
  categoryFilter.value = lastCategory;
  filterQuotes();
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;

  localStorage.setItem("lastSelectedCategory", selectedCategory);

  let filteredQuotes = [];

  if (selectedCategory === "all") {
    filteredQuotes = quoteArray;
  } else {
    filteredQuotes = quoteArray.filter(quote => quote.category === selectedCategory);
  }

  display.innerHTML = "";

  if (filteredQuotes.length === 0) {
    display.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `
      <p><strong>${quote.text}</strong></p>
      <p>Category: ${quote.category}</p>
    `;
    display.appendChild(quoteElement);
  });
};

const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Fetch server quotes
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Simulate conflict resolution: server data takes precedence
    syncQuotes(serverQuotes.slice(0, 10));// Slice to simulate limited real data
  } catch (error) {
    console.error("Failed to fetch server quotes:", error);
  }
}

// Send new quote to server
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    });
    const data = await response.json();
    console.log("Quote synced to server:", data);
  } catch (error) {
    console.error("Failed to sync quote:", error);
  }
}

// Sync with server
function syncQuotes(serverQuotes) {
  let conflictDetected = false;

  serverQuotes.forEach(serverQuote => {
    const existsLocally = quoteArray.some(localQuote => localQuote.text === serverQuote.title && localQuote.category);

    if (!existsLocally) {
      quoteArray.push({
        text: serverQuote.title,
        category: "server"
      });
      conflictDetected = true;
    }
  });

  if (conflictDetected) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("New quotes were fetched and added to your list from the server.")
  }
}

setInterval(fetchQuotesFromServer, 30000);
fetchQuotesFromServer();