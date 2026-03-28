type Orientation = 'portrait' | 'landscape';

type ExportElementAsPdfOptions = {
  filename: string;
  orientation?: Orientation;
  marginMm?: number;
  scale?: number;
};

export async function exportElementAsPdf(
  sourceElement: HTMLElement,
  options: ExportElementAsPdfOptions
): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const {
    filename,
    orientation = 'portrait',
    marginMm = 10,
    scale = 2,
  } = options;

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.position = 'fixed';
  clone.style.left = '-100000px';
  clone.style.top = '0';
  clone.style.zIndex = '-1';
  clone.style.background = '#ffffff';

  // Keep rendering width predictable so page scaling is stable.
  if (!clone.style.width) {
    clone.style.width = orientation === 'portrait' ? '794px' : '1123px';
  }

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale,
      useCORS: true,
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const printableWidth = pageWidth - marginMm * 2;
    const printableHeight = pageHeight - marginMm * 2;

    const imageData = canvas.toDataURL('image/png');
    const imageHeightMm = (canvas.height * printableWidth) / canvas.width;

    let offsetY = 0;
    while (offsetY < imageHeightMm) {
      if (offsetY > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        imageData,
        'PNG',
        marginMm,
        marginMm - offsetY,
        printableWidth,
        imageHeightMm,
        undefined,
        'FAST'
      );
      offsetY += printableHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
}
