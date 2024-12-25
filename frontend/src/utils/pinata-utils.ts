import { pinataClient } from './pinata-client';

export async function uploadImageToPinata(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading image to Pinata:', error);
    throw error;
  }
}

interface Metadata {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
  }
  
  export async function uploadMetadataToPinata(metadata: Metadata): Promise<string> {
    try {
      const res = await pinataClient.post('/pinning/pinJSONToIPFS', metadata);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to Pinata:', error);
      throw error;
    }
  }