import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from '@mui/material'

function Home() {

  const navigate = useNavigate()

  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>Online shop</h1>
      <Typography>
        Put your items up for sale or buy items from others !
      </Typography>
      <Button sx={{marginTop: "20px", color: "white"}} variant="contained" size="large"  onClick = {() => {navigate("/activeSales")}}>
          See active sales
      </Button>
     </div>
  )
}

export default Home