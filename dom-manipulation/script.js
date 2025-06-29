// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
];

// Mock server data
let simulatedServerQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Wisdom" },
  { text: "No act of kindness, no matter how small, is ever wasted.", category: "Kindness" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save selected category filter
function saveFilterPreference(category) {
  localStorage.setItem("lastSelectedCategory", category);
}

// Load selected category filter
function loadFilterPreference() {
  return localStorage.getItem("lastSelectedCategory") || "all";
}

// Populate category dropdowns
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear and repopulate categorySelect
  categorySelect.innerHTML = '<option value="all">All</option>';
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const opt1 = new Option(cat, cat);
    const opt2 = new Option(cat, cat);
    categorySelect.appendChild(opt1);
    categoryFilter.appendChild(opt2);
  });
}

// Filter quotes and display one
function filterQuote() {
  const selectedCategory = categoryFilter.value;
  saveFilterPreference(selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes found for this category.";
  } else {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
  }
}

// Show a random quote based on dropdown
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  filterQuote();

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format.");

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };

  reader.readAsText(event.target.files[0]);
}

// Simulate server sync — server wins in conflicts
function syncWithServer() {
  console.log("Syncing with server...");

  setTimeout(() => {
    const localData = JSON.stringify(quotes);
    const serverData = JSON.stringify(simulatedServerQuotes);

    if (localData !== serverData) {
      quotes = [...simulatedServerQuotes];
      saveQuotes();
      populateCategories();
      filterQuote();
      alert("Local data replaced with updated server data due to conflict.");
    } else {
      console.log("Data is in sync.");
    }
  }, 1000);
}

// Push local quotes to server (simulate)
function pushToServer() {
  console.log("Pushing local data to server...");
  simulatedServerQuotes = [...quotes];
  console.log("Quotes pushed to server.");
  alert("Local data pushed to server (simulation).");
}

// Load last quote and filter on page load
window.onload = function () {
  populateCategories();

  const lastFilter = loadFilterPreference();
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuote();
  }

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
  }
};

// Attach event listener for random quote button
newQuoteBtn.addEventListener("click", displayRandomQuote);

// Auto-sync every 15 seconds
setInterval(syncWithServer, 15000);
