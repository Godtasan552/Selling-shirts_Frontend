import Link from 'next/link';
import LogoutButton from "@/components/auth_user/LogoutButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-8 space-y-8">



      {/* Main Card */}
      <div className="card w-full max-w-md bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl rounded-xl animate__animated animate__fadeInUp">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-white">Welcome to DaisyUI!</h2>
          <p className="text-white/90">
            This card demonstrates daisyUI + Tailwind + Animate.css with beautiful colors.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-outline btn-white animate__animated animate__headShake hover:scale-105 transition-transform duration-300">
              Click Me
            </button>
          </div>
        </div>
      </div>
      {/* Button go to register page */}
      <div className="card-actions justify-end">
        <Link href="/user_auth/register">
            <button className="btn btn-outline btn-black text-black hover:scale-105 transition-transform duration-300">
          Register
            </button>

        </Link>
      </div>
      <div className="card-actions justify-end">
        <Link href="/user_auth/login">
            <button className="btn btn-outline btn-black text-black hover:scale-105 transition-transform duration-300">
          Login
            </button>

        </Link>
      </div>
      {/* Logout */}
    <div className="card-actions justify-end">
  <LogoutButton />
</div>
   <div className="card-actions justify-end">
        <Link href="/history">
            <button className="btn btn-outline btn-black text-black hover:scale-105 transition-transform duration-300">
            history
            </button>

        </Link>
      </div>
      {/* Alert */}
      <div className="alert alert-success shadow-lg rounded-lg animate__animated animate__fadeInDown w-full max-w-md">
        <div>
          <span className="font-medium text-green-800">Success!</span> Your animation works perfectly.
        </div>
      </div>

      {/* Additional Card */}
      <div className="card w-full max-w-md bg-gradient-to-br from-green-400 to-teal-500 shadow-xl rounded-lg animate__animated animate__fadeInUp animate__delay-1s">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold text-white">Another Card</h2>
          <p className="text-white/90">
            You can stack multiple cards with spacing and smooth animations for better UI.
          </p>
          <div className="card-actions justify-start">
            <button className="btn btn-outline btn-white animate__animated animate__headShake hover:scale-105 transition-transform duration-300">
              Explore
            </button>
          </div>
        </div>
      </div>



    </div>
  );
}