import './pages.css'

const About = () => {
  return (
    <>
    <div className="container-fluid bgi text-white p-0 m-0">
            <div className="col-md-6 mx-auto text-center p-5 align-center">
                <p className="display-2 "><b>About Us</b></p>
            </div>
    </div>

    <div className="container-fluid justify-content-center clr1 ">
            <div className="col-md-12 container-x row p-md-5 pt-5 pb-5 p-4">
                <div className="col-md-6 col-12 p-md-5 p-4 bg-white align-content-center text-center text-md-start">
                    <div className="div mx-auto mx-md-0"></div>
                    <h1 className="mt-4">Who We Are</h1>
                    <p className="mt-4">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.&nbsp;Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit.				</p>
                </div>
                <div className="col-md-6 col-12 p-0 m-0">
                    <img src="img/27.jpg" alt="" className="img-fluid"/>
                </div>
            </div>
    </div>

    <div className="container-fluid">
        <div className="container mx-auto">
            <div className="col-md-12 p-md-5 row justify-content-center">
                <div className="col-md-9 p-md-5 pt-5 text-center">
                    <div className="div mx-auto mb-4"></div>
                    <h5>A few words about</h5>
                    <h1>Our team</h1>
                    <p>
					Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. className aptent taciti sociosqu ad litora torquent per conubia nostra.				</p>
                </div>

                <div className="col-md-9 d-flex justify-content-between row-gap-4 flex-wrap p-5 m-0">
                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/28.jpg" alt="" className="img-fluid " />
                        <h5 className="mt-5 m-0">Harvery Spector</h5>
                        <p>Founder - CEO</p>
                    </div>

                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/29.jppg.png" alt="" className="img-fluid " width="100px"/>
                        <h5 className="mt-5 m-0">Jessica pearson</h5>
                        <p>COO</p>
                    </div>

                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/30.jpg" alt="" className="img-fluid " width="100px"/>
                        <h5 className="mt-5 m-0">Rachel Zain</h5>
                        <p>Marketing Head</p>
                    </div>

                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/31.jpg" alt="" className="img-fluid " width="100px"/>
                        <h5 className="mt-5 m-0">Luise Litt</h5>
                        <p>Lead Developer</p>
                    </div>

                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/32.jpg" alt="" className="img-fluid " width="100px"/>
                        <h5 className="mt-5 m-0">Katrina Bennett</h5>
                        <p>Intern Designer</p> 
                    </div>

                    <div className="div1 p-4 text-center clr1 rounded-2">
                        <img src="img/33.jpg" alt="" className="img-fluid " width="100px"/>
                        <h5 className="mt-5 m-0">Mike Ross</h5>
                        <p>Intern Designer</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

     <div className="container-fluid bgi1 p-5 p-md-0">
        <div className="col-md-3 col-12 h-100 bg-white mx-auto text-center align-content-center follow-card">
            <div className="div mx-auto mb-4"></div>
            <h1 className="mb-4">Follow Us</h1>
            <i className="fa-brands fa-facebook-f "></i>
            <i className="fa-brands fa-twitter ms-5"></i>
            <i className="fa-brands fa-instagram ms-5"></i>
            <i className="fa-brands fa-google-plus-g ms-5"></i>
        </div>
    </div>

    <div className="container-fluid">
        <div className="container mx-auto p-md-5">
            <div className="col-md-12 row p-md-5">
                <div className="col-md-3 text-center pt-5">
                    <img src="img/38.jpg" alt="" className="img-fluid mb-4" width="50px"/>
                    <h5>Worldwide Shipping</h5>
                    <p >It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                </div>

                <div className="col-md-3 text-center pt-5">
                    <img src="img/39.jpg" alt="" className="img-fluid mb-4" width="50px"/>
                    <h5>Best Quality</h5>
                    <p >It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                </div>

                <div className="col-md-3 text-center pt-5">
                    <img src="img/40.jpg" alt="" className="img-fluid mb-4" width="50px"/>
                    <h5>Best Offer</h5>
                    <p >It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                </div>

                <div className="col-md-3 text-center pt-5">
                    <img src="img/41.jpg" alt="" className="img-fluid mb-4" width="50px"/>
                    <h5>Secure Payments</h5>
                    <p >It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default About
