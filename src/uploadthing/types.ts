export interface FileEsque extends Blob {
  name: string;
}

type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};
type UploadError = {
  code: string;
  message: string;
  data: any;
};
export type UploadFileResponse =
  | {
      data: UploadData;
      error: null;
    }
  | {
      data: null;
      error: UploadError;
    };

export type DeleteFilesResponse = { success: boolean };

type fileUrl = { key: string; url: string };

export type FileUrlsResponse = fileUrl | fileUrl[];
