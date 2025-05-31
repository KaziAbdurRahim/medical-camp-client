import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../firebase/firebase.init";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [buyPackage, setBuyPackage] = useState(false);

  const userRegister = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const setProfile = (name, photoURL) => {
    // setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    setIsAdmin(false);
    setLoading(true);
    return signOut(auth);
  };

  // const displayName = () => //console.log(auth.currentUser.displayName, auth.currentUser.photoURL)

  const authInfo = {
    userRegister,
    userLogin,
    setProfile,
    // displayName,
    user,
    loading,
    isAdmin,
    setUser,
    logOut,
    signInWithGoogle,
    resetPassword,
    setLoading,
    buyPackage,
    setBuyPackage,
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // console.log(currentUser.displayName, currentUser.email);
        const newuser = {
          name: currentUser.displayName,
          email: currentUser.email,
        };
        //call create user api in backend
        try {
          const res = await axios.post(
            "https://medical-camp-server-zeta.vercel.app/create-user",
            newuser
          );
          // console.log('user created', res.data);
        } catch (error) {
          console.error("Error creating user:", error);
        }

        //check if user is admin
        try {
          const res2 = await axios.get(
            `https://medical-camp-server-zeta.vercel.app/is-admin?email=${currentUser.email}`
          );
          // console.log('isAdmin', res2.data);
          if (res2.data.isAdmin) {
            console.log(res2.data);
            setIsAdmin(true);
            // console.log('admin hit');
          }
        } catch (error) {
          console.error("Error checking admin:", error);
        }
      }
      // if(currentUser){
      //     // console.log("hit jwt");
      //     const jwtUser = {email: currentUser?.email}
      //     // console.log(jwtUser);
      //     //getting jwt token
      //     axios.post('https://consult-hive-server.vercel.app/jwt', jwtUser, {withCredentials: true})
      //     .then(res => {
      //         // console.log(res.data);
      //     })
      // }

      setLoading(false);
    });
    return () => {
      unsubcribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
// export {AuthContext}
