// TypeScript interfaces for Jupyter Notebook format (nbformat v4.5)

export interface JupyterNotebook {
  cells: NotebookCell[];
  metadata: NotebookMetadata;
  nbformat: number;
  nbformat_minor: number;
}

export interface NotebookMetadata {
  kernelspec: {
    display_name: string;
    language: string;
    name: string;
  };
  language_info: {
    codemirror_mode: {
      name: string;
      version: number;
    };
    file_extension: string;
    mimetype: string;
    name: string;
    nbconvert_exporter: string;
    pygments_lexer: string;
    version: string;
  };
}

export interface NotebookCell {
  cell_type: 'code' | 'markdown';
  execution_count: number | null;
  metadata: Record<string, unknown>;
  source: string[];
  outputs?: unknown[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  csvPath?: string;
  notebookPath?: string;
  cleanedPath?: string;
  error?: string;
}
