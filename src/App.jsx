import { Container, Row, Col } from 'react-bootstrap'
import RegisterForm from './components/RegisterForm'

function App() {
  return (
    <Container fluid className='min-vh-100 d-flex align-items-center'>
      <Row className='w-100 justify-content-center'>
        <Col md={4}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  )
}

export default App
