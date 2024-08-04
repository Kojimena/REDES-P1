"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@mui/material'
import XmppService from '@/services/xmppService'
import { useXmpp } from '@/contexts/xmppContext'


export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useXmpp();

  const handleLogin = async () => {
    try {
      login(username, password);
      handleRememberMe();
      router.push('/chat');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  /**
   * Save username and password in local storage
   * @returns {any}
   */
  const handleRememberMe = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }


  return (

    <main className="page bg-white">
      <div className="hero bg-white min-h-screen relative">
        <div className="hero-content flex-col">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black">Login!</h1>
            <p className="py-6">
              A simple and secure chat application using XMPP protocol.
            </p>
            <div className="md:absolute bottom-[40%] left-0 rotate-90 hidden md:block">
              <svg width="250" height="250" viewBox="0 0 111 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M63.9662 24.6342C63.8149 22.3068 63.6688 16.4367 64.0765 15.9553C64.6453 15.2835 65.6207 15.0603 66.434 14.8479C66.4547 12.8709 66.5115 10.8859 66.4817 8.909C66.4661 7.87388 66.4341 6.43165 66.9078 5.48398C67.3935 4.51269 69.4648 3.57462 69.9777 5.04793C70.2278 5.76645 70.1736 6.59026 70.2106 7.33971C70.2857 8.85476 70.2807 10.3718 70.2985 11.8879C70.8766 10.9765 72.4824 10.9116 73.1661 11.738C73.4196 12.0442 73.478 12.4602 73.5115 12.8459C74.4953 11.559 75.9276 12.7682 76.4301 13.8634C76.6901 13.775 76.9402 13.6787 77.2164 13.6522C78.3969 13.5395 79.045 14.7501 79.2069 15.752C79.3503 16.6389 79.387 21.9309 79.3395 24.4892" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M66.4271 14.8378C66.3822 16.1599 66.5801 17.4934 66.5271 18.8186" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M63.2895 28.0142C63.2523 26.9277 63.283 25.8155 63.3017 24.7644C64.544 24.5477 65.7848 24.6946 67.0325 24.7126C68.2232 24.7298 69.4171 24.6231 70.6096 24.6279C73.7276 24.6402 76.8619 24.3769 79.9812 24.4886C79.9667 25.3542 80.0164 26.6628 80.0345 27.7849" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M65.5844 107.397C65.4406 103.957 65.9124 97.7454 64.1602 94.3926C63.1165 92.3955 60.6442 92.3215 58.688 92.2486C53.7396 92.0641 49.8301 91.7565 44.8644 91.6511C20.1939 91.127 21.0913 47.1733 45.9842 46.4985C49.8852 46.3928 53.7576 46.089 57.6707 46.171C61.0787 46.2423 62.0713 44.1579 62.3738 41.0705C62.7935 36.7845 61.8176 32.3053 62.4039 28.0596C65.676 28.2626 68.9407 27.8643 72.2059 27.8735C75.2429 27.8818 78.321 27.9599 81.3584 27.8462C81.0208 29.492 81.4132 31.5605 81.4623 33.2484C81.5819 37.3727 80.9377 45.015 80.7898 49.1412C80.7033 51.5541 80.4474 54.6548 79.0566 56.7044C77.275 59.3297 74.1611 61.3669 71.3259 62.7145C69.2524 63.7 66.9695 64.3399 64.6843 64.5376C61.6636 64.7989 58.6076 65.1774 55.5981 65.4126C52.3138 65.6694 48.8167 66.2486 48.2777 69.6985C48.1 70.8354 48.3882 71.9408 49.2225 72.7646C51.0739 74.5926 59.5438 74.4271 61.4002 74.4039C67.6388 74.3262 76.7962 74.9844 81.7914 81.2901C84.0039 84.0831 84.6768 90.8134 84.6219 94.1327C84.5503 98.4607 84.7645 101.797 84.46 106.119" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="md:absolute bottom-[40%] right-0 -rotate-90 hidden md:block">
              <svg width="250" height="250" viewBox="0 0 111 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M63.9662 24.6342C63.8149 22.3068 63.6688 16.4367 64.0765 15.9553C64.6453 15.2835 65.6207 15.0603 66.434 14.8479C66.4547 12.8709 66.5115 10.8859 66.4817 8.909C66.4661 7.87388 66.4341 6.43165 66.9078 5.48398C67.3935 4.51269 69.4648 3.57462 69.9777 5.04793C70.2278 5.76645 70.1736 6.59026 70.2106 7.33971C70.2857 8.85476 70.2807 10.3718 70.2985 11.8879C70.8766 10.9765 72.4824 10.9116 73.1661 11.738C73.4196 12.0442 73.478 12.4602 73.5115 12.8459C74.4953 11.559 75.9276 12.7682 76.4301 13.8634C76.6901 13.775 76.9402 13.6787 77.2164 13.6522C78.3969 13.5395 79.045 14.7501 79.2069 15.752C79.3503 16.6389 79.387 21.9309 79.3395 24.4892" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M66.4271 14.8378C66.3822 16.1599 66.5801 17.4934 66.5271 18.8186" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M63.2895 28.0142C63.2523 26.9277 63.283 25.8155 63.3017 24.7644C64.544 24.5477 65.7848 24.6946 67.0325 24.7126C68.2232 24.7298 69.4171 24.6231 70.6096 24.6279C73.7276 24.6402 76.8619 24.3769 79.9812 24.4886C79.9667 25.3542 80.0164 26.6628 80.0345 27.7849" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M65.5844 107.397C65.4406 103.957 65.9124 97.7454 64.1602 94.3926C63.1165 92.3955 60.6442 92.3215 58.688 92.2486C53.7396 92.0641 49.8301 91.7565 44.8644 91.6511C20.1939 91.127 21.0913 47.1733 45.9842 46.4985C49.8852 46.3928 53.7576 46.089 57.6707 46.171C61.0787 46.2423 62.0713 44.1579 62.3738 41.0705C62.7935 36.7845 61.8176 32.3053 62.4039 28.0596C65.676 28.2626 68.9407 27.8643 72.2059 27.8735C75.2429 27.8818 78.321 27.9599 81.3584 27.8462C81.0208 29.492 81.4132 31.5605 81.4623 33.2484C81.5819 37.3727 80.9377 45.015 80.7898 49.1412C80.7033 51.5541 80.4474 54.6548 79.0566 56.7044C77.275 59.3297 74.1611 61.3669 71.3259 62.7145C69.2524 63.7 66.9695 64.3399 64.6843 64.5376C61.6636 64.7989 58.6076 65.1774 55.5981 65.4126C52.3138 65.6694 48.8167 66.2486 48.2777 69.6985C48.1 70.8354 48.3882 71.9408 49.2225 72.7646C51.0739 74.5926 59.5438 74.4271 61.4002 74.4039C67.6388 74.3262 76.7962 74.9844 81.7914 81.2901C84.0039 84.0831 84.6768 90.8134 84.6219 94.1327C84.5503 98.4607 84.7645 101.797 84.46 106.119" stroke="black" strokeWidth="2.76298" strokeMiterlimit="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="card bg-white w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black">Email</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                className="input input-bordered" 
                  required  
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black" onChange={(e) => setPassword(e.target.value)}>Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input input-bordered"
                />
                <label className="label">
                  <a href="/signup" className="label-text-alt link link-hover text-black">Don&apos;t have an account?</a>
                </label>
              </div>
              <div className="form-control mt-6">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Sign Up
              </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
