import { UTApi } from 'uploadthing/server';
import { createUploadthing, type FileRouter } from 'uploadthing/express';

export const UTAPI_PROVIDER = 'UTApiProvider';

export const utapiProvider = {
  provide: UTAPI_PROVIDER,
  useFactory: () => {
    return new UTApi({
      fetch: globalThis.fetch,
      apiKey: process.env.UPLOADTHING_SECRET,
    });
  },
};

const f = createUploadthing();

export const uploadRouter = {
  image: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log('upload completed', data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
