import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";

const Login = () => {
  const { userLogin, setUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setError, reset } = useForm();

  const loginUser = async (data) => {
    setFormError("");
    const userEmail = data.email;
    const userPass = data.password;

    try {
      const userCredential = await userLogin(userEmail, userPass);
      const user = userCredential.user;
      setUser(user);
      toast.success("Successfully Logged In");

      setFormError("");
      reset();
      navigate(location?.state ? location.state : "/");
    } catch (e) {
      setError("email", { type: "manual", message: e.code });
      setFormError(e.code);
      toast.error(e.code);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      setUser(user);
      toast.success("Successfully Logged In");
      navigate(location?.state ? location.state : "/");
    } catch (error) {
      toast.error(error.code);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="py-6">
            Log in to your account and explore the amazing services we offer.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleSubmit(loginUser)} className="card-body">
            <fieldset className="fieldset">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
                className="input input-bordered w-full"
              />
              {formError && (
                <span className="text-sm text-error my-2">{formError}</span>
              )}
              <button className="btn btn-primary mt-4">Login</button>
            </fieldset>
          </form>
          <div className="divider">OR</div>
          <div className="form-control card-body pb-0">
            <button
              className="btn btn-neutral"
              onClick={googleLogin}
            >
              <FcGoogle className="text-xl mr-2" /> Sign in with Google
            </button>
            <Link to="/auth/register" className="my-3 mb-5 link link-primary">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
