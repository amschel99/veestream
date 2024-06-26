import { BlobServiceClient } from '@azure/storage-blob';
import multer from 'multer';
import accountModel from '../models/apiKey.js';
import dotenv from 'dotenv'
import e from 'express';
import fs from 'fs';
import { PassThrough } from 'stream';
import FileModel from '../models/file.js';
import { config } from '../config/config.js';
dotenv.config()
const{AZURE_CONNECTION_STRING}=config
const connectionString =AZURE_CONNECTION_STRING

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

let loadedBytes = 0;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './videos')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: Infinity, // Remove the limit on file size
  },
}).single('file');

export const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    const{name}= req.body
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { apikey } = req.headers
    
    try { 
      const fileSizeLimit = 500 * 1024 * 1024; // 500 MB

      if (!req.headers['content-length'] || Number(req.headers['content-length']) > fileSizeLimit) {
        return res.status(400).json({ message: 'File size limit exceeded (500MB)' });
      }
     const numberOfVideos=await FileModel.find({apikey})
     if(numberOfVideos>=30){
      return res.status(401).json(`maximum video limit reached, upgrade your subscription`)

     }
      const apiKeyDocument = await accountModel.findOne({ apikey });
      const container = apiKeyDocument.container;
      const containerClient = blobServiceClient.getContainerClient(container);

      const blobName = req.file.originalname;
      const blobStream = new PassThrough();

const localFilePath = `./videos/${blobName}`;

// Open a read stream from the uploaded file on the local file system
const readStream = fs.createReadStream(localFilePath);

// Pipe the read stream to the blob stream
readStream.pipe(blobStream);

const blockBlobClient = containerClient.getBlockBlobClient(blobName);


      const options = {
        blockSize: 10 * 1024 * 1024, // 10MB block size
        concurrency: 15, // 15 concurrent requests
      };
      
      const uploadResponse = await blockBlobClient.uploadStream(blobStream, undefined, undefined, options);
      
      // Delete the uploaded video file from the server's file system
      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error(err+'code1');
        return;
        }
      });

      const url = `${blockBlobClient.url}`;
  
      const videoData={name,url,apikey:req.headers.apikey}
    const videoMetadata= await FileModel.create(videoData)
    const extraData={poster:`/video/${videoMetadata._id}/poster`,gif:`/video/${videoMetadata._id}/gif`,name,url}
    console.log(extraData)
    console.log(url)
    try{
      const response= await FileModel.findOneAndUpdate({url},extraData)
      return res.status(200).json(response);
    }
    catch(e){
return res.status(500).json(`failed to update`)
    }
   
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
};
