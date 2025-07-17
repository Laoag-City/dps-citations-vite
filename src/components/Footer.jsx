import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-3">
      <Container className="py-3 text-center">
        <img
          src="/aap.png"
          height="60"
          className="d-inline-block"
          alt="Alisto Asenso Progreso Logo"
        />
        <img
          src="/bagongpilipinaslores.webp"
          height="60"
          className="d-inline-block"
          alt="Bagong Pilipinas Logo"
        />
        <p>&copy; {new Date().getFullYear()} City Government of Laoag. All rights reserved.</p>
        <small>coding work by: Laoag City ICTO app dev team</small>
      </Container>
    </footer>
  );
};

export default Footer;
