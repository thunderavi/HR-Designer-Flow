import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const exportCanvasToPDF = async (projectName) => {
  const flowElement = document.querySelector('.react-flow');
  
  if (!flowElement) {
    console.error("React Flow element not found");
    return;
  }

  try {
    const dataUrl = await toPng(flowElement, {
      quality: 1,
      backgroundColor: '#ffffff',
      pixelRatio: 2, // higher resolution
      filter: (node) => {
        // Exclude UI controls from the PDF snapshot
        if (node?.classList?.contains('react-flow__controls')) return false;
        if (node?.classList?.contains('react-flow__minimap')) return false;
        if (node?.classList?.contains('react-flow__panel')) return false;
        return true;
      }
    });

    // We match the PDF perfectly to the viewport size so it's a 1:1 map
    const pdf = new jsPDF({
      orientation: flowElement.offsetWidth > flowElement.offsetHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [flowElement.offsetWidth, flowElement.offsetHeight]
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, flowElement.offsetWidth, flowElement.offsetHeight);
    
    // Fallback name if none provided
    const safeName = (projectName || 'Untitled_Project').replace(/\s+/g, '_');
    pdf.save(`${safeName}_workflow.pdf`);
    
  } catch (error) {
    console.error("Failed to export PDF:", error);
    alert("Error generating PDF. See console for details.");
  }
};
