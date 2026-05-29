import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readStorage, writeStorage } from "../utils/storage";
import "./pages.css";

const Contact = () => {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    subject: "",
    email: user?.email || "",
    message: "",
  });

  useEffect(() => {
    if (!user) return;

    const timeoutId = window.setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginPrompt("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      setLoginPrompt("Please login first to send us a message.");
      return;
    }

    const savedMessages = readStorage("contactMessages", []);
    const nextMessage = {
      id: Date.now(),
      ...formData,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    writeStorage("contactMessages", [nextMessage, ...savedMessages]);
    setIsSubmitted(true);
    setFormData({
      name: user.name || "",
      subject: "",
      email: user.email || "",
      message: "",
    });
  };

  return (
    <>
      <div className="container-fluid bgi2 text-white p-0 m-0 pb-lg-5 align-content-center">
        <div className="col-md-6 mx-auto text-center p-5 align-center ">
          <p className="display-2 ">
            <b>Contact Us</b>
          </p>
        </div>
      </div>

      <div className="container-fluid clr1">
        <div className="container-xl mx-auto row p-0">
          <div className="col-xl-12">
            <div className="col-md-6 p-5 mx-auto text-center">
              <h6>Have any queries?</h6>
              <h1>We're here to help</h1>
            </div>

            <div className="col-xl-12 col-12 d-md-flex text-center p-lg-5 contact-card-grid">
              <div className="div2 border p-4 rounded-3 bg-white">
                <h3>Sales</h3>
                <p>Need help choosing a product, size, or offer? Our styling team can guide you before checkout.</p>
                <h5 className="text-primary">1800 123 4567</h5>
              </div>
              <div className="div2 border p-4 rounded-3 bg-white">
                <h3>Complaints</h3>
                <p>Tell us what went wrong with an order, delivery, or product experience so we can fix it quickly.</p>
                <h5 className="text-primary">1900 223 8899</h5>
              </div>
              <div className="div2 border p-4 rounded-3 bg-white">
                <h3>Returns</h3>
                <p>Start a return, exchange a size, or ask about refund timelines for your recent StyleStore order.</p>
                <h5 className="text-primary">returns@stylestore.com</h5>
              </div>
              <div className="div2 border p-4 rounded-3 bg-white">
                <h3>Partnerships</h3>
                <p>For brand collaborations, creator campaigns, and business inquiries, connect with our team.</p>
                <h5 className="text-primary">1700 444 5578</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid clr1">
        <div className="container-xl mx-auto row p-0 m-0">
          <div className="col-md-12 row p-lg-5 m-0 align-items-stretch">
            <div className="col-md-6 p-lg-4 pe-lg-5 pt-5 text-center text-lg-start p-0 m-0">
              <h6>Don't be a stranger!</h6>
              <h1>You tell us. We listen.</h1>
              <p className="mt-3">
                Whether you have a question about sizing, delivery, returns, payments, or an active order, send us the details and we will route your message to the right support specialist.
              </p>
            </div>

            <div className="col-md-6 p-4 p-lg-5 bg-white mb-5 mb-lg-0 contact-panel">
              {isSubmitted ? (
                <div className="contact-success-state">
                  <h3>Thank you for your message</h3>
                  <p>
                    We received your message and saved it successfully. Our team will get back to you soon.
                  </p>
                  <button
                    type="button"
                    className="btn5 contact-login-btn"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-head">
                    <h3>Send Us a Message</h3>
                    <p>
                      Fill out the form below. You can view this page without logging in, but sending a message requires an account.
                    </p>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="NAME"
                    className="w-100 p-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="SUBJECT"
                    className="w-100 p-2 mt-4"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="EMAIL"
                    className="w-100 p-2 mt-4"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="MESSAGE"
                    rows="8"
                    className="w-100 p-2 mt-4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {loginPrompt && (
                    <div className="contact-login-alert">
                      <span>{loginPrompt}</span>
                      <Link to="/login" className="contact-inline-link">
                        Login now
                      </Link>
                    </div>
                  )}
                  <button type="submit" className="mt-4 btn5 p-2 px-4">
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
