import React ,{useRef, useState}  from 'react';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import './register.css';



function Register() {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    try {
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        e.preventDefault();
        console.log("Inside frontend route");
        await axios.post("http://localhost:8800/api/users/register", newUser);
        navigate('/login');

    }catch(err) {
        console.log(err);
    }
};



  return (
    <div className="RContainer">
      <div className="registerContainer">
           <div className="Top">
               Create Account
            </div>
            <div className="Middle">
            <form action="" onSubmit = {handleFormSubmit}>
                {/* whenever those values are changed ref will change  */}
                <div className="middleItem">
                <label for="remember">Name</label>
                <input type="text" placeholder="Manoj Kumar" ref={nameRef}  />
                </div>
                <div className="middleItem">
                <label for="remember">Email</label>
                <input type="email" placeholder="manoj@richpanel.com" ref={emailRef}  />
                </div>
                <div className="middleItem">
                <label for="remember">Password</label>
                <input type="password" placeholder="**********" ref={passwordRef}  />
                </div>
                <div className="RememberMe">
                <input type="checkbox" id="remember" name="interest" value="remember"  />
                <label for="remember">Remember Me</label>
                </div>
                <button className="registerBtn">Sign Up</button>
            </form>
            </div>
            <div className="Bottom">
               Already have an account? 
               <Link to='/login' variant="body2" className="BottomLink">
					Login
				</Link>
            </div>


      </div>
    </div>
  );
}

export default Register;
