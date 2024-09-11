chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "copyRootDomain",
      title: "Copy Root Domain",
      contexts: ["link"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyRootDomain") {
      const url = new URL(info.linkUrl);
      const domain = extractRootDomain(url.hostname);
  
      // Execute a script in the active tab to copy to clipboard
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyToClipboard,
        args: [domain]
      });
    }
  });
  
  function extractRootDomain(hostname) {
    const domainParts = hostname.split('.');
    
    // Handle different types of domains (like co.uk or com)
    if (domainParts.length > 2) {
      return domainParts.slice(-2).join('.');
    }
    return hostname;
  }
  
  function copyToClipboard(domain) {
    navigator.clipboard.writeText(domain).then(() => {
      console.log('Copied to clipboard:', domain);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
  