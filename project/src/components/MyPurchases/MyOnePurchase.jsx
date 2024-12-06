import React, { useState, useEffect }  from 'react'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import {ImageListItem, ImageListItemBar, ListSubheader } from'@mui/material';
import IconButton from '@mui/material/IconButton';
import ConfirmReceivedModal from '../Modals/ConfirmReceivedModal';
import RateTheSeller from './RateTheSeller';

// MyOnePurchase card - canConfirm received or rate
function MyOnePurchase({purchase}) {

  const [valueInEther, setValueInEther] = useState(0)
  const [isReceived, setIsReceived] = useState(false)
  
  const [canVote, setCanVote] = useState(true);

  // Use Effect - covertToEther and WhatToShow - confirm or rate
  useEffect(() => {

    const convertValueToEther = async () => {
        let valEther = await web3.utils.fromWei(purchase.value, 'ether')
        setValueInEther(valEther)
    }
    convertValueToEther()

    const whatToShow = async () => {
      // State locked (1) - isReceived je false, tek treba da odobrimo
      // State innactive (2) - isReceived je true, odorbeno, kupljeno i stiglo, sada može da ocenjuje
      if(purchase.state == 1)
        setIsReceived(false)
      else if(purchase.state == 2)
        setIsReceived(true)

      // ako je received znaci moze da se glasa, ako je vec glasao onda ne
      if(purchase.state == 2){
        const allPurchasesInstance = allPurchasesContract()
        const accounts = await web3.eth.getAccounts()
        const canVo = await allPurchasesInstance.methods.canVote(purchase.seller, purchase.address , accounts[0]).call()
        setCanVote(canVo)
      }
    }

      whatToShow()
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
            title={"Bought for " + valueInEther.toString() + " ETH"}
            subtitle= {"Seller: " + purchase.seller}
            actionIcon={
              <>
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${purchase.title}`}
              >
                {!isReceived && 
                 <ConfirmReceivedModal key={purchase.address} purchase={purchase}/>
                }  
                {isReceived && canVote && 
                  <RateTheSeller key={purchase.address} purchase={purchase} />
                }
                    
              </IconButton>
            </>
            }
          />
        </ImageListItem>

    </div>
          
  )
}

export default MyOnePurchase