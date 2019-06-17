// from: https://github.com/mozilla/pdf.js/tree/master/examples/node/pdf2png
import * as Canvas from 'canvas';
import * as PdfJsLib from 'pdfjs-dist';

export async function convertPdfBufferToPng(pdfBuffer: Buffer): Promise<Buffer> {
  const rawData = new Uint8Array(pdfBuffer);
  const loadingTask = PdfJsLib.getDocument(rawData);

  const pdfDocument = await loadingTask.promise;
  const page = await pdfDocument.getPage(1);

  const viewport = page.getViewport(2.0, 90);

  const canvasFactory = new NodeCanvasFactory();
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
    canvasFactory,
  };

  const renderTask = page.render(renderContext);

  await renderTask.promise;
  return canvasAndContext.canvas.toBuffer();
}

class NodeCanvasFactory {
  create(width, height) {
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}