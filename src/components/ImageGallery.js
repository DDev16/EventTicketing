import React from 'react';
import ImageGallery from 'react-image-gallery';


const IMAGES = [
  {
    original: 'https://via.placeholder.com/600x400?text=Image+1',
    thumbnail: 'https://via.placeholder.com/150x100?text=Image+1',
    description: 'Image 1',
  },
  {
    original: 'https://via.placeholder.com/600x400?text=Image+2',
    thumbnail: 'https://via.placeholder.com/150x100?text=Image+2',
    description: 'Image 2',
  },
  {
    original: 'https://via.placeholder.com/600x400?text=Image+3',
    thumbnail: 'https://via.placeholder.com/150x100?text=Image+3',
    description: 'Image 3',
  },
];

const ImagesGallery = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ImagesGallery items={IMAGES} />
    </div>
  );
};

export default ImagesGallery;
