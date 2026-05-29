import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Carousel from '../Components/Carousel';
import LatestCollection from "../Components/LatestCollection";
import { products } from "../assets/assets";
import { useNotification } from '../context/NotificationContext';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    const authMessage = location.state?.authMessage;
    if (!authMessage) return;

    const timerId = window.setTimeout(() => {
      notify(authMessage);
      navigate(location.pathname, { replace: true });
    }, 50);

    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.state, navigate, notify]);

  return (
    <>
    <div className='hero-section backgroundImg position-relative'>
        <div className='container'>
            <div className='col-md-6 header'>
                <h1 className='display-3 fw-bolder lh-base'>Raining Offers For Hot Summer!</h1>
                <h4 className='fw-bold'>25% Off On All Products</h4>
                <button type="button" className='button' onClick={() => navigate("/everything")}>SHOP NOW</button>
                <button type="button" className='button-2' onClick={() => navigate("/contact")}>FIND MORE</button>
            </div>
        </div>
    </div>

    <Carousel/>

    <div className='container-xl'>
        <div className='row padding'>
            <div className='col-md-4'>
                <div className='backgroundImg2'>
                    <h4 className='fw-bold'>20% Off On Tank Tops</h4>
                    <p>Lightweight layers for warm days, easy styling, and everyday comfort.</p>
                    <button type="button" className='button' onClick={() => navigate("/women")}>SHOP NOW</button>
                </div>
            </div>
            <div className='col-md-4'>
                <div className='backgroundImg3'>
                    <h4 className='fw-bold'>Latest Eyewear For You</h4>
                    <p>Fresh frames and sunglasses selected to finish every casual look.</p>
                    <button type="button" className='button' onClick={() => navigate("/everything")}>SHOP NOW</button>
                </div>
            </div>
            <div className='col-md-4'>
                <div className='backgroundImg4'>
                    <h4 className='fw-bold'>Smart Looks For Every Day</h4>
                    <p>Polished shirts, jackets, and trousers made for work and weekends.</p>
                    <button type="button" className='button' onClick={() => navigate("/men")}>CHECK OUT</button>
                </div>
            </div>
        </div>
    </div>  

     <LatestCollection products={products} />

    <div className='container-fluid bgr px-md-5 text-white'>    
        <div className='backgroundImg5'>
            <div className='w-50 p-5'>
                <h5>Limited Time Offer</h5>
                <h1 className='mt-4'>Special Edition</h1>
                <p className='my-4'>Upgrade your wardrobe with limited-run essentials crafted for comfort, clean styling, and easy mix-and-match outfits.</p>
                <h5>Buy This T-shirt At 20% Discount, Use Code OFF20</h5>
                <button type="button" className='button mt-4' onClick={() => navigate("/everything")}>SHOP NOW</button>
            </div>
        </div>
    </div>

    <div className='container-xl-fluid bgr py-md-5'>
        <div className='container-xl'>
            <div className='row padding text-center gap'>
                <div className='col-md-3'>
                    <img src="img/38.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Worldwide Shipping</h5>
                    <p>Fast delivery options with clear updates from checkout to doorstep.</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/39.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Best Quality</h5>
                    <p>Carefully selected fabrics, reliable stitching, and everyday durability.</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/40.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Best Offers</h5>
                    <p>Seasonal deals, coupon savings, and value picks across categories.</p>
                </div>
                <div className='col-md-3'>
                    <img src="img/41.jpg" alt=""  className='img-size mb-4'/>
                    <h5>Secure Payments</h5>
                    <p>Smooth checkout with protected payment flow and order confirmation.</p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Home
