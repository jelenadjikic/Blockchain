import React, { useState, useEffect }  from 'react'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import PurchaseContract from '../../ethereum/purchase'
import { Button, Typography } from '@mui/material'
import OneSoldItem from './OneSoldItem'

function SoldItems() {

  // Donation adresses - initialy empty array
  const [purchasesAddresses, setPurchasesAddresses] = useState([])
  const [purchases, setPurchases] = useState([])

  // Use Effect - fetch sold items
  useEffect(() => {
    console.log("Component SoldItems -> mounted...")

    const fetchSoldItems= async () => {
      
      console.log("Component SoldItems -> fetching sold items...")
      const allPurchasesInstance = allPurchasesContract()
      const accounts = await web3.eth.getAccounts()
      const allPurchasesAddresses = await allPurchasesInstance.methods.getPurchases().call({from: accounts[0]});

      // Setting the adresses to fetched array
      setPurchasesAddresses(allPurchasesAddresses)

      // All purchases
      let all = []
      let allPurchases = await Promise.all(

        Array(allPurchasesAddresses.length).fill().map( async (element, i) => {
          const purchaseInstance = PurchaseContract(allPurchasesAddresses[i]);

          let purchase = {
            address: allPurchasesAddresses[i]
          }

          purchase["state"] = await purchaseInstance.methods.state().call()
          purchase["successfull"] = await purchaseInstance.methods.successfull().call()
          if(purchase.state == 2 && purchase.successfull == true){   
            await Promise.all(
              purchase["title"] = await purchaseInstance.methods.title().call(),
              purchase["description"] = await purchaseInstance.methods.description().call(),
              purchase["picture"] = await purchaseInstance.methods.picture().call(),
              purchase["value"] = await purchaseInstance.methods.value().call(),
              purchase["seller"] = await purchaseInstance.methods.seller().call(),
              purchase["buyer"] = await purchaseInstance.methods.buyer().call(),
            )

            all.push(purchase)
            return purchase;
          }
        })
      )
      setPurchases(all)
    }

    fetchSoldItems()  
  }, []);

  // Return
  return (
    <div>
      <Typography variant="h5" gutterBottom style = {{display: "flex", justifyContent:"center", marginTop: "30px"}} sx={{ color: "gray"}}>
        Sold items
      </Typography>
          
      { (purchases.length) > 0 ? 
      (
        <div style = {{display:"flex", flexDirection:"column", justifyContent: "center", flexWrap: "wrap"}}>
          {purchases.map( (purchase) => (
            <OneSoldItem key={purchase.address} purchase={purchase}/>
          ))}
        </div>
      ): (
          <Typography variant="h5" gutterBottom sx={{ color: "gray"}}>
            There are no sold items!
          </Typography>

      )}

    </div>

  )
}

export default SoldItems