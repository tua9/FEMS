import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { loadUsers } from '../services/loadUsers'
import { isUsernameExists, isEmailExists } from '../services/userService'
import { isEmpty, isValidPassword } from '../utils/validators'

export default function RegisterForm() {
  const users = loadUsers()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEmpty(form.username) || isEmpty(form.email) || isEmpty(form.password))
      return setMessage('❌ Không được để trống trường nào')

    if (isUsernameExists(users, form.username))
      return setMessage('❌ Username đã tồn tại')

    if (isEmailExists(users, form.email))
      return setMessage('❌ Email đã tồn tại')

    if (!isValidPassword(form.password))
      return setMessage('❌ Password phải ≥ 8 ký tự')

    setMessage('✅ Đăng ký hợp lệ (mock)')
  }

  return (
    <Form onSubmit={handleSubmit}>
      {message && <Alert>{message}</Alert>}

      <Form.Group className='mb-3'>
        <Form.Label>Username</Form.Label>
        <Form.Control
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type='email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </Form.Group>

      <Button type='submit'>Register</Button>
    </Form>
  )
}
