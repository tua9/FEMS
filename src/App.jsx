function App() {
  return (
    <div className='container vh-100 d-flex justify-content-center align-items-center'>
      <div className='card p-4 shadow' style={{ width: '350px' }}>
        <h3 className='text-center mb-3'>Login</h3>

        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
          />
        </div>

        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
          />
        </div>

        <button className='btn btn-primary w-100'>Login</button>

        <p className='text-center mt-3 mb-0'>
          No account? <a href='#'>Register</a>
        </p>
      </div>
    </div>
  )
}

export default App
