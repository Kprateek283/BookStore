// testCloudinaryConnection.js
import cloudinary from './cloudinaryConfig.js'; 

const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'test-connection' }
    );
    console.log('Cloudinary connection successful:', result.secure_url);
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
  }
};

export default testCloudinaryConnection;
