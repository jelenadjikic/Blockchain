import React, { useState, useEffect }  from 'react'
import { useNavigate } from 'react-router-dom'
import web3 from '../ethereum/web3'
import allPurchasesContract from '../ethereum/allPurchases'
import { toast } from 'react-toastify'
import { Box, Button, TextField, Typography, Popover, IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';

// For image
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

function AddNewPurchase() {

  const navigate = useNavigate()

  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPicture, setFormPicture] = useState(null)
  const [formValue, setFormValue] = useState('')

  const [url, setUrl]=useState(null)
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // On submit
  const onSubmit = (e) => {
    e.preventDefault()

    // saving picture in firebase
    const handleUpload = async () => {
        if(!formPicture) return;
        const imageRef = ref(storage, `images/${formPicture.name + v4()}`)
        uploadBytes(imageRef, formPicture)
        .then(result => getDownloadURL(result.ref))
        .then(u=>{
          setUrl(u)
          console.log("URL: ", url)
          createNewPurchase()
        })
        .catch(err => console.log(err))
    }

    handleUpload() 

    const createNewPurchase = async () => {
      try{

        // Creating new purchase... accounts[0] je onaj koji je trenutno logovan
        const accounts = await web3.eth.getAccounts();
        const allPurchases = allPurchasesContract()
        // Value in Purchase contract is sent to /2 of the sender.value
        const inWei = await web3.utils.toWei(formValue*2, 'ether')

        console.log("Acc: " , accounts[0], " Title: " ,formTitle, " Desc: ", formDescription, " Val: ", inWei)
       
        await allPurchases.methods.createPurchase(formTitle, formDescription, url)
                .send({
                    from: accounts[0], 
                    gas: 6000000, 
                    value: inWei
                });
        toast.success("You have successfully added new item!")
        navigate('/activeSales')
      }
      catch(err){
        toast.error(err)
      }
       
    }
  }

  
  return (
    <Box
      component="form"  noValidate autoComplete="off"
      sx={{ '& .MuiTextField-root': { m: 1, width: '100%' }}}
      style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px"}}
    >
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <Typography variant="h5" gutterBottom sx={{ color: "gray", marginTop: "8px"}}>
            Add new item for sale
          </Typography>
          
          <IconButton>
            <InfoIcon sx={{color: "info.dark"}}aria-describedby={id} onClick={handleClick}/>
          </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              style={{width: "80%"}}
            >
              <Typography sx={{ p: 2 }}>
                Before you add any items, read this!
                If you proceed to add an item, double the value of that item will be taken from your account, because of an escrow agreement. 
                Escrow is a legal arrangement in which a third party temporarily holds money until it is confirmed that item has arrived. 
                When customer confirms item has arrived, the deposit will be returned to your account.
              </Typography>
            </Popover>
        </div>
        
        <TextField required 
                  id="outlined-required" 
                  label="Title" 
                  variant="outlined" 
                  value = {formTitle}
                  type="text"  
                  onChange={(e) => setFormTitle(e.target.value)}
        />
        <TextField required 
                  id="outlined-multiline-static" 
                  label="Description" 
                  multiline rows={4} 
                  variant="outlined" 
                  value = {formDescription}
                  type="text"  
                  onChange={(e) => setFormDescription(e.target.value)}
        />
          <TextField required 
                  id="outlined-required" 
                  variant="outlined" 
                  type="file"  
                  onChange={(e) => setFormPicture(e.target.files[0])}
        />
        <TextField required 
                  id="filled-number"
                  label="Value of your item in ETH" 
                  type="number"  
                  variant="outlined"
                  value = {formValue}
                  onChange={(e) => setFormValue(e.target.value)}
        />
      
        <Button variant="contained" size="medium" type='submit' onClick={onSubmit} sx={{width: "100%"}}>
            Add
        </Button>
      
    </Box>
  )
}

export default AddNewPurchase