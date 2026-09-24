/**
 * =========================================================================
 * THEMOINMALIK DAIRY - GOOGLE APPS SCRIPT (BACKEND CONNECTOR)
 * =========================================================================
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1eUfIgAza_g-QsjDCp87tGNm9A5Lg4W3OcUXUkdWR2gQ/edit
 */

// Your Google Sheet ID:
var SPREADSHEET_ID = "1eUfIgAza_g-QsjDCp87tGNm9A5Lg4W3OcUXUkdWR2gQ";

function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getInventory";
  var ss = getSS();
  
  // 1. Order submission via GET (safe fallback)
  if (action === "createOrder") {
    try {
      var rawData = e.parameter.data ? JSON.parse(decodeURIComponent(e.parameter.data)) : e.parameter;
      return handleCreateOrder(ss, rawData);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Failed to process GET order: " + err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // 2. Fetch live inventory
  if (action === "getInventory") {
    var inventorySheet = ss.getSheetByName("Inventory");
    if (!inventorySheet) {
      inventorySheet = setupInitialSheets(ss).inventorySheet;
    }
    
    var data = inventorySheet.getDataRange().getValues();
    var products = [];
    
    // Skip header row (row 0)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) { // If Product ID exists
        var statusStr = String(row[5]).trim().toLowerCase();
        var isAvailable = (statusStr === "in stock" || statusStr === "available" || statusStr === "yes" || statusStr === "true");
        
        products.push({
          id: String(row[0]),
          name: String(row[1]),
          category: String(row[2]),
          packaging: String(row[3]),
          pricePerUnit: Number(row[4]) || 0,
          available: isAvailable,
          mrp: Number(row[6]) || 0
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      products: products
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "THEMOINMALIK Dairy Google Apps Script API is live."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = getSS();
  var requestData = {};
  
  try {
    if (e && e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      requestData = e.parameter;
    }
  } catch (err) {
    try {
      requestData = e.parameter || {};
    } catch (ex) {}
  }
  
  return handleCreateOrder(ss, requestData);
}

/**
 * Unified Core Order Processing Handler
 */
function handleCreateOrder(ss, requestData) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10s wait for concurrent orders
  
  try {
    // Ensure sheets exist
    var ordersSheet = ss.getSheetByName("Orders");
    var customersSheet = ss.getSheetByName("Customers");
    if (!ordersSheet || !customersSheet) {
      var sheets = setupInitialSheets(ss);
      ordersSheet = sheets.ordersSheet;
      customersSheet = sheets.customersSheet;
    }
    
    // Extract order info
    var orderId = requestData.orderId || ("TMD-ORD-" + Math.floor(100000 + Math.random() * 900000));
    var customerId = requestData.customerId || ("CUST-" + String(requestData.phone || "").slice(-6));
    var timestamp = requestData.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var businessName = requestData.businessName || "";
    var contactPerson = requestData.contactPerson || "";
    var phone = requestData.phone || "";
    var deliveryMode = (requestData.deliveryMode === "pickup" || requestData.deliveryMode === "Self Pick-up") ? "Self Pick-up" : "Delivery as per Demand";
    var deliveryAddress = requestData.deliveryAddress || (deliveryMode === "Self Pick-up" ? "Self Pick-up at Plant" : "");
    var notes = requestData.notes || "";
    var totalAmount = Number(requestData.totalAmount) || 0;
    
    // Format items breakdown as clean readable string
    var itemsSummary = requestData.itemsSummary || "";
    if (!itemsSummary && requestData.items && requestData.items.length > 0) {
      itemsSummary = requestData.items.map(function(item, idx) {
        return (idx + 1) + ". " + item.name + " (" + item.quantity + "x " + (item.packaging || 'pack') + ") = Rs." + (Number(item.pricePerUnit || 0) * Number(item.quantity || 1));
      }).join("\n");
    }
    
    // 1. Append Order to [Orders] Sheet
    // Columns: [Order ID, Customer ID, Timestamp, Business Name, Contact Person, Phone, Fulfillment Mode, Address, Notes, Items Breakdown, Total Amount, Status]
    ordersSheet.appendRow([
      orderId,
      customerId,
      timestamp,
      businessName,
      contactPerson,
      phone,
      deliveryMode,
      deliveryAddress,
      notes,
      itemsSummary,
      totalAmount,
      "Confirmed"
    ]);
    
    // 2. Add or Update Customer in [Customers] Sheet
    updateCustomerRecord(customersSheet, customerId, businessName, contactPerson, phone, deliveryAddress, timestamp, totalAmount);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orderId: orderId,
      customerId: customerId,
      message: "Order recorded successfully in Google Sheet"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Setup default sheet tabs (Can be run directly from Apps Script editor)
 */
function setupInitialSheets(ss) {
  if (!ss) {
    ss = getSS();
  }
  
  // 1. Inventory Sheet
  var inventorySheet = ss.getSheetByName("Inventory");
  if (!inventorySheet) {
    inventorySheet = ss.insertSheet("Inventory");
    inventorySheet.appendRow(["Product ID", "Product Name", "Category", "Packaging", "Price (INR)", "Status (Available / Out of Stock)", "MRP"]);
    
    // Pre-populate core products
    inventorySheet.appendRow(["milk-full-cream", "Full Cream Buffalo Milk", "Milk", "Crate (12L / 24 Pouches)", 816, "Available", 960]);
    inventorySheet.appendRow(["milk-cow", "Pure Cow Milk", "Milk", "Crate (12L / 24 Pouches)", 696, "Available", 816]);
    inventorySheet.appendRow(["milk-buffalo", "Special Buffalo Milk", "Milk", "Crate (12L / 24 Pouches)", 840, "Available", 980]);
    inventorySheet.appendRow(["milk-toned", "Toned Fresh Milk", "Milk", "Crate (12L / 24 Pouches)", 624, "Available", 720]);
    inventorySheet.appendRow(["paneer-fresh", "Fresh Malai Paneer (5kg Block)", "Paneer", "5 Kg Block", 1650, "Available", 1950]);
    inventorySheet.appendRow(["dahi-fresh", "Fresh Set Dahi (10kg Bucket)", "Dahi", "10 Kg Bucket", 750, "Available", 900]);
    inventorySheet.appendRow(["ghee-pure", "Pure Golden Danedaar Desi Ghee", "Ghee", "15 Kg Tin", 8700, "Available", 10500]);
    inventorySheet.appendRow(["butter-fresh", "Fresh Creamery Butter (5kg Slab)", "Butter", "5 Kg Slab", 2350, "Available", 2750]);
    
    inventorySheet.getRange(1, 1, 1, 7).setBackground("#00e599").setFontColor("#000").setFontWeight("bold");
  }
  
  // 2. Orders Sheet
  var ordersSheet = ss.getSheetByName("Orders");
  if (!ordersSheet) {
    ordersSheet = ss.insertSheet("Orders");
    ordersSheet.appendRow(["Order ID", "Customer ID", "Timestamp", "Business Name", "Contact Person", "Phone", "Fulfillment Mode", "Delivery Address", "Notes", "Items Breakdown", "Total Amount (INR)", "Status"]);
    ordersSheet.getRange(1, 1, 1, 12).setBackground("#00e599").setFontColor("#000").setFontWeight("bold");
  }
  
  // 3. Customers Sheet
  var customersSheet = ss.getSheetByName("Customers");
  if (!customersSheet) {
    customersSheet = ss.insertSheet("Customers");
    customersSheet.appendRow(["Customer ID", "Business Name", "Contact Person", "Phone", "Address", "Total Orders Count", "Total Revenue (INR)", "Last Order Date"]);
    customersSheet.getRange(1, 1, 1, 8).setBackground("#00e599").setFontColor("#000").setFontWeight("bold");
  }
  
  // Delete default empty "Sheet1" if custom tabs are created
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && (inventorySheet || ordersSheet)) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch(e) {}
  }
  
  return { inventorySheet: inventorySheet, ordersSheet: ordersSheet, customersSheet: customersSheet };
}

/**
 * Helper to update customer stats
 */
function updateCustomerRecord(sheet, customerId, businessName, contactPerson, phone, address, timestamp, amount) {
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(customerId) || String(data[i][3]) === String(phone)) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > 0) {
    var currentCount = Number(data[rowIndex - 1][5]) || 0;
    var currentRevenue = Number(data[rowIndex - 1][6]) || 0;
    
    sheet.getRange(rowIndex, 2).setValue(businessName);
    sheet.getRange(rowIndex, 3).setValue(contactPerson);
    sheet.getRange(rowIndex, 5).setValue(address);
    sheet.getRange(rowIndex, 6).setValue(currentCount + 1);
    sheet.getRange(rowIndex, 7).setValue(currentRevenue + Number(amount));
    sheet.getRange(rowIndex, 8).setValue(timestamp);
  } else {
    sheet.appendRow([
      customerId,
      businessName,
      contactPerson,
      phone,
      address,
      1,
      Number(amount),
      timestamp
    ]);
  }
}
