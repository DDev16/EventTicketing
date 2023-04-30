import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  fade: true,
};

const ImageSlider = () => {
  return (
    <Slider {...sliderSettings}>
      <div>
        <img className="slider-image" src="https://via.placeholder.com/800x400" alt="Slide 1" />
        <div className="slider-caption">
          <h3>Slide 1</h3>
          <p>This is the first slide in the slider.</p>
        </div>
      </div>
      <div>
        <img className="slider-image" src="https://via.placeholder.com/800x400" alt="Slide 2" />
        <div className="slider-caption">
          <h3>Slide 2</h3>
          <p>This is the second slide in the slider.</p>
        </div>
      </div>
      <div>
        <img className="slider-image" src="https://via.placeholder.com/800x400" alt="Slide 3" />
        <div className="slider-caption">
          <h3>Slide 3</h3>
          <p>This is the third slide in the slider.</p>
        </div>
      </div>
    </Slider>
  );
};

export default ImageSlider;
