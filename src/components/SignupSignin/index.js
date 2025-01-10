import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import Input from '../Input';
import "./styles.css";
import Button from '../Button';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} 
   from "firebase/auth";
import {auth,provider,db} from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 


function SignupSigninComponent() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading,setLoading] =useState(false);
   const [loginForm, setLoginForm] = useState(false);
   const navigate = useNavigate

 function signupWithEmail(){
  setLoading(true);
  console.log("Name", name);
  console.log("email",email);
  console.log("password", password);
  console.log("confirmpassword", confirmPassword);
  //Authenticate the User or create a accout using email and pass
  if(name!=="" && email!=="" && password!=="" && confirmPassword!==""){
    if(password===confirmPassword){
      createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log("User>>>", user);
      toast.success("User Created!");
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      createDoc(user);
      //Create a doc with user id as the following id

       navigate("/dashboard")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
     const errorMessage = error.message;
     toast.error(errorMessage);
     setLoading(false);

     // ..
   });
    }else{
      toast.error("Password and Confirm Password don't match");
    }
   
  }
  else{
    toast.error("All fields are Mandatory")
    setLoading(false);
  }
 }

 function loginUsingEmail() {
  console.log("Email", email);
  console.log("Password",password);
  setLoading(true);
  if( email!=="" && password!=="" ){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged In!");
    console.log("User Logged in", user);
    setLoading(false);
    //navigate("/dashboard")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setLoading(false);
    toast.error(errorMessage);
  });
} else{
  toast.error("All fields are mandatory");
  setLoading(false);
}


 }

 async function createDoc(user) {
  setLoading(true);
  //create a doc.
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userData = await getComputedStyle.Doc(userRef);
  
  if (!userData.exists()){
  try{
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName ? user.displayName : name,
      email: user.email,
      photoURL : user.photoURL ? user.photoURL: "",
      createdAt: new Date(),
    });
    toast.success("Doc created!");
    setLoading(false);
  } catch (e) {
    toast.error(e.message);
    setLoading(false);
  }
  }else{
    toast.success("Doc already exists");
  }
   }
 function googleAuth(){
  setLoading(true);
  try{

    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("user>>>", user);
      toast.success("user authenticated!");
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
    });
   }
   catch (e){toast.error(e.message)}

  }
  return (
    <>
    {loginForm ? (<div className='signup-wrapper'>
      <h2 className='title'>
        Login on <span style={{color:"var(--theme)"}}>Expense-Tracker.</span>
        </h2>
        <form>
         
         <Input 
         type={"email"}
          label={"Email"}
          state={email}
         setState={setEmail}
          placeholder={"protyusa12@gmail.com"}
          />
          <Input
          type="password"
          label={"Password"}
         state={password}
          setState={setPassword}
          placeholder={"Example:P@123"}
          />
          
          <Button 
          disabled={loading}
          text={loading? "Loading...":"Login using Email and Password"} onClick={loginUsingEmail}/>

          <p className='p-login'>or</p>
          <Button 
          onClick={googleAuth} 
          text={loading? "Loading...":"Login using Google"} blue={true} />
          <p className='p-login' 
          style={{cursor:"pointer"}}
          onClick={()=>setLoginForm(!loginForm)}
          >
            Or Don't Have an Account? Click Here
            </p>
        </form>
        </div>):(
    <div className='signup-wrapper'>
      <h2 className='title'>
        SignUp on <span style={{color:"var(--theme)"}}>Expense-Tracker.</span>
        </h2>
        <form>
          <Input 
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"Protyusa Mondal"}
          />
         <Input 
         type={"email"}
          label={"Email"}
          state={email}
         setState={setEmail}
          placeholder={"protyusa12@gmail.com"}
          />
          <Input
          type="password"
          label={"Password"}
         state={password}
          setState={setPassword}
          placeholder={"Example:P@123"}
          />
          <Input
          type="password"
          label={"Confirm Password"}
         state={confirmPassword}
         setState={setConfirmPassword}
          placeholder={"Example:P@123"}
          />
          <Button 
          disabled={loading}
          text={loading? "Loading...":"SignUp using Email and Password"} onClick={signupWithEmail}/>
          <p className='p-login'>or</p>
          <Button
           onClick={googleAuth}  
          text={loading? "Loading...":"SignUp using Google"} blue={true} />
          <p className='p-login'
           style={{cursor:"pointer"}}
           onClick={()=>setLoginForm(!loginForm)}
          >
            or Have An Account Already? Click Here
          </p>
          
        </form>
        </div>
        )}
        </>
  );
}

export default SignupSigninComponent