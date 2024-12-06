import React, { useState, useEffect }  from 'react'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import {CardMedia, Typography, Rating, Dialog, AppBar, Toolbar, Slide, DialogActions, DialogContent, IconButton, Divider, ImageListItemBar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import AbortModal from '../Modals/AbortModal';
import ConfirmPurchaseModal from '../Modals/ConfirmPurchaseModal';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Active Sale - one item fullscreen dialog 
export default function ActiveSale({purchase}) {

    const [open, setOpen] = useState(false);
    const [isSeller, setIsSeller] = useState(true)
    
    const [rate, setRate] = useState(0)
    const [numOfRatings, setNumOfRatings] = useState(0)

    // Use Effect
    useEffect(() => {

    const getAddress= async () => {
        const accounts = await web3.eth.getAccounts()
        console.log("Accounts[0]: ", accounts[0])
        if(accounts[0] === purchase.seller)
            setIsSeller(true)
        else setIsSeller(false)
    }
    getAddress()  

    const ratings = async () => {
      const allPurchasesInstance = allPurchasesContract()
      const totalRate = parseInt(await allPurchasesInstance.methods.getTotalRateForSeller(purchase.seller).call());
      const numOfRatings = parseInt(await allPurchasesInstance.methods.getNumberOfTimesRatedForSeller(purchase.seller).call());
      
      // Ocenjivan je do sada
      if(numOfRatings != 0){
          const averageRate = totalRate / numOfRatings
          setRate(averageRate)
          setNumOfRatings(numOfRatings)
          console.log(rate)
      } 
      else {
          // Nikad nije ocenjen
          setNumOfRatings(0)
      }
    }
    ratings()
    }, []);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

  return (
    <div>
      <FullscreenIcon onClick={handleClickOpen} />
     
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style ={{ zIndex: "1"}}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {purchase.title + "  - on sale "}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", flexWrap: "wrap",justifyContent: "space-evenly"}}>
            <div style={{ width: "60%" }}>

              <Divider>About this item</Divider>
              <Typography style={{marginTop: "20px", marginBottom: "20px"}} variant="subtitle1">
                {purchase.description}
              </Typography>

              <Divider>Sellers address   &  rating</Divider>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", marginTop: "20px", marginBottom: "20px"}}>
              <Typography variant="subtitle1" style={{marginRight: "30px"}}>
                {purchase.seller}
              </Typography>
              <Typography >
                {numOfRatings != 0 ? 
                  (
                      <Rating name="read-only" value={rate}  precision={0.5} readOnly />
                  ): (
                      <div> Not rated yet </div>
                  )}
              </Typography>
              </div>
            </div>
 
            <CardMedia
                component="img"
                src = { `${purchase.picture}`}
                alt="Image"
                style ={{
                  width: "370px",
                  height: "370px",
                  borderRadius: "5px",
                  padding: "5px",
                  border: "gray solid 1px",
                  objectFit: "contain"
                }}  
            />
    
        </div>  
        </DialogContent>

        <DialogActions>
        <ImageListItemBar className= "titleBar" title=  {"Price: " + purchase.value.toString() + " ETH"} sx= {{ "& .MuiImageListItemBar-title": { color: "#212121" } , bgcolor: "#e0e0e0"}}/>
          {isSeller ? 
            (
              <div  style={{marginRight: "40px"}}>
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                >
                 <AbortModal key={purchase.address} purchase={purchase}/>
                </IconButton>
              </div>
            ):(
                <ConfirmPurchaseModal key={purchase.address} purchase={purchase}/>
            )}
        </DialogActions>
      </Dialog>
    </div>
  );
}