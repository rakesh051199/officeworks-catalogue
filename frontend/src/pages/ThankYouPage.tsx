import { Link } from "react-router-dom";

export function ThankYouPage() {
  return (
    <section className="thank-you">
      <h1>Thank you</h1>
      <p>Your enquiry has been sent to the sales team. They will be in touch.</p>
      <p>
        <Link className="button" to="/">
          Back to catalogue
        </Link>
      </p>
    </section>
  );
}
