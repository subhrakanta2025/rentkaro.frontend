import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Redirect shim so the old /new-booking/:id route forwards to the real booking flow
// at /booking/:id. Keeps existing links working while avoiding duplicate pages.
const NewBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/booking/${id}`, { replace: true });
    }
  }, [id, navigate]);

  return null;
};

export default NewBookingPage;

