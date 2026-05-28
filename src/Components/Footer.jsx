import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
       <div className='container'>
        <div className='row padding'>
            <div className='col-md-3'>
                <h5 className=' mb-4'>Quick Links</h5>
                <Link to="/"><p>Home</p></Link>
                <Link to="/about"><p>About</p></Link>
                <Link to="/login"><p>My Account</p></Link>
                <Link to="/cart"><p>Cart</p></Link>
                <Link to="/contact"><p>Contact</p></Link>
            </div>
            <div className='col-md-3'>
                <h5 className=' mb-4'>For Her</h5>
                <Link to="/women"><p>Women Jeans</p></Link>
                <Link to="/women"><p>Tops and Shirts</p></Link>
                <Link to="/women"><p>Women Jackets</p></Link>
                <Link to="/women"><p>Heels and Flats</p></Link>
                <Link to="/women"><p>Women Accessories</p></Link>
            </div>
            <div className='col-md-3'>
                <h5 className=' mb-4'>For Him</h5>
                <Link to="/men"><p>Men Jeans</p></Link>
                <Link to="/men"><p>Men Shirts</p></Link>
                <Link to="/men"><p>Men Shoes</p></Link>
                <Link to="/men"><p>Men Accessories</p></Link>
                <Link to="/men"><p>My Jackets</p></Link>
            </div>
            <div className='col-md-3'>
                <h5>For Him</h5>
                <img src="img/dnk7.jpg" alt="" className='img-fluid mt-5' width={"120px"}/>
            </div>
        </div>
    </div>

    <div className='container-fluid footer-border'>
        <div className='container'>
            <div className='row padding-footer'>
                <div className='col-md-6'>
                    <p>Copyright © 2025 Brandstore</p>
                </div>
                <div className='col-md-6 text-end'>
                    <p>Powered by Brandstore</p>
                </div>
            </div>
        </div>
    </div> 
    </>
  )
}

export default Footer
