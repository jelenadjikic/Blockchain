import React, { useState}  from 'react'
import { toast } from 'react-toastify'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Typography, Divider, Rating, Box  } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';


const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
}

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}
  
function RateTheSeller({purchase}) {

  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);


  // Rate the seller
  const onSubmit = (e) => {
    
    e.preventDefault()

    const rate = async () => {
      try{
        const allPurchasesInstance = allPurchasesContract()
        const accounts = await web3.eth.getAccounts()
        await allPurchasesInstance.methods.vote(purchase.seller, purchase.address, value)
            .send({
                from: accounts[0],
                gas: 6000000
            })
        toast.success("You have successfully rated the seller: " + purchase.seller)
        window.location.reload(true);
      }
      catch(err){
        toast.error(err)
      }
       
    }
    rate()
    toggle()
  }

  return (
    <>
    <ThumbsUpDownIcon  onClick = {toggle} />
    <Modal isOpen={modal} toggle={toggle}  >
        <ModalHeader toggle={toggle}>Rate this seller</ModalHeader>
        <ModalBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
          <Typography> How was your experience with this seller? Help others by rating this seller!</Typography>
          <Divider></Divider>
          <Box
              sx={{
              width: 200,
              display: 'flex',
              alignItems: 'center',
              marginTop: '20px',
              marginBottom: '20px'
              }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              getLabelText={getLabelText}
              size="large"
              onChange={(event, newValue) => {
                  setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                  setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="outlined" size="medium"  color="success" style={{marginRight: "10px"}} onClick = {onSubmit} >
              Rate
          </Button>
          <Button variant="outlined" size="medium" color="error" onClick = {toggle}>
              Cancel
          </Button>
        </ModalFooter>
      </Modal>
   
</>
  )
}

export default RateTheSeller