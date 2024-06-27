import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-3">
      <Container className="py-3 text-center">
        <img
          src="/baroalaoag.png"
          height="60"
          className="d-inline-block"
          alt="Baro a Laoag Logo"
        />
        <img
          src="/bagongpilipinashires.png"
          height="60"
          className="d-inline-block"
          alt="Baro a Laoag Logo"
        />
        <p>&copy; {new Date().getFullYear()} City Government of Laoag. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
