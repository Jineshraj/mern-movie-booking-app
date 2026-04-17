import { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  Clapperboard,
  Eye,
  EyeOff,
  Film,
  Popcorn,
} from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => {
    window.history.back();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.password || formData.password.length < 6) {
      setIsLoading(false);
      toast.error("Password must contain atleast 6 characters");
      console.warn("login blocked");
      return;
    }

    console.log("Login Data :", formData);

    setTimeout(() => {
      setIsLoading(false);
      try {
        const authObj = { isLoggedIn: true, email: formData.email };
        localStorage.setItem("cine_auth", JSON.stringify(authObj));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", formData.email || "");
        localStorage.setItem("cine_user_email", formData.email || "");
        console.log("Auth saved to localStorage:", authObj);
      } catch {
        console.log("Failed to Login", err);
      }
      toast.success("Login Successfull Redirecting to your cinema ...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }, 1500);
  };

  return (
    <div className={loginStyles.pageContainer}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="relative w-full max-w-md z-10">
        <div className={loginStyles.backButtonContainer}>
          <button onClick={goBack} className={loginStyles.backButton}>
            <ArrowLeft size={20} className={loginStyles.backButtonIcon} />
            <span className={loginStyles.backButtonText}>Back to Home</span>
          </button>
        </div>
        <div className={loginStyles.cardContainer}>
          <div className={loginStyles.cardHeader} />
          <div className={loginStyles.cardContent}>
            <div className={loginStyles.headerContainer}>
              <div className={loginStyles.headerIconContainer}>
                <Film className={loginStyles.headerIcon} size={28} />
                <h2 className={loginStyles.headerTitle}>CINEMA ACCESS</h2>
              </div>
              <p className={loginStyles.headerSubtitle}>
                Enter your credentials to continue the experience.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={loginStyles.formContainer}>
              <div className={loginStyles.inputGroup}>
                <label htmlFor="email" className={loginStyles.label}>
                  EMAIL ADDRESS
                </label>
                <div className={loginStyles.inputContainer}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={loginStyles.input}
                    placeholder="Your Email Adrress"
                  />
                  <div className={loginStyles.inputIcon}>
                    <Clapperboard size={16} className="text-red-500" />
                  </div>
                </div>
              </div>

              <div className={loginStyles.inputGroup}>
                <label htmlFor="password" className={loginStyles.label}>
                  PASSWORD
                </label>
                <div className={loginStyles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={loginStyles.inputWithIcon}
                    placeholder="Enter your Password"
                  />
                  <button
                    type="button"
                    className={loginStyles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        className={loginStyles.passwordToggleIcon}
                      />
                    ) : (
                      <Eye
                        size={18}
                        className={loginStyles.passwordToggleIcon}
                      />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`${loginStyles.submitButton} ${
                  isLoading ? loginStyles.submitButtonDisabled : ""
                }`}
              >
                {isLoading ? (
                  <div className={loginStyles.buttonContent}>
                    <div className={loginStyles.loadingSpinner} />
                    <span className={loginStyles.buttonText}>
                      SIGNING IN ...
                    </span>
                  </div>
                ) : (
                  <div className={loginStyles.buttonContent}>
                    <Popcorn size={18} className={loginStyles.buttonIcon} />
                    <span className={loginStyles.buttonText}>
                      ACESS YOR ACCOUNT
                    </span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className={loginStyles.footerContainer}>
          <p className={loginStyles.footerText}>
            Dont have an account ?
            <a href="/signup" className={loginStyles.footerLink}>
              Create one
            </a>
          </p>
        </div>
      </div>
      <style>{loginStyles.customCSS}</style>
    </div>
  );
};

export default LoginPage;
