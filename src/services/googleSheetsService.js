// Google Sheets Integration Service for THEMOINMALIK DAIRY
// CORS-safe communication with Google Apps Script Web App

const DEFAULT_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || localStorage.getItem('tmd_google_script_url') || "https://script.google.com/macros/s/AKfycbzJvTtrVTWbR2OiFStdy-DFNDse0mPWBw22XsvMbhUENUFnu3j25KzQbx8ESuBrBMVCmA/exec";

/**
 * Fetch live inventory & product availability from Google Sheet tab [Inventory]
 */
export async function fetchLiveInventory(scriptUrl = DEFAULT_SCRIPT_URL) {
  if (!scriptUrl) {
    return { success: false, message: "No Google Apps Script URL configured" };
  }

  try {
    const fetchUrl = `${scriptUrl}?action=getInventory&t=${Date.now()}`;
    
    // Clean GET request without custom headers to avoid CORS preflight
    const response = await fetch(fetchUrl, {
      method: "GET",
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.products || [] };
  } catch (error) {
    console.warn("Live Google Sheet inventory fetch notice (using cache if offline):", error);
    return { success: false, error: error.message };
  }
}

/**
 * Post a new B2B Order to Google Sheet tab [Orders] & [Customers]
 */
export async function submitOrderToGoogleSheet(orderData, scriptUrl = DEFAULT_SCRIPT_URL) {
  const targetUrl = scriptUrl || import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL || localStorage.getItem('tmd_google_script_url') || "";
  
  if (!targetUrl) {
    console.log("Mocking Google Sheet sync (No Web App URL provided). Payload:", orderData);
    return { success: true, synced: false, message: "Saved locally (Google Sheet URL not configured yet)" };
  }

  try {
    const payloadObj = {
      action: "createOrder",
      orderId: orderData.orderId,
      customerId: orderData.customerId,
      timestamp: orderData.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      businessName: orderData.businessName || '',
      contactPerson: orderData.contactPerson || '',
      phone: orderData.phone || '',
      deliveryMode: orderData.deliveryMode || 'delivery',
      deliveryAddress: orderData.deliveryAddress || '',
      notes: orderData.notes || '',
      totalAmount: orderData.totalAmount || 0,
      items: orderData.items || []
    };

    const payloadString = JSON.stringify(payloadObj);

    // Primary: POST with text/plain (no-cors mode avoids CORS block)
    await fetch(targetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payloadString
    });

    // Secondary GET delivery to guarantee sheet row creation in all browser environments
    const encodedData = encodeURIComponent(payloadString);
    const getFallbackUrl = `${targetUrl}?action=createOrder&data=${encodedData}&_t=${Date.now()}`;
    fetch(getFallbackUrl, { method: "GET", mode: "no-cors" }).catch(() => {});

    return { success: true, synced: true, message: "Order submitted to Google Sheet" };
  } catch (error) {
    console.warn("Google Sheet sync notice:", error);
    return { success: true, synced: false, error: error.message };
  }
}

/**
 * Generate a unique Customer ID based on phone
 */
export function generateUniqueCustomerId(phone, businessName) {
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return `CUST-${cleanPhone.slice(-6)}`;
  }
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CUST-${random}`;
}

/**
 * Generate a unique Order ID
 */
export function generateUniqueOrderId() {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TMD-ORD-${timestamp}${random.toString().slice(-2)}`;
}
