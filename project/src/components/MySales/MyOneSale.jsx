import React, { useState, useEffect }  from 'react'
import web3 from '../../ethereum/web3'
import {ImageListItem, ImageListItemBar, ListSubheader, IconButton} from'@mui/material';

import AbortModal from '../Modals/AbortModal';

function MyOneSale({purchase}) {

    const [valueInEther, setValueInEther] = useState(0)   
    const [canAbort, setCanAbort] = useState(false)
    const [buyer, setBuyer] = useState(true)
    const [stateOfItem, setStateOfItem] = useState("On sale")
    
  // Use Effect - Convert value to ether
  useEffect(() => {

    const convertValueToEther = async () => {
        let valEther = await web3.utils.fromWei(purchase.value, 'ether')
        setValueInEther(valEther)
    }

    convertValueToEther()

    // Seller can abort purchase only in state 0 - Created
    // If somebody confrimed purchase, seller can NOT abort it
    if(purchase.state == 0)
      setCanAbort(true)

    if(purchase.buyer.startsWith("0x000000"))
      setBuyer(false)

      
      if(purchase.state == 0)
        setStateOfItem("On sale")
      else if (purchase.state == 1)
        setStateOfItem("Ordered")
      else if (purchase.state == 2 && purchase.successfull)
        setStateOfItem("Sold")
      else if(purchase.state == 2 && !purchase.successfull)
        setStateOfItem("Aborted, was on sale ")

  }, []);

    return (
      <div style ={{height: "300px", width:"250px"}}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">{purchase.title}</ListSubheader>
      </ImageListItem>
      <ImageListItem>
        <img
          src={ `${purchase.picture}`}
          srcSet={ `${purchase.picture}`}
          alt="Image"
          loading="lazy"
          className='itemCardImg'
          style={{
            height: "250px",
            objectFit: "contain"
           }}
        />
         
      <ImageListItemBar
        title={stateOfItem + " for " + valueInEther.toString() + " ETH\n  "}
        subtitle=  {buyer==true ? ("Bought by: " + purchase.buyer): ("") }
        actionIcon={
        <>
          <IconButton
            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
            aria-label={`info about ${purchase.title}`}
          >
            {canAbort ? 
              (
                <AbortModal key={purchase.address} purchase={purchase}/>
              ): (
                  <div></div>
              )
            }
            
          </IconButton>
        </>
        }
      />
      </ImageListItem>
    </div>
        
       
          
             
  )
}

export default MyOneSale