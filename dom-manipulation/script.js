let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect"); // For adding/displaying random quote
const categoryFilter = document.getElementById("categoryFilter"); // For filtering
const importFile = document.getElementById("importFile");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save last filter to localStorage
function saveFilterPreference(category) {
  localStorage.setItem("lastFilter", category);
}

// Load last filter
function loadFilterPreference() {
  return localStorage.getItem("lastFilter") || "all";
}

// Display one random quote from selected category
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote and update UI + storage
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

  populateCategories(); // Update both dropdowns
  filterQuotes();       // Apply filter immediately

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// Populate both dropdowns
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear both selects
  categorySelect.innerHTML = '<option value="all">All</option>';
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option1 = new Option(cat, cat);
    const option2 = new Option(cat, cat);
    categorySelect.appendChild(option1);
    categoryFilter.appendChild(option2);
  });
}

// Filter quotes based on dropdown
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveFilterPreference(selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes match this category.";
  } else {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerText = `"${random.text}" — [${random.category}]`;
  }
}

// Export quotes to JSON
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

// Import quotes from file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON structure");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On page load
window.onload = function () {
  populateCategories();

  const lastFilter = loadFilterPreference();
  categoryFilter.value = lastFilter;
  filterQuotes();

  // Show last viewed quote from sessionStorage if available
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
  }
};

newQuoteBtn.addEventListener("click", displayRandomQuote);
