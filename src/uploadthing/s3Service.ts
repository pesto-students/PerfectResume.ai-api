import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class S3Service {
  private readonly s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({ region: 'your-aws-region' });
  }

  async uploadToS3(
    bucketName: string,
    key: string,
    body: Buffer,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3Client.send(command);
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload to S3');
    }
  }

  async uploadStreamToS3(
    bucketName: string,
    key: string,
    stream: Readable,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: stream,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3Client.send(command);
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading stream to S3:', error);
      throw new Error('Failed to upload stream to S3');
    }
  }
}
