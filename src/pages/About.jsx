import "./pages.css";

const About = () => {
  return (
    <>
      <div className="container-fluid bgi text-white p-0 m-0 align-content-center">
        <div className="col-md-6 mx-auto text-center p-5 align-center">
          <p className="display-2 ">
            <b>About Us</b>
          </p>
        </div>
      </div>

      <div className="container-fluid justify-content-center clr1 p-0">
        <div className="col-md-12 container-x row p-xl-5 pt-5 pb-5 p-4">
          <div className="col-xl-6 col-12 p-md-5 p-4 bg-white align-content-center text-center text-md-start">
            <div className="div mx-auto mx-md-0"></div>
            <h1 className="mt-4">Who We Are</h1>
            <p className="mt-4">
              StyleStore is an online fashion destination focused on everyday
              clothing that feels comfortable, looks clean, and fits real
              routines. We bring together casual wear, winter layers, kids
              essentials, and smart wardrobe pieces in one simple shopping
              experience.{" "}
            </p>
          </div>
          <div className="col-xl-6 col-12 p-0 m-0">
            <img src="img/27.jpg" alt="" className="img-fluid" />
          </div>
        </div>
      </div>

      <div className="container-fluid p-0">
        <div className="container-xl mx-auto">
          <div className="col-md-12 p-xl-5 row justify-content-center">
            <div className="col-xl-9 p-md-5 pt-5 text-center">
              <div className="div mx-auto mb-4"></div>
              <h5>A few words about</h5>
              <h1>Our team</h1>
              <p>
                Our team works across product selection, customer experience,
                delivery updates, and secure checkout so every order feels easy
                from browsing to tracking.{" "}
              </p>
            </div>

            <div className="col-xl-9 d-flex justify-content-between row-gap-4 flex-wrap p-5 m-0">
              <div className="div1 p-4 text-center clr1 rounded-2">
                <img src="img/28.jpg" alt="" className="img-fluid m-auto" />
                <h5 className="mt-5 m-0">Harvery Spector</h5>
                <p>Founder - CEO</p>
              </div>

              <div className="div1 p-4 text-center clr1 rounded-2">
                <img
                  src="img/29.jppg.png"
                  alt=""
                  className="img-fluid m-auto"
                />
                <h5 className="mt-5 m-0">Jessica pearson</h5>
                <p>COO</p>
              </div>

              <div className="div1 p-4 text-center clr1 rounded-2">
                <img src="img/30.jpg" alt="" className="img-fluid m-auto" />
                <h5 className="mt-5 m-0">Rachel Zain</h5>
                <p>Marketing Head</p>
              </div>

              <div className="div1 p-4 text-center clr1 rounded-2">
                <img src="img/31.jpg" alt="" className="img-fluid m-auto" />
                <h5 className="mt-5 m-0">Luise Litt</h5>
                <p>Lead Developer</p>
              </div>

              <div className="div1 p-4 text-center clr1 rounded-2">
                <img src="img/32.jpg" alt="" className="img-fluid m-auto" />
                <h5 className="mt-5 m-0">Katrina Bennett</h5>
                <p>Intern Designer</p>
              </div>

              <div className="div1 p-4 text-center clr1 rounded-2">
                <img src="img/33.jpg" alt="" className="img-fluid m-auto" />
                <h5 className="mt-5 m-0">Mike Ross</h5>
                <p>Intern Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bgi1 p-5 p-md-0">
        <div className="col-xl-3  col-md-5 col-12 h-100 bg-white mx-auto text-center align-content-center follow-card">
          <div className="div mx-auto mb-4"></div>
          <h1 className="mb-4">Follow Us</h1>
          <i className="fa-brands fa-facebook-f "></i>
          <i className="fa-brands fa-twitter ms-5"></i>
          <i className="fa-brands fa-instagram ms-5"></i>
          <i className="fa-brands fa-google-plus-g ms-5"></i>
        </div>
      </div>

      <div className="container-xl-fluid bgr py-md-5">
        <div className="container-xl">
          <div className="row padding text-center gap">
            <div className="col-md-3">
              <img src="img/38.jpg" alt="" className="img-size mb-4" />
              <h5>Worldwide Shipping</h5>
              <p>
                Fast delivery options with clear updates from checkout to
                doorstep.
              </p>
            </div>
            <div className="col-md-3">
              <img src="img/39.jpg" alt="" className="img-size mb-4" />
              <h5>Best Quality</h5>
              <p>
                Carefully selected fabrics, reliable stitching, and everyday
                durability.
              </p>
            </div>
            <div className="col-md-3">
              <img src="img/40.jpg" alt="" className="img-size mb-4" />
              <h5>Best Offers</h5>
              <p>
                Seasonal deals, coupon savings, and value picks across
                categories.
              </p>
            </div>
            <div className="col-md-3">
              <img src="img/41.jpg" alt="" className="img-size mb-4" />
              <h5>Secure Payments</h5>
              <p>
                Smooth checkout with protected payment flow and order
                confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
