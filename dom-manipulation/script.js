// Initial quotes data
let quotes = [];
let lastSyncTime = null;
let pendingChanges = false;
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using JSONPlaceholder as mock API

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
const syncNotification = document.getElementById('syncNotification');
const conflictNotification = document.getElementById('conflictNotification');
const syncStatus = document.getElementById('syncStatus');
const manualSyncBtn = document.getElementById('manualSync');
let currentCategory = 'all';

// Initialize the application
function init() {
  // Set up event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  manualSyncBtn.addEventListener('click', syncWithServer);
  categorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    showRandomQuote();
  });
  
  // Load initial data
  loadInitialData();
  
  // Set up periodic sync (every 30 seconds)
  setInterval(syncWithServer, 30000);
}

// Load initial data from server
async function loadInitialData() {
  try {
    const response = await fetch(`${SERVER_URL}?_limit=5`);
    if (!response.ok) throw new Error('Failed to fetch initial data');
    
    const serverData = await response.json();
    quotes = serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: 'server'
    }));
    
    lastSyncTime = new Date();
    updateSyncStatus();
    updateCategoryDropdown();
    showRandomQuote();
    showNotification('Initial data loaded from server', 'sync');
  } catch (error) {
    console.error('Error loading initial data:', error);
    // Fallback to local data if server fails
    quotes = [
      { id: 1, text: "The only way to do great work is to love what you do.", category: "work" },
      { id: 2, text: "Life is what happens when you're busy making other plans.", category: "life" }
    ];
    showNotification('Using local data - server unavailable', 'conflict');
  }
}

// Sync with server
async function syncWithServer() {
  try {
    showNotification('Syncing with server...', 'sync');
    
    // Get current server data
    const serverResponse = await fetch(SERVER_URL);
    if (!serverResponse.ok) throw new Error('Server request failed');
    const serverData = await serverResponse.json();
    
    // Convert server data to our format
    const serverQuotes = serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: 'server'
    }));
    
    // Merge with local data (server wins conflicts)
    const mergedQuotes = [...quotes];
    
    serverQuotes.forEach(serverQuote => {
      const existingIndex = mergedQuotes.findIndex(q => q.id === serverQuote.id);
      if (existingIndex >= 0) {
        // Conflict resolution - server wins
        if (JSON.stringify(mergedQuotes[existingIndex]) !== JSON.stringify(serverQuote)) {
          showNotification(`Resolved conflict for quote ID ${serverQuote.id} (server version kept)`, 'conflict');
          mergedQuotes[existingIndex] = serverQuote;
        }
      } else {
        mergedQuotes.push(serverQuote);
      }
    });
    
    quotes = mergedQuotes;
    lastSyncTime = new Date();
    pendingChanges = false;
    
    updateSyncStatus();
    updateCategoryDropdown();
    showRandomQuote();
    showNotification('Sync completed successfully', 'sync');
  } catch (error) {
    console.error('Sync failed:', error);
    showNotification('Sync failed - working offline', 'conflict');
  }
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
    <p class="quote-meta">Category: ${quote.category} | ID: ${quote.id}</p>
  `;
}

// Add a new quote to the collection
window.addQuote = function() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (!text || !category) {
    alert('Please enter both quote text and category');
    return;
  }
  
  // Add new quote with temporary ID (negative for local-only quotes)
  const newId = quotes.length > 0 ? Math.min(-1, ...quotes.map(q => q.id)) - 1 : -1;
  const newQuote = { id: newId, text, category };
  quotes.push(newQuote);
  pendingChanges = true;
  
  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
  
  // Update UI
  updateCategoryDropdown();
  showRandomQuote();
  showNotification('Quote added locally - sync to update server', 'sync');
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

// Show notification
function showNotification(message, type) {
  const notification = type === 'sync' ? syncNotification : conflictNotification;
  notification.textContent = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

// Update sync status display
function updateSyncStatus() {
  if (lastSyncTime) {
    syncStatus.textContent = `Last sync: ${lastSyncTime.toLocaleString()}${pendingChanges ? ' (pending changes)' : ''}`;
  } else {
    syncStatus.textContent = 'Last sync: Never';
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
