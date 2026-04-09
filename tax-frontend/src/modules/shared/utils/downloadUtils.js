/**
 * Detects if text contains a table structure
 */

export const containsTable = (text) => {
  if (!text) return false;
  
  // Check for markdown tables
  const hasMarkdownTable = /\|.*\|/.test(text) && /[-]+\|/.test(text);
  
  // Check for HTML tables
  const hasHtmlTable = /<table[\s\S]*?<\/table>/i.test(text);
  
  // Check for aligned text tables (like from console/terminal)
  const hasAlignedTable = /(\+\-+\+)/.test(text) || /(\|.*\|[\r\n]+[\|\-\+\s]+)/.test(text);
  
  return hasMarkdownTable || hasHtmlTable || hasAlignedTable;
};

/**
 * Extracts and parses markdown table to JSON
 */
export const parseMarkdownTable = (text) => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const tables = [];
  let currentTable = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for table row
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').filter(cell => cell.trim() !== '');
      
      // Skip separator row (|---|---|)
      if (cells.length > 0 && !cells.every(cell => /^[\s\-:]+$/.test(cell))) {
        if (!currentTable) {
          currentTable = { headers: cells, rows: [] };
        } else if (currentTable.headers) {
          // Check if this is the separator row
          if (!cells.every(cell => /^[\s\-:]+$/.test(cell))) {
            currentTable.rows.push(cells);
          }
        }
      }
    } else if (currentTable && currentTable.rows.length > 0) {
      // End of table
      tables.push(currentTable);
      currentTable = null;
    }
  }
  
  if (currentTable && currentTable.rows.length > 0) {
    tables.push(currentTable);
  }
  
  return tables;
};

/**
 * Extracts and parses HTML table to JSON
 */
export const parseHtmlTable = (text) => {
  if (!text) return [];
  
  const tables = [];
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let match;
  
  while ((match = tableRegex.exec(text)) !== null) {
    const htmlTable = match[0];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTable, 'text/html');
    const table = doc.querySelector('table');
    
    if (table) {
      const headers = [];
      const rows = [];
      
      // Get headers
      const headerCells = table.querySelectorAll('th');
      if (headerCells.length > 0) {
        headerCells.forEach(th => headers.push(th.textContent.trim()));
      }
      
      // Get data rows
      const dataRows = table.querySelectorAll('tbody tr, tr:not(:has(th))');
      dataRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          const rowData = [];
          cells.forEach(td => rowData.push(td.textContent.trim()));
          rows.push(rowData);
        }
      });
      
      if (headers.length > 0 || rows.length > 0) {
        tables.push({ headers, rows });
      }
    }
  }
  
  return tables;
};

/**
 * Converts table data to CSV format
 */
export const tableToCSV = (table) => {
  const rows = [];
  
  // Add headers
  if (table.headers && table.headers.length > 0) {
    rows.push(table.headers.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  }
  
  // Add data rows
  if (table.rows && table.rows.length > 0) {
    table.rows.forEach(row => {
      rows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
    });
  }
  
  return rows.join('\n');
};

/**
 * Converts table data to HTML format
 */
export const tableToHTML = (table) => {
  let html = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
  
  // Add headers
  if (table.headers && table.headers.length > 0) {
    html += '<thead><tr>';
    table.headers.forEach(header => {
      html += `<th style="background-color: #f2f2f2; text-align: left; padding: 8px;">${escapeHtml(header)}</th>`;
    });
    html += '</thead>';
  }
  
  // Add body
  if (table.rows && table.rows.length > 0) {
    html += '<tbody>';
    table.rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(String(cell))}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
  }
  
  html += '</table>';
  return html;
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Download data as a file
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Main download handler for chat messages
 */
export const downloadConversation = async (messages, format = 'text') => {
  if (!messages || messages.length === 0) return;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `tana_chat_${timestamp}`;
  
  if (format === 'csv') {
    // Download as CSV
    const csvRows = [];
    csvRows.push(['Role', 'Message', 'Timestamp'].map(cell => `"${cell}"`).join(','));
    
    messages.forEach(msg => {
      const cleanText = msg.text ? msg.text.replace(/"/g, '""').replace(/\n/g, ' ') : '';
      csvRows.push(`"${msg.sender || 'unknown'}","${cleanText}","${msg.timestamp || ''}"`);
    });
    
    downloadFile(csvRows.join('\n'), `${filename}.csv`, 'text/csv');
    
  } else if (format === 'json') {
    // Download as JSON
    const exportData = {
      exported_at: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.sender,
        content: msg.text,
        timestamp: msg.timestamp,
        metadata: {
          expertiseLevel: msg.expertiseLevel,
          legalCitations: msg.legalCitations,
          calculationsPerformed: msg.calculationsPerformed
        }
      }))
    };
    downloadFile(JSON.stringify(exportData, null, 2), `${filename}.json`, 'application/json');
    
  } else if (format === 'html') {
    // Download as HTML with proper formatting
    let html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>TANA Chat Conversation - ${new Date().toLocaleString()}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        .message { margin: 20px 0; padding: 15px; border-radius: 10px; }
        .user { background-color: #e3f2fd; border-left: 4px solid #2196f3; }
        .bot { background-color: #f5f5f5; border-left: 4px solid #4caf50; }
        .role { font-weight: bold; margin-bottom: 8px; color: #333; }
        .timestamp { font-size: 0.8em; color: #666; margin-top: 8px; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>TANA Professional Tax Assistant - Conversation</h1>
      <p>Exported: ${new Date().toLocaleString()}</p>
      <hr>`;
    
    messages.forEach(msg => {
      const roleClass = msg.sender === 'user' ? 'user' : 'bot';
      const roleName = msg.sender === 'user' ? 'User' : 'TANA Professional Assistant';
      
      html += `
      <div class="message ${roleClass}">
        <div class="role">${roleName}</div>
        <div class="content">${escapeHtml(msg.text || '').replace(/\n/g, '<br>')}</div>
        ${msg.timestamp ? `<div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>` : ''}
      </div>`;
    });
    
    html += `
    </body>
    </html>`;
    
    downloadFile(html, `${filename}.html`, 'text/html');
    
 } else if (format === 'pdf') {

  if (typeof window === "undefined") return;

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();

  let y = 10;

  // Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TANA Chat Conversation", 10, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`Exported: ${new Date().toLocaleString()}`, 10, y);
  y += 10;

  // Messages
  messages.forEach(msg => {
    const role = msg.sender === 'user' ? 'User' : 'TANA Assistant';

    doc.setFont("Helvetica", "bold");
    doc.text(`${role}:`, 10, y);
    y += 6;

    doc.setFont("Helvetica", "normal");

    const textLines = doc.splitTextToSize(msg.text || "", 180);

    doc.text(textLines, 10, y);
    y += textLines.length * 6;

    y += 4;

    // New page if needed
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save(`${filename}.pdf`);
} else {
    // Default text format
    let text = `TANA Professional Tax Assistant - Conversation\n`;
    text += `Exported: ${new Date().toLocaleString()}\n`;
    text += `${'='.repeat(60)}\n\n`;
    
    messages.forEach(msg => {
      const roleName = msg.sender === 'user' ? 'User' : 'TANA Professional';
      text += `[${roleName}]\n`;
      text += `${msg.text || ''}\n`;
      if (msg.timestamp) text += `[${new Date(msg.timestamp).toLocaleString()}]\n`;
      text += `\n${'-'.repeat(40)}\n\n`;
    });
    
    downloadFile(text, `${filename}.txt`, 'text/plain');
  }
};
