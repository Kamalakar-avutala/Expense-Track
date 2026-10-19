import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import TextInputField from "../../molecules/TextInputField";
import Button from "../../atom/Button";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import CustomToast from "../../atom/Toast";
import { useAuth } from "../../routes/Authenticator";
import { SIGNUP, DASHBOARD } from "../../constants/constants";
import { yupResolver } from '@hookform/resolvers/yup';
import Validations from '../../validations/validationSchemas';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(Validations.loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const toastRef = useRef(null);
  const navigate = useNavigate();

  const { setIsAuthenticated } = useAuth();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      
      const uid = userCredential.user.uid;
      localStorage.setItem("uid", uid);

      // ✅ Store uid in expected format for expenseApi.js
      localStorage.setItem("user", JSON.stringify({ userId: uid }));

      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setIsAuthenticated(true);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Login successful!",
        });
        navigate(DASHBOARD, { replace: true });
      } else {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "User data not found",
        });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Login failed",
      });
    }
  };

  return (
    <section className="d-flex min-vh-100 align-items-center justify-content-center">
      <CustomToast ref={toastRef} />
      <div className="card align-middle border-md mx-auto w-25">
        <div className="card-body w-100 p-4 pb-5">
          <h5 className="card-title fs-2 text-center mb-3">Login</h5>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-4"
          >
            <TextInputField
              id="email"
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email}
            />

            <TextInputField
              id="password"
              label="Password"
              className="w-100"
              type="password"
              {...register("password")}
              error={errors.password}
            />

            <Button type="submit" className="mt-3 mb-3">
              Submit
            </Button>
          </form>

          <div className="text-center">
            <span>Don't have an account? </span>
            <Link to={SIGNUP} className="text-decoration-none">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
