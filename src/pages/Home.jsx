import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Carousel from '../Components/Carousel';
import LatestCollection from "../Components/LatestCollection";
import { products } from "../assets/assets";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authMessage = location.state?.authMessage;
    if (!authMessage) return;

    const timerId = window.setTimeout(() => {
      alert(authMessage);
      navigate(location.pathname, { replace: true });
    }, 50);

    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.state, navigate]);

  return (
    <>
    <div className='hero-section backgroundImg position-relative'>
        <div className='container'>
            <div className='col-md-6 header'>
                <h1 className='display-3 fw-bolder lh-base'>Raining Offers For Hot Summer!</h1>
                <h4 className='fw-bold'>25% Off On All Products</h4>
                <button className='button'>SHOP NOW</button>
                <button className='button-2'>FIND MORE</button>
            </div>
        </div>
    </div>

    <Carousel/>

    <div className='container '>
        <div className='row padding'>
            <div className='col-md-4'>
                <div className='backgroundImg2'>
                    <h4 className='fw-bold'>20% Off On Tank Tops</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.</p>
                    <button className='button'>SHOP NOW</button>
                </div>
            </div>
            <div className='col-md-4'>
                <div className='backgroundImg3'>
                    <h4 className='fw-bold'>Latest Eyewear For You</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.</p>
                    <button className='button'>SHOP NOW</button>
                </div>
            </div>
            <div className='col-md-4'>
                <div className='backgroundImg4'>
                    <h4 className='fw-bold'>Let's Lorem Suit Up!</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac dictum.</p>
                    <button className='button'>CHECK OUT</button>
                </div>
            </div>
        </div>
    </div>  

     <LatestCollection products={products} />

    <div className='container-fluid bgr px-5 text-white'>    
        <div className='backgroundImg5'>
            <div className='w-50 p-5'>
                <h5>Limited Time Offer</h5>
                <h1 className='mt-4'>Special Edition</h1>
                <p className='my-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                <h5>Buy This T-shirt At 20% Discount, Use Code OFF20</h5>
                <button className='button mt-4'>SHOP NOW</button>
            </div>
        </div>
    </div>

    <div className='container-fluid bgr py-5'>
        <div className='container'>
            <div className='row padding text-center'>
                <div className='col-md-3'>
                    <img src="img/38.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Worlwide Shipping</h5>
                    <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/39.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Best Quality</h5>
                    <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/40.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Best Offers</h5>
                    <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/41.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Secure Payments</h5>
                    <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo</p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Home
