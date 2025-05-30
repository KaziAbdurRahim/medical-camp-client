import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";


const Register = () => {
  const { userRegister, setProfile, setUser, signInWithGoogle } =
    useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(password);
  };

  const registerUser = async (data) => {
    setFormError("");
    const { email, password, name, photoUrl } = data;

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must have at least one uppercase letter, one lowercase letter, and be at least 6 characters long."
      );
      return;
    }
    setPasswordError("");

    try {
      const userCredential = await userRegister(email, password);
      const user = userCredential.user;

      setUser(user);
      toast.success("Successfully Registered");

      await setProfile(name, photoUrl);
      setFormError("");
      navigate(location?.state ? location.state : "/");
    } catch (e) {
      setFormError(e.code);
      toast.error(e.code);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      setUser(user);
      navigate(location?.state ? location.state : "/");
    } catch (error) {
      toast.error(error.code);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">

      <div className="hero-content flex-col">
        <div className="text-center ">
          <h1 className="text-5xl font-bold">Register Now!</h1>
          <p className="py-6">
            Join us today and explore the amazing services we offer.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleSubmit(registerUser)} className="card-body">
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
              {errors.email && <span className="text-sm text-error my-2">Email is required</span>}
            
           
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
                className="input input-bordered w-full"
              />
              {passwordError && (
                <span className="text-sm text-error my-2">{passwordError}</span>
              )}
            
            
              <label className="label">
                <span className="label-text">User Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Name"
                className="input input-bordered w-full"
              />
              {errors.name && <span className="text-sm text-error my-2">Name is required</span>}
           
           
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="text"
                {...register("photoUrl", { required: true })}
                placeholder="Photo URL"
                className="input input-bordered w-full"
              />
              {errors.photoUrl && <span className="text-sm text-error my-2">Photo URL is required</span>}
            
            {formError && (
              <span className="text-sm text-error mt-1 text-wrap ">{formError}</span>
            )}
            
              <button className="btn btn-primary mt-4">Register</button>
            
            </fieldset>
          </form>
          <div className="divider">OR</div>
          <div className="form-control card-body pb-0">
            <button
              className="btn btn-neutral "
              onClick={googleLogin}
            >
              <FcGoogle className="text-xl mr-2" /> Sign in with Google
            </button>
            <Link to="/auth/login" className="my-3 mb-5  link link-primary">
              Already have an account? Login
            </Link>
          </div>
          {/* <div className="form-control mt-4">
            <Link to="/auth/login" className=" link link-primary">
              Already have an account? Login
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
