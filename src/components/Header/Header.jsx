import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import CustomToast from "../../atom/Toast";
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useAuth } from "../../routes/Authenticator";

const Header = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const menu = useRef(null);
  const [userName, setUserName] = useState("");

  const { setIsAuthenticated } = useAuth(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "User");
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const items = [
    {
      label: 'Profile',
      icon: 'pi pi-cog',
      command: () => navigate('/profile')
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => handleLogout()
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      localStorage.removeItem("token"); // Clear token
      setIsAuthenticated(false);        // Set auth false
      navigate("/login", { replace: true }); // Redirect

    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <CustomToast ref={toast} />
      <nav className="navbar navbar-expand-lg bg-dark border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            Expense Track
          </a>
          <button
            className="navbar-toggler bg-transparent"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav align-items-center justify-content-end w-100 pe-4">
              <div className="d-flex align-items-center user-profile">
                <Button
                  label={userName}
                  icon="pi pi-angle-down"
                  className="p-button-text bg-transparent text-white"
                  onClick={(e) => menu.current?.toggle(e)}
                />
                <Menu model={items} popup ref={menu} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
