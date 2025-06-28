// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" },
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

// Function 1: displayRandomQuote (renamed to match check)
function displayRandomQuote() {
  const selectedCategory = categorySelect ? categorySelect.value : "all";
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
}

// Function 2: addQuote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array
  quotes.push({ text: newText, category: newCategory });

  // Update category dropdown if new
  const exists = [...categorySelect.options].some(
    option => option.value.toLowerCase() === newCategory.toLowerCase()
  );

  if (!exists) {
    const newOption = document.createElement("option");
    newOption.value = newCategory;
    newOption.textContent = newCategory;
    categorySelect.appendChild(newOption);
  }

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Init: populate category dropdown
function initCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Event listener for "Show New Quote"
newQuoteBtn.addEventListener("click", displayRandomQuote);

// Init on page load
window.onload = initCategories;

