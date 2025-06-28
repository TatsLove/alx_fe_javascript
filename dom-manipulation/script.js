// Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "design" },
  { text: "Stay hungry, stay foolish.", category: "motivation" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
let currentCategory = 'all';

// Initialize the application
function init() {
  // Set up event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    showRandomQuote();
  });
  
  // Populate category dropdown
  updateCategoryDropdown();
  
  // Show initial random quote
  showRandomQuote();
}

// Display a random quote
function showRandomQuote() {
  let filteredQuotes = quotes;
  
  if (currentCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `
      <p>No quotes found in this category.</p>
      <p class="quote-meta">Try adding some quotes or selecting a different category.</p>
    `;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p class="quote-meta">Category: ${quote.category}</p>
  `;
}

// Add a new quote to the collection
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (!text || !category) {
    alert('Please enter both quote text and category');
    return;
  }
  
  // Add new quote
  const newQuote = { text, category };
  quotes.push(newQuote);
  
  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
  
  // Update UI
  updateCategoryDropdown();
  showRandomQuote();
}

// Update the category dropdown with current categories
function updateCategoryDropdown() {
  // Get all unique categories
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options
  categorySelect.innerHTML = '';
  
  // Add new options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  
  // Set current category (or default to 'all' if current category doesn't exist)
  if (categories.includes(currentCategory)) {
    categorySelect.value = currentCategory;
  } else {
    currentCategory = 'all';
    categorySelect.value = 'all';
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
