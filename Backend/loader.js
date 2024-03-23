import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import fs from 'fs';
import path from 'path';

export const loadPDF = async (pdfName, callback) => {
  const pdfRootDirectory = "F:/Project/SGP3/Backend/books/";
  const pdfPaths = {
    'a1': {
      docstore: path.join(pdfRootDirectory, "a1", "docstore.json"),
      faiss: path.join(pdfRootDirectory, "a1"),
    },
    'a2': {
      docstore: path.join(pdfRootDirectory, "a2", "docstore.json"),
      faiss: path.join(pdfRootDirectory, "a2"),
    },
    'a3': {
      docstore: path.join(pdfRootDirectory, "a3", "docstore.json"),
      faiss: path.join(pdfRootDirectory, "a3"),
    }
  };

  if (!(pdfName.substring(0, 2) in pdfPaths)) {
    throw new Error(`PDF not found in the pdfPaths object: ${pdfName.substring(0, 2)}`);
  }

  const { docstore, faiss } = pdfPaths[pdfName.substring(0, 2)];
  const docStorePath = docstore;
  const faissStorePath = faiss;

  if (!fs.existsSync(docStorePath) || !fs.existsSync(faissStorePath)) {
    throw new Error(`Docstore or Faiss file missing in folder ${pdfName}.`);
  }

  const docOutput = JSON.parse(fs.readFileSync(docStorePath, 'utf8'));
  const vectorStore = await FaissStore.load(faissStorePath, new OpenAIEmbeddings());

  callback(faissStorePath, { pdfName, vectorStore });
};

// Export the function
export default loadPDF;
