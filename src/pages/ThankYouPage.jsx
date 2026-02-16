import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <div className="app-container thank-you">
      <h1>Thank You!</h1>
      <p>
        Your survey responses have been submitted successfully. Your input is valuable
        and will contribute to understanding AI tool acceptance in engineering education
        and practice.
      </p>
      <Link to="/" className="btn btn-secondary">
        Return to Home
      </Link>
    </div>
  );
}
