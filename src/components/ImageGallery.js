import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import Masonry from '@mui/lab/Masonry';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ImageGallery.css'

const StyledCard = styled(Card)({
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-4px)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
});

const StyledCardMedia = styled(CardMedia)({
  width: '100%',
  height: '250px',
  objectFit: 'cover',
});

const StyledCardContent = styled(CardContent)({
  padding: '16px',
});

const StyledCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px 16px',
});

const images = [
  {
    title: 'Random Concert Image 1',
    url: 'https://source.unsplash.com/random?sig=1&concert',
  },
  {
    title: 'Random Concert Image 2',
    url: 'https://source.unsplash.com/random?sig=2&concert',
  },
  {
    title: 'Random Concert Image 3',
    url: 'https://source.unsplash.com/random?sig=3&concert',
  },
  {
    title: 'Random Concert Image 4',
    url: 'https://source.unsplash.com/random?sig=4&concert',
  },
];

const ImageGallery = () => {
  return (
    <Masonry
      columns={{ xs: 2, sm: 3, md: 2 }}
      spacing={4}
    >
      {images.map((image, index) => (
        <div key={index} className="masonry-item">
          <StyledCard>
            <StyledCardMedia component="img" image={image.url} alt={image.title} />
            <StyledCardContent>
              <Typography gutterBottom variant="h5" component="div">
                {image.title}
              </Typography>
            </StyledCardContent>
            <StyledCardActions disableSpacing>
              <IconButton aria-label="add to favorites" color="secondary">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share" color="secondary">
                <ShareIcon />
              </IconButton>
            </StyledCardActions>
          </StyledCard>
        </div>
      ))}
    </Masonry>
  );
};

export default ImageGallery;
