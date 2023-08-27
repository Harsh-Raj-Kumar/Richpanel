import React ,{useRef, useState}  from 'react';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import './login.css';



function Login({setSelectedPlan}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(email === '' || password === '') {
      alert("Please fill all the fields")
      return;
  } else if(password.length < 1) {
      alert("Password must be atleast 6 characters long")
      return;
  }
  console.log({email, password, remember});
  await axios.post('http://localhost:8800/api/users/login', {
      email: email,
      password: password
  }).then( async (res) => {
      if(res.data.msg === "User logged in successfully"){
        console.log(res.data);
          localStorage.setItem('email', email);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('current_plan', res.data.current_plan);
          localStorage.setItem('subscriptionId', res.data.subscriptionId);
          localStorage.setItem('cancelled', res.data.cancelled);
          localStorage.setItem('planType', res.data.planType);
          // try{
          //   const Name = await axios.get(`http://localhost:8800/api/users/${email}`);

          //   localStorage.setItem('username', Name);
          // }catch(err) {
          //    console.log("Couldn't find username in database",err);
          // }
          if(res.data.current_plan != "Free"){
              setSelectedPlan(res.data.plan_details);
              navigate("/currentPlan");
              return;
          }
          console.log(res.data);
          navigate("/plan");
          
      } else{
          alert(res.data.msg);
      }
  });
  console.log("Login");
};


  return (
    <div className="LContainer">
      <div className="loginContainer">
           <div className="Top">
               Login to your account
            </div>
            <div className="Middle">
            <form onSubmit = {handleFormSubmit}>
                {/* whenever those values are changed ref will change  */}
                <div className="middleItem">
                <label for="remember">Email</label>
                <input type="email" placeholder="manoj@richpanel.com" value={email} onChange={(e) => setEmail(e.target.value)}  />
                </div>
                <div className="middleItem">
                <label for="remember">Password</label>
                <input type="password" placeholder="**********" value={password} onChange={(e) => setPassword(e.target.value)}  />
                </div>
                <div className="RememberMe">
                <input type="checkbox" id="remember" name="interest" value={remember} onChange={(e) => setRemember(!remember)}/>
                <label for="remember">Remember Me</label>
                </div>
                <button className="loginBtn">Login</button>
            </form>
            </div>
            <div className="Bottom">
               New to MyApp? 
               <Link to='/' variant="body2" className="BottomLink">
					Sign Up
				</Link>
            </div>


      </div>
    </div>
  );
}

export default Login;
