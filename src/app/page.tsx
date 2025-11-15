export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-8 space-y-8">

      {/* Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-xl animate__animated animate__fadeInUp">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-primary">Welcome to DaisyUI!</h2>
          <p className="text-gray-700">
            This card demonstrates daisyUI + Tailwind + Animate.css.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary animate__animated animate__pulse hover:scale-105 transition-transform duration-300">
              Click Me
            </button>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="alert alert-success shadow-lg rounded-lg animate__animated animate__fadeInDown w-full max-w-md">
        <div>
          <span className="font-medium text-green-800">Success!</span> Your animation works perfectly.
        </div>
      </div>

      {/* Additional Card for style */}
      <div className="card w-full max-w-md bg-base-200 shadow-xl rounded-lg animate__animated animate__fadeInUp animate__delay-1s">
        <div className="card-body">
          <h2 className="card-title text-lg font-semibold text-secondary">Another Card</h2>
          <p className="text-gray-600">
            You can stack multiple cards with spacing and smooth animations for better UI.
          </p>
          <div className="card-actions justify-start">
            <button className="btn btn-outline btn-secondary animate__animated animate__headShake hover:scale-105 transition-transform duration-300">
              Explore
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
