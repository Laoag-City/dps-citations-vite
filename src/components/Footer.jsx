import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-3">
      <Container className="py-3 text-center">
        <img
          src="/baroalaoag.png"
          height="60"
          className="d-inline-block"
          alt="Baro a Laoag Logo"
        />
        <img
          src="/bagongpilipinaslores.webp"
          height="60"
          className="d-inline-block"
          alt="Baro a Laoag Logo"
        />
        <p>&copy; {new Date().getFullYear()} City Government of Laoag. All rights reserved.</p>
        <small>coded by: Laoag City ICTO app dev team</small>
      </Container>
    </footer>
  );
};

export default Footer;
