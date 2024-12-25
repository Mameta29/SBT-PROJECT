import React, { useState } from 'react';
// import { Camera } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors'
import { publicClient, walletClient } from '../utils/viem-client';
import { getContractABI, CONTRACT_ADDRESS } from '../utils/contractUtils';
import { uploadImageToPinata, uploadMetadataToPinata } from '../utils/pinata-utils';

interface Metadata {
  name: string;
  description: string;
  attributes: { trait_type: string; value: string }[];
}

const SBTMinter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata>({
    name: '',
    description: '',
    attributes: []
  });
  const [status, setStatus] = useState('Ready to mint');

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event 押下")
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Metadata
  ) => {
    setMetadata(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleAttributeChange = (index: number, key: 'trait_type' | 'value', value: string) => {
    setMetadata(prev => {
      const newAttributes = [...prev.attributes];
      newAttributes[index] = { ...newAttributes[index], [key]: value };
      return { ...prev, attributes: newAttributes };
    });
  };

  const addAttribute = () => {
    setMetadata(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const handleMint = async () => {
    if (!isConnected || !address || !file) {
      setStatus('Please connect wallet and upload an image');
      return;
    }

    setStatus('Uploading image to IPFS...');
    try {
      const accounts = await walletClient.getAddresses();
      if (accounts.length === 0 || accounts[0].toLowerCase() !== address.toLowerCase()) {
        console.log("accounts", accounts[0])
        setStatus('Wallet connection issue. Please reconnect your wallet.');
        return;
      }
      const imageUrl = await uploadImageToPinata(file);

      setStatus('Uploading metadata to IPFS...');
      const metadataUrl = await uploadMetadataToPinata({
        name: metadata.name,
        description: metadata.description,
        image: imageUrl,
        attributes: metadata.attributes
      });

      setStatus('Minting token...');
        const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: getContractABI(),
        functionName: 'safeMint',
        args: [address, metadataUrl],
        account: address,
        });

        const hash = await walletClient.writeContract(request);

        setStatus(`Token minted! Transaction hash: ${hash}`);
    } catch (error) {
      console.error('Error during minting process: ', error);
      setStatus('Minting failed. See console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">SBT Minter</h1>
        
        {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="mb-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ウォレットを切断
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          className="mb-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ウォレットを接続
        </button>
      )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700 inline-block">
            Upload File
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </label>
          
          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={metadata.name}
            onChange={(e) => handleMetadataChange(e, 'name')}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={metadata.description}
            onChange={(e) => handleMetadataChange(e, 'description')}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attributes
          </label>
          {metadata.attributes.map((attr, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Trait Type"
                value={attr.trait_type}
                onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
              />
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Value"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAttribute}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Attribute
          </button>
        </div>

        <button
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleMint}
          disabled={!isConnected}
        >
          Mint SBT
        </button>

        <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
          Status: {status}
        </div>
      </div>
    </div>
  );
};

export default SBTMinter;