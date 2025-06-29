let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const categorySelect = document.getElementById("categorySelect");

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Populate category dropdowns with unique values
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options
  categorySelect.innerHTML = '<option value="all">All</option>';
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option1 = new Option(cat, cat);
    const option2 = new Option(cat, cat);
    categorySelect.appendChild(option1);
    categoryFilter.appendChild(option2);
  });
}

// ✅ Required function name: filterQuote
function filterQuote() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastSelectedCategory", selectedCategory); // ✅ Save selected category

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes found for this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
  }
}

// ✅ Add a quote and update DOM + storage
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and category.");
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

// ✅ Display random quote from select menu
function displayRandomQuote() {
  const selectedCategory = categorySelect.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerText = `"${random.text}" — [${random.category}]`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// ✅ Export quotes to JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing: " + err.message);
    }
  };

  reader.readAsText(event.target.files[0]);
}

// ✅ Load on page load
window.onload = function () {
  populateCategories();

  // ✅ Restore last selected category
  const lastSelected = localStorage.getItem("lastSelectedCategory");
  if (lastSelected && categoryFilter) {
    categoryFilter.value = lastSelected;
    filterQuote();
  }

  // ✅ Optional: Show last viewed quote
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerText = `"${quote.text}" — [${quote.category}]`;
  }
};

newQuoteBtn.addEventListener("click", displayRandomQuote);
